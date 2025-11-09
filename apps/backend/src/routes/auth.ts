import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { query } from '../config/database';
import { getRedisClient } from '../config/redis';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { successResponse } from '../utils/response';

const BCRYPT_ROUNDS = 12;

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['candidate', 'tutor', 'admin', 'school']).default('candidate'),
  schoolId: z.string().uuid().optional(),
  cohort: z.enum(['SS1', 'SS2', 'SS3']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    
    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [body.email]
    );
    
    if (existingUser.rows.length > 0) {
      throw new BadRequestError('Email already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
    
    // Create user
    const result = await query(
      `INSERT INTO users (name, email, hashed_password, role, school_id, cohort, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING id, name, email, role, school_id, cohort, created_at`,
      [body.name, body.email, hashedPassword, body.role, body.schoolId || null, body.cohort || null]
    );
    
    const user = result.rows[0];
    
    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    
    // Store refresh token in Redis
    const redis = getRedisClient();
    await redis.setex(
      `refresh_token:${user.id}`,
      7 * 24 * 60 * 60, // 7 days
      refreshToken
    );
    
    return successResponse(reply, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.school_id,
        cohort: user.cohort,
      },
      accessToken,
      refreshToken,
    }, 'User registered successfully', 201);
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    
    // Find user
    const result = await query(
      `SELECT id, name, email, hashed_password, role, school_id, cohort, status
       FROM users WHERE email = $1`,
      [body.email]
    );
    
    if (result.rows.length === 0) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    const user = result.rows[0];
    
    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is inactive');
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(body.password, user.hashed_password);
    if (!passwordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    
    // Store refresh token in Redis
    const redis = getRedisClient();
    await redis.setex(
      `refresh_token:${user.id}`,
      7 * 24 * 60 * 60, // 7 days
      refreshToken
    );
    
    // Update last active
    await query(
      'UPDATE users SET last_active_at = NOW() WHERE id = $1',
      [user.id]
    );
    
    return successResponse(reply, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.school_id,
        cohort: user.cohort,
      },
      accessToken,
      refreshToken,
    }, 'Login successful');
  });

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    const body = refreshSchema.parse(request.body);
    
    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(body.refreshToken);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    
    // Check if refresh token exists in Redis
    const redis = getRedisClient();
    const storedToken = await redis.get(`refresh_token:${payload.userId}`);
    
    if (storedToken !== body.refreshToken) {
      throw new UnauthorizedError('Refresh token not found or expired');
    }
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    
    // Update refresh token in Redis
    await redis.setex(
      `refresh_token:${payload.userId}`,
      7 * 24 * 60 * 60,
      newRefreshToken
    );
    
    return successResponse(reply, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }, 'Token refreshed successfully');
  });

  // Logout
  fastify.post('/logout', async (request, reply) => {
    const body = refreshSchema.parse(request.body);
    
    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(body.refreshToken);
    } catch (error) {
      // Even if token is invalid, we'll try to delete it
      return successResponse(reply, null, 'Logged out successfully');
    }
    
    // Delete refresh token from Redis
    const redis = getRedisClient();
    await redis.del(`refresh_token:${payload.userId}`);
    
    return successResponse(reply, null, 'Logged out successfully');
  });
}
