# 🚀 Deployment Guide - JAMB CBT Prep

This guide will help you deploy the JAMB CBT Prep system to the cloud for a live preview.

## 🎯 Recommended: Railway (Easiest - All-in-One)

Railway provides PostgreSQL, Redis, and hosting in one platform with a generous free tier.

### Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free)

### Step 2: Deploy Backend + Database
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select the `jamb-cbt-prep` repository
5. Railway will detect the monorepo

### Step 3: Add Services
1. **Add PostgreSQL**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will provision a database

2. **Add Redis**:
   - Click "New" → "Database" → "Redis"
   - Railway will provision Redis

3. **Configure Backend**:
   - Select the backend service
   - Go to "Variables" tab
   - Add these environment variables:
     ```
     NODE_ENV=production
     PORT=3000
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     REDIS_HOST=${{Redis.REDIS_HOST}}
     REDIS_PORT=${{Redis.REDIS_PORT}}
     JWT_SECRET=your-random-secret-key-here
     JWT_REFRESH_SECRET=your-random-refresh-secret-here
     CORS_ORIGIN=*
     ```
   - Railway will auto-link database URLs

4. **Set Root Directory**:
   - Go to "Settings" tab
   - Set "Root Directory" to `apps/backend`
   - Set "Build Command" to `npm install && npm run build`
   - Set "Start Command" to `npm run migrate:up && npm run seed:subjects && npm run seed:demo && npm start`

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Copy the backend URL (e.g., `https://jamb-cbt-backend.up.railway.app`)

### Step 4: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (free)
3. Click "New Project"
4. Import `jamb-cbt-prep` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: Your Railway backend URL (from Step 3)
7. Click "Deploy"
8. Wait for deployment (1-2 minutes)
9. Get your live URL (e.g., `https://jamb-cbt-prep.vercel.app`)

### Step 5: Update CORS
1. Go back to Railway
2. Update `CORS_ORIGIN` variable to your Vercel URL
3. Redeploy backend

### Step 6: Test Your Deployment
1. Visit your Vercel URL
2. Click "Candidate Demo" button
3. Login and explore!

**Demo Credentials:**
- Email: chidi@example.com
- Password: candidate123

---

## 🔄 Alternative: Render (All-in-One)

Render provides everything in one platform with a simple YAML config.

### Step 1: Sign Up for Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free)

### Step 2: Deploy with Blueprint
1. Click "New" → "Blueprint"
2. Connect your GitHub repository
3. Render will detect `render.yaml`
4. Click "Apply"
5. Render will:
   - Create PostgreSQL database
   - Create Redis instance
   - Deploy backend
   - Deploy frontend
   - Link everything automatically

### Step 3: Wait for Deployment
- Backend: ~5 minutes
- Frontend: ~2 minutes
- Database setup: ~1 minute

### Step 4: Get Your URLs
- Frontend: `https://jamb-cbt-frontend.onrender.com`
- Backend: `https://jamb-cbt-backend.onrender.com`

### Step 5: Test
Visit the frontend URL and login!

---

## 🎨 Alternative: Vercel + Supabase

If you prefer Supabase for the database:

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database

### Step 2: Deploy Backend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import repository
3. Set Root Directory: `apps/backend`
4. Add environment variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   REDIS_HOST=your-redis-host (use Upstash)
   REDIS_PORT=6379
   JWT_SECRET=random-secret
   JWT_REFRESH_SECRET=random-secret
   CORS_ORIGIN=*
   ```
5. Deploy

### Step 3: Deploy Frontend to Vercel
1. New project in Vercel
2. Set Root Directory: `apps/frontend`
3. Add environment variable:
   ```
   VITE_API_URL=your-backend-vercel-url
   ```
4. Deploy

---

## 🐳 Alternative: Docker + DigitalOcean/AWS

For more control, deploy with Docker:

### Step 1: Build Docker Images
```bash
# Backend
cd apps/backend
docker build -t jamb-cbt-backend .

# Frontend
cd apps/frontend
docker build -t jamb-cbt-frontend .
```

### Step 2: Push to Registry
```bash
docker tag jamb-cbt-backend your-registry/jamb-cbt-backend
docker push your-registry/jamb-cbt-backend

docker tag jamb-cbt-frontend your-registry/jamb-cbt-frontend
docker push your-registry/jamb-cbt-frontend
```

### Step 3: Deploy to Cloud
Use the provided `docker-compose.yml` or Kubernetes configs.

---

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] Backend health check: `https://your-backend-url/health/ready`
- [ ] Frontend loads: `https://your-frontend-url`
- [ ] Can register new user
- [ ] Can login with demo account
- [ ] Dashboard displays correctly
- [ ] No CORS errors in browser console
- [ ] Database migrations ran successfully
- [ ] Demo data is seeded

---

## 🔧 Troubleshooting

### CORS Errors
- Update `CORS_ORIGIN` in backend to match frontend URL
- Redeploy backend

### Database Connection Failed
- Check `DATABASE_URL` is correct
- Ensure database is running
- Check firewall rules

### Migrations Failed
- Check logs in deployment platform
- Manually run: `npm run migrate:up`
- Check database permissions

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and running
- Test backend health endpoint directly

### Demo Data Not Loading
- Check backend logs
- Manually run: `npm run seed:subjects && npm run seed:demo`
- Verify database connection

---

## 💰 Cost Estimate

### Free Tier (Recommended for Preview)
- **Railway**: Free tier includes PostgreSQL + Redis + hosting
- **Vercel**: Free tier includes unlimited deployments
- **Total**: $0/month

### Paid Tier (For Production)
- **Railway**: ~$5-10/month (PostgreSQL + Redis + hosting)
- **Vercel**: Free (or $20/month for Pro features)
- **Total**: ~$5-30/month depending on usage

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live frontend URL
- ✅ Live backend API
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ Demo data loaded
- ✅ Ready to test and share!

Share your live URL with anyone to preview the JAMB CBT Prep system!

---

## 📞 Need Help?

If you encounter issues:
1. Check deployment logs in your platform
2. Verify all environment variables are set
3. Test backend health endpoint
4. Check browser console for errors
5. Review the troubleshooting section above

**Happy Deploying! 🚀**
