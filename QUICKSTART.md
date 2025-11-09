# Quick Start Guide

Get the JAMB CBT Prep system running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- Docker and Docker Compose installed
- npm or yarn

## Step 1: Start Database Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Wait for services to be healthy (about 10 seconds)
docker-compose ps
```

## Step 2: Setup Backend

```bash
# Navigate to backend
cd apps/backend

# Copy environment file
cp .env.example .env

# Install dependencies (if not already done)
npm install

# Run database migrations
npm run migrate:up

# Seed subjects and topics
npm run seed:subjects

# Seed demo data (users, questions, exam template)
npm run seed:demo
```

## Step 3: Start Backend Server

```bash
# In apps/backend directory
npm run dev
```

The backend API will be running at `http://localhost:3000`

## Step 4: Start Frontend

```bash
# In a new terminal, navigate to frontend
cd apps/frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

## Step 5: Login and Test

Open your browser to `http://localhost:5173`

### Demo Credentials

**Admin Account:**
- Email: `admin@jamb-cbt.com`
- Password: `admin123`

**Candidate Accounts:**
- Email: `chidi@example.com` / Password: `candidate123`
- Email: `amina@example.com` / Password: `candidate123`

## API Endpoints

### Health Checks
- `GET http://localhost:3000/health/live` - Liveness check
- `GET http://localhost:3000/health/ready` - Readiness check (includes DB/Redis)

### Authentication
- `POST http://localhost:3000/api/auth/register` - Register new user
- `POST http://localhost:3000/api/auth/login` - Login
- `POST http://localhost:3000/api/auth/refresh` - Refresh token
- `POST http://localhost:3000/api/auth/logout` - Logout

## Testing the API

### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "candidate",
    "cohort": "SS3"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "chidi@example.com",
    "password": "candidate123"
  }'
```

## Troubleshooting

### Database connection failed
- Ensure Docker containers are running: `docker-compose ps`
- Check logs: `docker-compose logs postgres`
- Restart services: `docker-compose restart`

### Redis connection failed
- Check Redis is running: `docker-compose ps redis`
- Check logs: `docker-compose logs redis`

### Port already in use
- Backend (3000): Change `PORT` in `.env`
- Frontend (5173): Vite will automatically use next available port
- PostgreSQL (5432): Change port mapping in `docker-compose.yml`
- Redis (6379): Change port mapping in `docker-compose.yml`

## Stopping Services

```bash
# Stop backend and frontend (Ctrl+C in their terminals)

# Stop Docker services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Next Steps

- Explore the API documentation
- Create exam templates
- Take practice exams
- View analytics dashboard
- Customize the system for your needs

## Demo Data Summary

- **1 School**: Lagos Model College
- **3 Users**: 1 admin, 2 candidates
- **20 Questions**: 10 Math, 10 English
- **1 Exam Template**: JAMB Practice Test (20 questions, 60 minutes)
- **Subjects**: All 16 JAMB subjects with topics

Enjoy using the JAMB CBT Prep System! 🎓
