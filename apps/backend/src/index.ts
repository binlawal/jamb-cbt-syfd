import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { testConnection, closePool } from './config/database';
import { connectRedis, testRedisConnection, closeRedis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Initialize Fastify
const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  requestIdLogLabel: 'reqId',
  disableRequestLogging: false,
  requestIdHeader: 'x-request-id',
});

// Set error handler
fastify.setErrorHandler(errorHandler);

// Register plugins
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });
}

// Register routes
async function registerRoutes() {
  const { authRoutes } = await import('./routes/auth');
  await fastify.register(authRoutes, { prefix: '/api/auth' });
}

// Health check routes
fastify.get('/health/live', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

fastify.get('/health/ready', async () => {
  const dbHealthy = await testConnection();
  const redisHealthy = await testRedisConnection();
  
  const status = dbHealthy && redisHealthy ? 'ready' : 'not_ready';
  const statusCode = status === 'ready' ? 200 : 503;
  
  return {
    status,
    timestamp: new Date().toISOString(),
    checks: {
      database: dbHealthy ? 'healthy' : 'unhealthy',
      redis: redisHealthy ? 'healthy' : 'unhealthy',
    },
  };
});

// Root route
fastify.get('/', async () => {
  return {
    name: 'JAMB CBT Prep API',
    version: '1.0.0',
    status: 'running',
  };
});

// Start server
async function start() {
  try {
    // Connect to Redis
    await connectRedis();
    fastify.log.info('Redis connected');

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    fastify.log.info('Database connected');

    // Register plugins
    await registerPlugins();

    // Register routes
    await registerRoutes();

    // Start listening
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`Server listening on ${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    fastify.log.info(`Received ${signal}, closing server...`);
    
    // Close connections
    await fastify.close();
    await closePool();
    await closeRedis();
    
    fastify.log.info('Server closed gracefully');
    process.exit(0);
  });
});

start();
