# Backend Deployment Guide - FREE Options

## Your Backend Location
Your backend is in: `/backend/` folder
- Main file: `backend/server.py`
- Requirements: `backend/requirements.txt`
- Uses: FastAPI + Uvicorn

## Option 1: Railway (Easiest - Recommended)

### Step 1: Sign Up
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Click "Add Service" → "GitHub Repo"
5. Select your repo again
6. In "Root Directory", type: `backend`
7. Railway will auto-detect Python

### Step 3: Environment Variables
Click on your service → Variables tab → Add these:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=https://trippydrip.co.in
ADMIN_SECRET_KEY=your_admin_secret_key
ADMIN_EMAIL=your_admin_email
```

### Step 4: Get Your Backend URL
1. Railway will auto-deploy
2. Click on your service → Settings → Domains
3. Copy the generated URL (e.g., `https://trippydrip-backend.railway.app`)
4. Your API will be at: `https://trippydrip-backend.railway.app/api`

### Step 5: Update Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update: `REACT_APP_BACKEND_URL` = `https://trippydrip-backend.railway.app/api`
3. Redeploy frontend

---

## Option 2: Render (Free but Slower)

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `trippydrip-backend`
   - **Environment**: `Python 3`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Step 3: Environment Variables
Add the same variables as Railway (see above)

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (takes 5-10 minutes)
3. Get your URL: `https://trippydrip-backend.onrender.com`
4. Update Vercel: `REACT_APP_BACKEND_URL=https://trippydrip-backend.onrender.com/api`

**Note**: Free tier spins down after 15 min inactivity (first request after spin-down takes ~30 seconds)

---

## Option 3: Fly.io (More Control)

### Step 1: Install CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login
```bash
fly auth login
```

### Step 3: Initialize
```bash
cd backend
fly launch
```
Follow the prompts

### Step 4: Set Environment Variables
```bash
fly secrets set SUPABASE_URL=your_url
fly secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
# ... add all other variables
```

### Step 5: Deploy
```bash
fly deploy
```

---

## After Deployment

1. **Test your backend:**
   - Visit: `https://your-backend-url.com/api/health`
   - Should return: `{"status":"healthy"}`

2. **Update Vercel:**
   - Set `REACT_APP_BACKEND_URL` to your backend URL + `/api`
   - Redeploy frontend

3. **Test admin panel:**
   - Go to `trippydrip.co.in/admin`
   - Should work now!

---

## Quick Comparison

| Platform | Free Tier | Speed | Ease | Best For |
|----------|-----------|-------|------|----------|
| Railway | $5 credit/month | Fast | ⭐⭐⭐⭐⭐ | Beginners |
| Render | Free (spins down) | Medium | ⭐⭐⭐⭐ | Simple apps |
| Fly.io | 3 VMs free | Fast | ⭐⭐⭐ | Advanced users |

**Recommendation**: Use **Railway** - it's the easiest and most reliable for free tier.
