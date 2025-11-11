# Free Deployment - Quick Summary

## What Changed

✅ **Redis is now optional** - Backend uses in-memory cache when Redis is not available
✅ **PostgreSQL uses free tier** - 90 days free, 1GB storage
✅ **No payment required** - Deploy immediately without credit card

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for free deployment"
git push
```

### 2. Deploy Backend (Render)
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Use these settings:
   - Build: `cd apps/backend && npm install && npm run build`
   - Start: `cd apps/backend && npm run migrate:up && npm run seed:subjects && npm run seed:demo && npm start`
4. Add PostgreSQL database (Free plan)
5. Set environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=[from PostgreSQL]
   REDIS_HOST=
   JWT_SECRET=[generate random]
   CORS_ORIGIN=https://YOUR_APP.vercel.app
   ```

### 3. Deploy Frontend (Vercel)
1. Go to vercel.com → New Project
2. Import GitHub repo
3. Root directory: `apps/frontend`
4. Environment variable:
   ```
   VITE_API_URL=https://YOUR_BACKEND.onrender.com
   ```

### 4. Done! 🎉

Your app is live at:
- Frontend: `https://YOUR_APP.vercel.app`
- Backend: `https://YOUR_BACKEND.onrender.com`

## Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| Render Web Service | **$0** | 750 hrs/month, cold starts |
| Render PostgreSQL | **$0** | 90 days, 1GB storage |
| Vercel Hosting | **$0** | 100GB bandwidth/month |
| **TOTAL** | **$0/month** | Perfect for demos & testing |

## Important Notes

⚠️ **Cold Starts**: Render free tier sleeps after 15 min inactivity. First request takes ~30 seconds.

⚠️ **Database Expiry**: Free PostgreSQL expires after 90 days. Options:
- Add payment to continue on Render
- Migrate to Supabase (free forever)
- Migrate to Neon (free forever)

✅ **No Redis Needed**: Using in-memory cache instead. Fine for single-instance deployments.

## Full Guide

See [FREE_DEPLOY.md](./FREE_DEPLOY.md) for detailed step-by-step instructions.
