# Free Deployment Checklist ✅

Use this checklist to deploy your JAMB CBT Prep app for **$0/month**.

## Pre-Deployment

- [ ] Code is committed to Git
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Render account created (render.com)
- [ ] Vercel account created (vercel.com)

## Backend Deployment (Render)

### Create PostgreSQL Database
- [ ] Go to Render Dashboard
- [ ] Click "New +" → "PostgreSQL"
- [ ] Name: `jamb-cbt-db`
- [ ] Database: `jamb_cbt`
- [ ] User: `jamb_user`
- [ ] Plan: **Free** ⚠️ Important!
- [ ] Click "Create Database"
- [ ] Copy "Internal Connection String"

### Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `jamb-cbt-prep` repo
- [ ] Name: `jamb-cbt-backend`
- [ ] Region: Oregon (or closest)
- [ ] Environment: Node
- [ ] Build Command: `cd apps/backend && npm install && npm run build`
- [ ] Start Command: `cd apps/backend && npm run migrate:up && npm run seed:subjects && npm run seed:demo && npm start`
- [ ] Plan: **Free** ⚠️ Important!

### Set Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `DATABASE_URL` = [Paste Internal Connection String]
- [ ] `REDIS_HOST` = `` (leave empty)
- [ ] `JWT_SECRET` = [Generate: `openssl rand -base64 32`]
- [ ] `JWT_REFRESH_SECRET` = [Generate: `openssl rand -base64 32`]
- [ ] `CORS_ORIGIN` = `https://YOUR_APP.vercel.app` (update after Vercel deploy)

### Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (~5 minutes)
- [ ] Check logs for errors
- [ ] Visit `https://YOUR_BACKEND.onrender.com/health/live`
- [ ] Should see: `{"status":"ok",...}`
- [ ] Copy your backend URL

## Frontend Deployment (Vercel)

### Create Project
- [ ] Go to Vercel Dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository
- [ ] Select `jamb-cbt-prep` repo

### Configure Build
- [ ] Framework Preset: Vite
- [ ] Root Directory: `apps/frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Set Environment Variables
- [ ] `VITE_API_URL` = `https://YOUR_BACKEND.onrender.com`

### Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~3 minutes)
- [ ] Copy your Vercel URL

## Post-Deployment

### Update CORS
- [ ] Go back to Render backend service
- [ ] Update `CORS_ORIGIN` to your actual Vercel URL
- [ ] Click "Save Changes"
- [ ] Wait for redeploy

### Test Application
- [ ] Visit your Vercel URL
- [ ] Landing page loads correctly
- [ ] Click "Login"
- [ ] Try demo credentials:
  - Email: `admin@jamb-cbt.com`
  - Password: `admin123`
- [ ] Login successful
- [ ] Dashboard loads
- [ ] No console errors

## Troubleshooting

### Backend won't start
- [ ] Check Render logs
- [ ] Verify DATABASE_URL is correct
- [ ] Check migrations ran successfully
- [ ] Look for error messages

### Frontend can't connect
- [ ] Check browser console for errors
- [ ] Verify VITE_API_URL is correct
- [ ] Check CORS_ORIGIN in backend
- [ ] Test backend health endpoint directly

### Database errors
- [ ] Verify PostgreSQL is running
- [ ] Check connection string format
- [ ] Ensure free plan was selected
- [ ] Check database logs in Render

## Success! 🎉

Your app is now live:
- **Frontend**: https://YOUR_APP.vercel.app
- **Backend**: https://YOUR_BACKEND.onrender.com
- **Cost**: $0/month

## Next Steps

- [ ] Share your app URL
- [ ] Monitor usage in dashboards
- [ ] Set up custom domain (optional)
- [ ] Plan for database migration after 90 days

## Important Reminders

⚠️ **Cold Starts**: Free tier sleeps after 15 min. First request takes ~30 seconds.

⚠️ **Database Expiry**: Free PostgreSQL expires after 90 days. Plan ahead:
- Option 1: Add payment to Render ($7/month)
- Option 2: Migrate to Supabase (free forever)
- Option 3: Migrate to Neon (free forever)

📊 **Monitoring**:
- Render: Dashboard → Logs & Metrics
- Vercel: Dashboard → Analytics

---

**Need help?** See [FREE_DEPLOY.md](./FREE_DEPLOY.md) for detailed instructions.
