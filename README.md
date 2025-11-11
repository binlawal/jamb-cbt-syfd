# JAMB CBT Prep System

A production-ready Computer-Based Test (CBT) preparation platform for Nigerian secondary school students preparing for JAMB examinations.

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup-and-run.sh

# Then start the servers in separate terminals:
# Terminal 1:
cd apps/backend && npm run dev

# Terminal 2:
cd apps/frontend && npm run dev
```

### Option 2: Manual Setup

See [QUICKSTART.md](./QUICKSTART.md) for detailed step-by-step instructions.

## 🎯 Demo Credentials

Once running, access the app at `http://localhost:5173`

**Admin Account:**
- Email: `admin@jamb-cbt.com`
- Password: `admin123`

**Candidate Accounts:**
- Email: `chidi@example.com` / Password: `candidate123`
- Email: `amina@example.com` / Password: `candidate123`

## ✨ Features

- ✅ **User Authentication**: Secure JWT-based auth with role-based access control
- ✅ **Exam Simulation**: Realistic timed exams with auto-submit
- ✅ **Question Bank**: 20 demo questions (Math & English) with more coming
- ✅ **Performance Tracking**: View scores and analytics
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- 🚧 **Analytics Dashboard**: Detailed performance metrics (coming soon)
- 🚧 **Bulk Import**: CSV question import (coming soon)
- 🚧 **PWA Support**: Offline access (coming soon)

## 🏗️ Technology Stack

### Backend
- **Node.js 20+** with TypeScript
- **Fastify** - High-performance web framework
- **PostgreSQL 15+** - Relational database
- **Redis 7+** - Caching and sessions
- **JWT** - Authentication
- **Zod** - Validation

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Infrastructure
- **Docker** & Docker Compose
- **node-pg-migrate** - Database migrations
- **Pino** - Logging

## 📁 Project Structure

```
jamb-cbt-prep/
├── apps/
│   ├── backend/              # API Server
│   │   ├── src/
│   │   │   ├── config/       # Database & Redis config
│   │   │   ├── middleware/   # Auth & error handling
│   │   │   ├── routes/       # API endpoints
│   │   │   ├── scripts/      # Seed scripts
│   │   │   └── utils/        # Helpers
│   │   └── migrations/       # Database migrations
│   └── frontend/             # React App
│       └── src/
│           ├── components/   # Reusable components
│           ├── contexts/     # React contexts
│           ├── lib/          # API client
│           └── pages/        # Page components
├── packages/
│   └── shared/               # Shared types & constants
├── docker-compose.yml        # Local development services
├── QUICKSTART.md            # Detailed setup guide
└── PROGRESS.md              # Development progress
```

## 🔧 Development

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm or yarn

### Environment Variables

Backend `.env` file (apps/backend/.env):
```env
DATABASE_URL=postgresql://jamb_user:jamb_password@localhost:5432/jamb_cbt
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Available Scripts

```bash
# Root level
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run build            # Build all packages
npm run lint             # Lint all packages
npm run test             # Run all tests

# Backend (apps/backend)
npm run dev              # Start dev server
npm run migrate:up       # Run migrations
npm run migrate:down     # Rollback migrations
npm run seed:subjects    # Seed subjects and topics
npm run seed:demo        # Seed demo data

# Frontend (apps/frontend)
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

## 📊 Database

The system uses PostgreSQL with the following main tables:

- `users` - User accounts (candidates, tutors, admins)
- `schools` - Educational institutions
- `subjects` - JAMB subjects (16 subjects)
- `topics` - Subject topics (hierarchical)
- `questions` - Question bank
- `exam_templates` - Exam configurations
- `exam_instances` - Scheduled exams
- `exam_attempts` - Candidate exam attempts
- `exam_responses` - Individual question responses

See [docs/database-schema.md](./docs/database-schema.md) for complete schema.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm test --workspace=apps/backend

# Run frontend tests
npm test --workspace=apps/frontend

# Run with coverage
npm run test:coverage --workspace=apps/backend
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Health Checks
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe (includes DB/Redis checks)

More endpoints coming soon for questions, exams, and analytics.

## 🚢 Deployment

### Free Deployment (No Payment Required)

Deploy to production using 100% free services:

```bash
# See detailed guide
cat FREE_DEPLOY.md
```

**Services Used:**
- Render (Backend + PostgreSQL) - Free tier
- Vercel (Frontend) - Free tier
- **Total Cost: $0/month**

See [FREE_DEPLOY.md](./FREE_DEPLOY.md) for step-by-step instructions.

### Docker (Local Development)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production (Advanced)

For production deployments with payment:
- Kubernetes deployment with Helm
- Terraform infrastructure provisioning
- CI/CD with GitHub Actions
- Monitoring and observability

## 📈 Roadmap

### Phase 1: MVP (Current)
- [x] Project setup and monorepo structure
- [x] Database schema and migrations
- [x] Authentication system
- [x] Basic frontend with login/register
- [x] Demo data seeding
- [ ] Exam taking flow
- [ ] Results and grading

### Phase 2: Core Features
- [ ] Question management (CRUD)
- [ ] Bulk question import (CSV)
- [ ] Exam template builder
- [ ] Performance analytics
- [ ] User management

### Phase 3: Advanced Features
- [ ] PWA support and offline mode
- [ ] Advanced analytics dashboard
- [ ] School management
- [ ] Tutor features
- [ ] Mobile app

### Phase 4: Scale & Polish
- [ ] Load testing and optimization
- [ ] Comprehensive test coverage
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Monitoring and alerting

## 🤝 Contributing

This is a proprietary project. For contribution guidelines, please contact the maintainers.

## 📝 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

Built for Nigerian students preparing for JAMB examinations.

## 📞 Support

For issues and questions:
- Check [QUICKSTART.md](./QUICKSTART.md) for setup help
- Review [PROGRESS.md](./PROGRESS.md) for current status
- Check existing issues before creating new ones

---

**Status**: 🟢 Active Development | **Version**: 1.0.0-alpha | **Last Updated**: January 2024
