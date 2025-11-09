# ⚡ Quick Deploy - Get Live in 10 Minutes!

## 🎯 Fastest Option: Railway (Recommended)

Railway is the easiest way to get your app live with zero configuration.

### Step-by-Step (10 minutes)

#### 1. Sign Up (1 minute)
- Go to [railway.app](https://railway.app)
- Click "Login with GitHub"
- Authorize Railway

#### 2. Create New Project (30 seconds)
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose `jamb-cbt-prep` repository

#### 3. Add PostgreSQL (30 seconds)
- Click "New" → "Database" → "Add PostgreSQL"
- Railway provisions database automatically

#### 4. Add Redis (30 seconds)
- Click "New" → "Database" → "Add Redis"
- Railway provisions Redis automatically

#### 5. Configure Backend (2 minutes)
- Click on the backend service
- Go to "Settings" tab
- Set **Root Directory**: `apps/backend`
- Go to "Variables" tab
- Click "New Variable" and add:

```
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=super-secret-refresh-key-change-in-production
CORS_ORIGIN=*
```

- Go to "Deploy" tab
- Click "Deploy"

#### 6. Wait for Backend (3 minutes)
- Watch the logs
- Wait for "Server listening on 0.0.0.0:3000"
- Copy the backend URL (e.g., `jamb-cbt-backend-production.up.railway.app`)

#### 7. Deploy Frontend to Vercel (2 minutes)
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import `jamb-cbt-prep` repository
- Configure:
  - **Root Directory**: `apps/frontend`
  - **Framework**: Vite
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
- Add Environment Variable:
  - **Name**: `VITE_API_URL`
  - **Value**: `https://your-railway-backend-url` (from step 6)
- Click "Deploy"

#### 8. Test Your Live App! (1 minute)
- Visit your Vercel URL
- Click "Candidate Demo" button
- Login with: chidi@example.com / candidate123
- Explore the dashboard!

---

## 🎉 You're Live!

Your app is now running at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app`

### Demo Credentials
- **Candidate**: chidi@example.com / candidate123
- **Admin**: admin@jamb-cbt.com / admin123

### Share Your Preview
Send the Vercel URL to anyone to preview the app!

---

## 🔧 If Something Goes Wrong

### Backend Won't Start
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check database connection string

### Frontend Can't Connect
1. Update `VITE_API_URL` in Vercel
2. Make sure it starts with `https://`
3. Redeploy frontend

### CORS Errors
1. Go to Railway backend variables
2. Update `CORS_ORIGIN` to your Vercel URL
3. Redeploy backend

### Database Not Seeded
1. Go to Railway backend
2. Click "Deploy" → "Redeploy"
3. Watch logs for seed script output

---

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Environment Variables**: Use Railway's variable references (e.g., `${{Postgres.DATABASE_URL}}`)
3. **Logs**: Check Railway logs if backend fails
4. **Monitoring**: Railway provides built-in metrics
5. **Scaling**: Railway auto-scales based on traffic

---

## 📊 What You Get (Free Tier)

### Railway
- PostgreSQL database (500MB)
- Redis cache (100MB)
- Backend hosting
- $5 free credit/month

### Vercel
- Unlimited deployments
- Global CDN
- Automatic HTTPS
- 100GB bandwidth/month

**Total Cost**: $0 for preview/testing!

---

## 🚀 Next Steps

Once deployed:
1. Test all features
2. Share with stakeholders
3. Gather feedback
4. Continue development
5. Deploy updates (auto-deploy on git push!)

---

## 📞 Need Help?

Common issues:
- **Build fails**: Check Node version (should be 20+)
- **Database error**: Verify DATABASE_URL is set
- **CORS error**: Update CORS_ORIGIN to match frontend URL
- **404 errors**: Check Root Directory is set correctly

Still stuck? Check the full [DEPLOY.md](./DEPLOY.md) guide.

---

**Happy Deploying! Your app will be live in minutes! 🎉**
