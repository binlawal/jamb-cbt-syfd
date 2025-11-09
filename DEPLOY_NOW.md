# 🚀 Deploy Now - Step-by-Step Guide

Follow these exact steps to get your JAMB CBT Prep system live in 10 minutes!

---

## 📋 Before You Start

Make sure you have:
- [ ] GitHub account
- [ ] This code pushed to a GitHub repository
- [ ] 10 minutes of time

---

## 🎯 Step 1: Deploy Backend to Railway (5 minutes)

### 1.1 Sign Up for Railway
1. Open [railway.app](https://railway.app) in a new tab
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub
4. You'll see the Railway dashboard

### 1.2 Create New Project
1. Click **"New Project"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. Find and select your **`jamb-cbt-prep`** repository
4. Railway will start analyzing your repo

### 1.3 Add PostgreSQL Database
1. In your project, click **"New"** button
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will provision the database (takes 30 seconds)
5. You'll see a new "Postgres" service appear

### 1.4 Add Redis Cache
1. Click **"New"** button again
2. Select **"Database"**
3. Choose **"Add Redis"**
4. Railway will provision Redis (takes 30 seconds)
5. You'll see a new "Redis" service appear

### 1.5 Configure Backend Service
1. Click on your **backend service** (should be auto-detected)
2. Go to **"Settings"** tab
3. Scroll to **"Root Directory"**
4. Enter: `apps/backend`
5. Click **"Save"**

### 1.6 Add Environment Variables
1. Go to **"Variables"** tab
2. Click **"New Variable"** and add each of these:

```
NODE_ENV=production
```

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

```
REDIS_HOST=${{Redis.REDIS_HOST}}
```

```
REDIS_PORT=${{Redis.REDIS_PORT}}
```

```
JWT_SECRET=jamb-cbt-super-secret-jwt-key-2024
```

```
JWT_REFRESH_SECRET=jamb-cbt-super-secret-refresh-key-2024
```

```
CORS_ORIGIN=*
```

**Note**: Railway will automatically replace `${{Postgres.DATABASE_URL}}` with the actual database URL!

### 1.7 Deploy Backend
1. Go to **"Deployments"** tab
2. Click **"Deploy"** button
3. Watch the logs (this takes 2-3 minutes)
4. Wait for: `✓ Server listening on 0.0.0.0:3000`

### 1.8 Get Backend URL
1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `jamb-cbt-backend-production.up.railway.app`)
5. **SAVE THIS URL** - you'll need it for the frontend!

**✅ Backend is now live!** Test it: `https://your-backend-url/health/ready`

---

## 🎨 Step 2: Deploy Frontend to Vercel (3 minutes)

### 2.1 Sign Up for Vercel
1. Open [vercel.com](https://vercel.com) in a new tab
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find your **`jamb-cbt-prep`** repository
3. Click **"Import"**

### 2.3 Configure Project
1. **Framework Preset**: Select **"Vite"**
2. **Root Directory**: Click **"Edit"** and enter `apps/frontend`
3. **Build Command**: Should auto-fill as `npm run build`
4. **Output Directory**: Should auto-fill as `dist`
5. **Install Command**: Should auto-fill as `npm install`

### 2.4 Add Environment Variable
1. Expand **"Environment Variables"** section
2. Add variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-backend-url` (from Step 1.8)
   - Example: `https://jamb-cbt-backend-production.up.railway.app`
3. Make sure there's **NO trailing slash**!

### 2.5 Deploy Frontend
1. Click **"Deploy"** button
2. Wait for deployment (1-2 minutes)
3. You'll see confetti when it's done! 🎉

### 2.6 Get Frontend URL
1. Click **"Visit"** or copy the URL
2. It will be something like: `https://jamb-cbt-prep.vercel.app`

**✅ Frontend is now live!**

---

## 🎉 Step 3: Test Your Live App (2 minutes)

### 3.1 Visit Your App
1. Open your Vercel URL in a browser
2. You should see the landing page!

### 3.2 Test Login
1. Click **"Sign In"** button
2. Click **"Candidate Demo"** button (this auto-fills credentials)
3. Click **"Sign In"**
4. You should see the dashboard!

### 3.3 Verify Everything Works
- [ ] Landing page loads
- [ ] Can click "Sign In"
- [ ] Demo button works
- [ ] Login successful
- [ ] Dashboard displays
- [ ] No errors in browser console (press F12)
- [ ] Can logout

---

## 🐛 Troubleshooting

### Problem: CORS Error in Browser Console

**Solution:**
1. Go back to Railway
2. Click on backend service
3. Go to "Variables" tab
4. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
5. Backend will auto-redeploy
6. Refresh your frontend

### Problem: "Cannot connect to backend"

**Solution:**
1. Check backend is running: Visit `https://your-backend-url/health/ready`
2. Should return: `{"status":"ready",...}`
3. If not, check Railway logs for errors
4. Verify all environment variables are set

### Problem: "Database connection failed"

**Solution:**
1. Go to Railway
2. Check Postgres service is running (green dot)
3. Verify `DATABASE_URL` variable is set
4. Redeploy backend

### Problem: Login doesn't work

**Solution:**
1. Check browser console for errors (F12)
2. Verify `VITE_API_URL` in Vercel matches Railway backend URL
3. Make sure backend URL has `https://` and NO trailing slash
4. Redeploy frontend if you changed the variable

---

## ✅ Success Checklist

Your deployment is successful when:

- [ ] Backend health check returns `{"status":"ready"}`
- [ ] Frontend loads without errors
- [ ] Can click "Candidate Demo" button
- [ ] Login works
- [ ] Dashboard displays
- [ ] No CORS errors in console
- [ ] Can logout

---

## 🎊 You're Live!

Congratulations! Your JAMB CBT Prep system is now live on the internet!

### Share Your App
Send these URLs to anyone:
- **Live App**: `https://your-app.vercel.app`
- **Demo Login**: chidi@example.com / candidate123

### What's Working
✅ User registration
✅ Login/logout
✅ JWT authentication
✅ Dashboard
✅ Responsive design
✅ Demo data
✅ HTTPS enabled
✅ Global CDN

### Next Steps
1. Share with stakeholders
2. Gather feedback
3. Continue development
4. Deploy updates (auto-deploy on git push!)

---

## 💡 Pro Tips

1. **Auto-Deploy**: Both Railway and Vercel auto-deploy when you push to GitHub
2. **Custom Domain**: Add your own domain in Vercel settings
3. **Monitoring**: Check Railway metrics and Vercel analytics
4. **Logs**: View logs in Railway dashboard for debugging
5. **Environment Variables**: Update anytime in Railway/Vercel settings

---

## 📞 Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. Review Railway logs for backend errors
3. Check browser console (F12) for frontend errors
4. Verify all environment variables are set correctly
5. Try redeploying both services

---

**Deployment Time**: ~10 minutes
**Cost**: $0 (free tier)
**Result**: Live, shareable app!

**Enjoy your live JAMB CBT Prep system! 🎓🚀**
