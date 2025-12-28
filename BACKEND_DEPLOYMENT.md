# Backend Deployment Guide

Since your Vercel deployment only handles the **frontend**, you need to deploy the **backend** separately.

## Option 1: Deploy Backend to Render (Recommended - Free Tier)

### Step 1: Sign up for Render
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create a New Web Service
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repo: `rishcx/newtrip`
3. Configure the service:

**Name**: `trippydrip-backend`  
**Region**: Choose closest to your users  
**Root Directory**: `backend`  
**Runtime**: `Python 3`  
**Build Command**:
```bash
pip install -r requirements.txt
```

**Start Command**:
```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

**Plan**: Free (or paid if you want)

### Step 3: Add Environment Variables
Click **"Environment"** and add these variables:

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_JWT_SECRET=<your-jwt-secret>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
FRONTEND_URL=https://www.trippydrip.co.in
ADMIN_SECRET_KEY=<your-admin-secret-key>
ADMIN_EMAIL=rishabhjangid1010@gmail.com
```

### Step 4: Deploy
Click **"Create Web Service"** - Render will build and deploy your backend.

After deployment, you'll get a URL like: `https://trippydrip-backend.onrender.com`

### Step 5: Update Vercel Frontend
1. Go to your Vercel project settings
2. Go to **Environment Variables**
3. Add:
   ```
   REACT_APP_BACKEND_URL=https://trippydrip-backend.onrender.com/api
   ```
4. Redeploy your Vercel frontend

---

## Option 2: Deploy Backend to Railway

### Step 1: Sign up for Railway
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Create New Project
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your `rishcx/newtrip` repo
3. Railway will detect it's a monorepo

### Step 3: Configure Service
1. Click on the created service
2. Go to **Settings** → **Root Directory**
3. Set to: `backend`
4. Go to **Deploy** → **Custom Start Command**
5. Set to: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Step 4: Add Environment Variables
Go to **Variables** tab and add all the environment variables (same as Option 1)

### Step 5: Deploy
Railway will automatically deploy. You'll get a URL like: `https://trippydrip-backend.up.railway.app`

Then update Vercel's `REACT_APP_BACKEND_URL` environment variable as in Option 1.

---

## Important Notes

1. **Free Tier Limitations**:
   - Render free tier: Service may sleep after inactivity (takes ~30s to wake up on first request)
   - Railway: Limited monthly hours on free tier

2. **CORS**: Your backend already allows `https://www.trippydrip.co.in` in CORS settings

3. **Database**: Supabase is already cloud-hosted, so it will work from anywhere

4. **After Backend Deployment**:
   - Test backend health: `https://your-backend-url.com/api/health`
   - Update Vercel environment variable: `REACT_APP_BACKEND_URL`
   - Redeploy Vercel frontend

---

## Quick Test After Deployment

```bash
# Test backend health
curl https://your-backend-url.com/api/health

# Test products endpoint
curl https://your-backend-url.com/api/products
```

Both should return JSON, not HTML.

