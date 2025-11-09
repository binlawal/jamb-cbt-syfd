# 🎬 How to Preview the JAMB CBT Prep System

## 🚀 Quick Start (3 Steps)

### Step 1: Run Setup Script
```bash
cd jamb-cbt-prep
./setup-and-run.sh
```

Wait for it to complete (~2 minutes). You'll see:
- ✅ PostgreSQL and Redis started
- ✅ Database migrations completed
- ✅ Demo data seeded
- ✅ Dependencies installed

### Step 2: Start Backend
Open a new terminal:
```bash
cd jamb-cbt-prep/apps/backend
npm run dev
```

You should see:
```
[INFO] Redis connected
[INFO] Database connected
[INFO] Server listening on 0.0.0.0:3000
```

### Step 3: Start Frontend
Open another terminal:
```bash
cd jamb-cbt-prep/apps/frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🌐 Access the Application

Open your browser and go to: **http://localhost:5173**

## 🎯 What to Try

### 1. Landing Page
- View the hero section
- Scroll through features
- See all JAMB subjects listed
- Click "Get Started" or "Sign In"

### 2. Quick Login (Easiest)
On the login page, click one of the demo buttons:
- **"Candidate Demo"** - Logs in as a student
- **"Admin Demo"** - Logs in as an administrator

### 3. Manual Login
Or enter credentials manually:
- **Email**: chidi@example.com
- **Password**: candidate123

### 4. Dashboard
After login, you'll see:
- Welcome message with your name
- Stats cards (placeholders for now)
- Available practice exams
- Your profile info in the header

### 5. Try Registration
- Click "Sign up" from landing page
- Fill in the form
- Select role (Candidate, Tutor, or Admin)
- Create your account
- You'll be automatically logged in

### 6. Logout
- Click "Logout" in the header
- You'll be redirected to login page
- Your session is cleared

## 🧪 Test the API Directly

### Health Check
```bash
curl http://localhost:3000/health/ready
```

Expected response:
```json
{
  "status": "ready",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "checks": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "candidate",
    "cohort": "SS3"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "chidi@example.com",
    "password": "candidate123"
  }'
```

## 📱 Test Responsive Design

1. Open browser DevTools (F12)
2. Click the device toolbar icon
3. Try different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)

The UI should adapt beautifully to all sizes!

## 🎨 What You'll See

### Landing Page
- Clean, modern design
- Green and blue gradient background
- Feature cards with icons
- All 16 JAMB subjects displayed
- Call-to-action buttons

### Login Page
- Simple, focused form
- Demo account buttons for quick access
- Password visibility toggle
- Error messages if login fails
- Link to registration

### Dashboard
- Personalized welcome message
- Stats overview (placeholders)
- Available exams card
- Clean navigation header
- Logout button

## 🔍 Behind the Scenes

### Database (PostgreSQL)
Check what's in the database:
```bash
docker exec -it jamb-cbt-postgres psql -U jamb_user -d jamb_cbt

# Then run:
\dt                    # List all tables
SELECT * FROM users;   # View users
SELECT * FROM questions LIMIT 5;  # View questions
\q                     # Quit
```

### Redis Cache
Check Redis:
```bash
docker exec -it jamb-cbt-redis redis-cli

# Then run:
KEYS *                 # List all keys
GET session:user_id    # View a session
QUIT                   # Exit
```

### Docker Services
Check service status:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs postgres
docker-compose logs redis
```

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Restart Docker services
docker-compose restart

# Check if they're running
docker-compose ps
```

### "Port 3000 already in use"
```bash
# Find what's using the port
lsof -i :3000

# Kill the process or change the port in .env
```

### "Module not found"
```bash
# Reinstall dependencies
cd apps/backend && npm install
cd apps/frontend && npm install
```

### "Migrations failed"
```bash
# Reset and re-run migrations
cd apps/backend
npm run migrate:down
npm run migrate:up
npm run seed:subjects
npm run seed:demo
```

## 📊 Demo Data Available

### Users (3)
1. **Admin**: admin@jamb-cbt.com / admin123
2. **Candidate 1**: chidi@example.com / candidate123
3. **Candidate 2**: amina@example.com / candidate123

### Questions (20)
- 10 Mathematics questions
- 10 English Language questions
- All with 4 options
- Difficulty levels 1-3

### Subjects (16)
All JAMB subjects with topics:
- English, Math, Physics, Chemistry, Biology
- Economics, Government, Literature, CRS/IRS
- Commerce, Geography, ICT, Further Math
- Accounting, Agriculture, Languages

### Exam Template (1)
- **Name**: JAMB Practice Test
- **Duration**: 60 minutes
- **Questions**: 20 (10 Math + 10 English)
- **Features**: Randomization enabled

## 🎯 Success Checklist

- [ ] Docker services running
- [ ] Backend server started (port 3000)
- [ ] Frontend server started (port 5173)
- [ ] Can access landing page
- [ ] Can login with demo account
- [ ] Dashboard displays correctly
- [ ] Can logout successfully
- [ ] Can register new account
- [ ] Health check returns "ready"
- [ ] No errors in browser console
- [ ] No errors in backend logs

## 🎉 You're All Set!

The system is now running and ready to explore. Enjoy testing the JAMB CBT Prep platform!

### What's Working
✅ User authentication
✅ Beautiful UI
✅ Responsive design
✅ Database operations
✅ API endpoints
✅ Demo data

### What's Coming Next
🚧 Exam taking interface
🚧 Grading system
🚧 Analytics dashboard
🚧 Question management
🚧 And much more!

---

**Need Help?** Check these files:
- [START_HERE.md](./START_HERE.md) - Quick reference
- [PREVIEW_READY.md](./PREVIEW_READY.md) - Feature details
- [QUICKSTART.md](./QUICKSTART.md) - Detailed guide
- [README.md](./README.md) - Full documentation

**Happy Testing! 🎓**
