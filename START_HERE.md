# 🚀 START HERE - JAMB CBT Prep System

## One-Command Setup & Run

```bash
./setup-and-run.sh && echo "✅ Setup complete! Now start the servers..."
```

Then in **two separate terminals**:

### Terminal 1: Backend
```bash
cd apps/backend && npm run dev
```

### Terminal 2: Frontend
```bash
cd apps/frontend && npm run dev
```

## Access the Application

🌐 **Frontend**: http://localhost:5173
🔧 **Backend API**: http://localhost:3000
💚 **Health Check**: http://localhost:3000/health/ready

## Demo Login

Click the **"Candidate Demo"** button on the login page, or use:

- **Email**: chidi@example.com
- **Password**: candidate123

## That's It!

You're now running the JAMB CBT Prep system locally.

For more details, see:
- [PREVIEW_READY.md](./PREVIEW_READY.md) - Complete feature list
- [QUICKSTART.md](./QUICKSTART.md) - Detailed setup guide
- [README.md](./README.md) - Full documentation

---

**Need Help?**
1. Make sure Docker is running
2. Check that ports 3000, 5173, 5432, and 6379 are available
3. View logs in the terminal for any errors
