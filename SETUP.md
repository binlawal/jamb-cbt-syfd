# JAMB CBT Prep - Setup Guide

This guide will help you set up the JAMB CBT Prep system for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ and **npm** 10+
- **PostgreSQL** 15+
- **Redis** 7+
- **Git**

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd jamb-cbt-prep

# Install dependencies
npm install
```

### 2. Set Up Environment Variables

```bash
# Backend environment
cp apps/backend/.env.example apps/backend/.env

# Frontend environment
cp apps/frontend/.env.example apps/frontend/.env
```

Edit `apps/backend/.env` and update the following:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL=postgresql://postgres:password@localhost:5432/jamb_cbt_prep

# Redis - Update if needed
REDIS_URL=redis://localhost:6379

# JWT Secrets - Generate secure random strings
JWT_ACCESS_SECRET=your-secure-access-secret-here
JWT_REFRESH_SECRET=your-secure-refresh-secret-here
```

### 3. Set Up Database

```bash
# Create the database
createdb jamb_cbt_prep

# Run migrations
npm run migrate:up --workspace=apps/backend

# Seed initial data (subjects and topics)
npm run seed:subjects --workspace=apps/backend
```

### 4. Start Development Servers

```bash
# Start all services (backend + frontend)
npm run dev

# Or start individually:
npm run dev:backend  # Backend on http://localhost:3000
npm run dev:frontend # Frontend on http://localhost:5173
```

### 5. Verify Setup

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health/ready

The health check should return:
```json
{
  "status": "ready",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "checks": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

## Detailed Setup

### PostgreSQL Setup

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
createdb jamb_cbt_prep
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb jamb_cbt_prep
```

#### Windows
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

### Redis Setup

#### macOS (using Homebrew)
```bash
brew install redis
brew services start redis
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

#### Windows
Download from [Redis Downloads](https://redis.io/download) or use WSL

### Generating JWT Secrets

Generate secure random strings for JWT secrets:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

## Database Migrations

### Available Commands

```bash
# Run all pending migrations
npm run migrate:up --workspace=apps/backend

# Rollback last migration
npm run migrate:down --workspace=apps/backend

# Create new migration
npm run migrate:create --workspace=apps/backend <migration-name>

# Check migration status
npm run migrate --workspace=apps/backend -- list
```

### Migration Order

1. Users and Schools
2. Subjects and Topics
3. Passages and Questions
4. Exam Templates
5. Exam Instances
6. Exam Attempts
7. Audit Logs

## Seeding Data

### Initial Data (Required)

```bash
# Seed subjects and topics
npm run seed:subjects --workspace=apps/backend
```

### Demo Data (Optional)

```bash
# Generate comprehensive demo data
# - 10,000 questions
# - 500 schools
# - 20,000 users
# - 1,000 exam instances
# - 200,000 exam attempts
npm run seed:db
```

**Note**: Demo data generation takes approximately 10-15 minutes.

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch --workspace=apps/backend

# Run with coverage
npm run test:coverage --workspace=apps/backend
```

### Linting and Formatting

```bash
# Lint all packages
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### Building for Production

```bash
# Build all packages
npm run build

# Build specific package
npm run build:backend
npm run build:frontend
```

## Troubleshooting

### Database Connection Issues

**Error**: `ECONNREFUSED` or `Connection refused`

**Solution**:
1. Ensure PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in `.env`
3. Verify database exists: `psql -l`

### Redis Connection Issues

**Error**: `Redis connection failed`

**Solution**:
1. Ensure Redis is running: `redis-cli ping` (should return `PONG`)
2. Check REDIS_URL in `.env`
3. Restart Redis: `brew services restart redis` (macOS)

### Migration Errors

**Error**: `relation already exists`

**Solution**:
```bash
# Check migration status
npm run migrate --workspace=apps/backend -- list

# If needed, rollback and re-run
npm run migrate:down --workspace=apps/backend
npm run migrate:up --workspace=apps/backend
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

## Next Steps

After setup is complete:

1. **Explore the API**: Check `docs/api.md` for API documentation
2. **Review Architecture**: See `docs/architecture.md` for system design
3. **Start Coding**: Check the tasks list in `.kiro/specs/jamb-cbt-prep-system/tasks.md`

## Getting Help

- Check the [README](./README.md) for project overview
- Review [API Documentation](./docs/api.md)
- Check [Contributing Guide](./docs/contributing.md)

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |
| HOST | Server host | 0.0.0.0 |
| DATABASE_URL | PostgreSQL connection string | - |
| REDIS_URL | Redis connection string | redis://localhost:6379 |
| JWT_ACCESS_SECRET | JWT access token secret | - |
| JWT_REFRESH_SECRET | JWT refresh token secret | - |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| LOG_LEVEL | Logging level | info |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3000 |
