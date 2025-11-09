# MVP Implementation Plan for Preview

## Goal
Create a working JAMB CBT Prep system that can be previewed with core functionality.

## MVP Features (Minimum for Preview)

### Backend (Priority 1)
1. ✅ Health checks
2. ✅ Database & Redis connections
3. ✅ Error handling
4. 🔄 Authentication (JWT)
   - Register endpoint
   - Login endpoint
   - Token verification middleware
5. 🔄 Basic Question Management
   - Seed demo questions
   - Get questions endpoint
6. 🔄 Basic Exam Flow
   - Create exam template
   - Start exam attempt
   - Submit answers
   - Get results

### Frontend (Priority 1)
1. 🔄 Landing page
2. 🔄 Login/Register pages
3. 🔄 Candidate dashboard
4. 🔄 Exam taking interface
5. 🔄 Results page

### Demo Data (Priority 1)
1. 🔄 Seed subjects and topics
2. 🔄 Seed 100 demo questions (not 10,000)
3. 🔄 Create 1 demo school
4. 🔄 Create demo users (admin, candidate)
5. 🔄 Create 1 demo exam template

## Implementation Order

### Phase 1: Authentication (30 min)
- JWT token generation
- Register/Login endpoints
- Auth middleware
- Frontend auth context
- Login/Register UI

### Phase 2: Demo Data (20 min)
- Seed script for subjects/topics
- Seed script for 100 questions
- Seed demo users and school
- Seed exam template

### Phase 3: Exam Flow (40 min)
- Start exam endpoint
- Submit answer endpoint
- Complete exam endpoint
- Basic grading
- Frontend exam interface
- Results display

### Phase 4: Polish (10 min)
- Landing page
- Dashboard
- Basic styling
- README updates

## Deferred to Post-MVP
- Bulk import
- Media upload
- Advanced analytics
- PWA features
- Background workers
- Full test coverage
- Kubernetes deployment
- CI/CD pipeline

## Success Criteria
- User can register/login
- User can start a demo exam
- User can answer questions
- User can submit and see results
- System runs on localhost with docker-compose

## Time Estimate: ~2 hours for MVP
