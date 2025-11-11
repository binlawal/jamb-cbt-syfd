# Free Deployment Guide (No Payment Required)

This guide shows you how to deploy JAMB CBT Prep using **100% free services**.

## Services Used (All Free)

1. **Render** - Backend API + PostgreSQL (Free tier)
2. **Vercel** - Frontend hosting (Free tier)

## Prerequisites

- GitHub account
- Render account (sign up at render.com)
- Vercel account (sign up at vercel.com)

## Step 1: Push to GitHub

```bash
cd jamb-cbt-prep
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jamb-cbt-prep.git
git push -u origin main
```

## Step 2: Deploy Backend on Render

### 2.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `jamb-cbt-prep` repository

### 2.2 Configure Service

**Basic Settings:**
- **Name**: `jamb-cbt-backend`
- **Region**: Oregon (or closest to you)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Environment**: `Node`
- **Build Command**: 
  ```bash
  cd apps/backend && npm install && npm run build
  ```
- **Start Command**:
  ```bash
  cd apps/backend && npm run migrate:up && npm run seed:subjects && npm run seed:demo && npm start
  ```

**Advanced Settings:**
- **Plan**: Free
- **Auto-Deploy**: Yes

### 2.3 Add PostgreSQL Database

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `jamb-cbt-db`
   - **Database**: `jamb_cbt`
   - **User**: `jamb_user`
   - **Region**: Same as your web service
   - **Plan**: **Free** (90 days, 1GB storage)
3. Click **"Create Database"**

### 2.4 Set Environment Variables

In your web service settings, add these environment variables:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=[Internal Connection String from your PostgreSQL database]
REDIS_HOST=
JWT_SECRET=[Auto-generate or use: openssl rand -base64 32]
JWT_REFRESH_SECRET=[Auto-generate or use: openssl rand -base64 32]
CORS_ORIGIN=https://YOUR_VERCEL_APP.vercel.app
```

**To get DATABASE_URL:**
1. Go to your PostgreSQL database in Render
2. Copy the **"Internal Connection String"**
3. Paste it as the `DATABASE_URL` value

### 2.5 Deploy

Click **"Create Web Service"** - Render will build and deploy your backend.

Your backend will be available at: `https://jamb-cbt-backend.onrender.com`

## Step 3: Deploy Frontend on Vercel

### 3.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.3 Set Environment Variables

Add this environment variable in Vercel:

```
VITE_API_URL=https://jamb-cbt-backend.onrender.com
```

### 3.4 Deploy

Click **"Deploy"** - Vercel will build and deploy your frontend.

Your frontend will be available at: `https://jamb-cbt-prep.vercel.app`

## Step 4: Update CORS

Go back to your Render backend service and update the `CORS_ORIGIN` environment variable with your actual Vercel URL:

```
CORS_ORIGIN=https://jamb-cbt-prep.vercel.app
```

Then redeploy the backend.

## Step 5: Test Your App

1. Visit your Vercel URL: `https://jamb-cbt-prep.vercel.app`
2. Try logging in with demo credentials:
   - Email: `admin@jamb-cbt.com`
   - Password: `admin123`

## Free Tier Limitations

### Render Free Tier
- **Web Service**: 
  - 750 hours/month (enough for 1 service running 24/7)
  - Spins down after 15 minutes of inactivity
  - Cold start takes ~30 seconds
- **PostgreSQL**: 
  - 90 days free trial
  - 1GB storage
  - 97 connection limit

### Vercel Free Tier
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

## Important Notes

1. **Cold Starts**: Render free tier spins down after inactivity. First request after idle will be slow (~30 seconds).

2. **Database Expiry**: Free PostgreSQL expires after 90 days. You'll need to:
   - Add payment info to continue, or
   - Export data and migrate to another free service (Supabase, Neon, etc.)

3. **No Redis**: We're using in-memory cache instead. This means:
   - Cache is lost on server restart
   - Not suitable for multi-instance deployments
   - Fine for demo/testing purposes

## Alternative Free Database Options

If you need longer than 90 days free:

### Option 1: Supabase (Recommended)
- Free tier: 500MB database, unlimited API requests
- No time limit
- Sign up at supabase.com
- Get connection string and use as `DATABASE_URL`

### Option 2: Neon
- Free tier: 3GB storage
- No time limit
- Sign up at neon.tech
- Get connection string and use as `DATABASE_URL`

### Option 3: Railway
- $5 free credit/month
- Sign up at railway.app

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### Frontend can't connect to backend
- Check VITE_API_URL in Vercel
- Check CORS_ORIGIN in Render
- Verify backend is running (visit /health/live)

### Database connection errors
- Verify PostgreSQL is running
- Check connection string format
- Ensure database was created

## Monitoring

### Render
- View logs: Dashboard → Your Service → Logs
- View metrics: Dashboard → Your Service → Metrics

### Vercel
- View deployments: Dashboard → Your Project → Deployments
- View analytics: Dashboard → Your Project → Analytics

## Cost Summary

**Total Monthly Cost: $0** 🎉

- Render Web Service: Free
- Render PostgreSQL: Free (90 days)
- Vercel Hosting: Free
- Redis: Not used (in-memory cache)

---

**Need help?** Check the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)
