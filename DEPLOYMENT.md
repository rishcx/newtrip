# Deployment Guide for TrippyDrip

## Frontend Deployment on Vercel

### Step 1: Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure Project Settings**:
   - **Root Directory**: Set to `frontend`
   - **Framework Preset**: Create React App (auto-detected)
   - **Build Command**: `yarn build` (or `npm run build`)
   - **Output Directory**: `build`
   - **Install Command**: `yarn install` (or `npm install`)

6. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.com
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

7. **Click "Deploy"**

### Step 3: Update Backend CORS
After getting your Vercel frontend URL, update your backend `.env`:
```
FRONTEND_URL=https://your-app.vercel.app
```

## Backend Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add service → Select your backend folder
6. Add environment variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_key
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   FRONTEND_URL=https://your-app.vercel.app
   ```
7. Railway will auto-detect Python and install dependencies
8. Set start command: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`

### Option 2: Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: trippydrip-backend
   - **Environment**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (same as Railway)
7. Click "Create Web Service"

### Option 3: Vercel Serverless (Advanced)

The backend can be deployed on Vercel as serverless functions, but requires more configuration.

## After Deployment

1. **Update Frontend Environment Variables** in Vercel:
   - `REACT_APP_BACKEND_URL` = Your deployed backend URL

2. **Update Razorpay Webhook**:
   - Go to Razorpay Dashboard → Settings → Webhooks
   - Add webhook URL: `https://your-backend-url.com/api/payments/webhook`

3. **Test the deployment**:
   - Visit your Vercel URL
   - Test adding items to cart
   - Test checkout flow

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed (Railway/Render)
- [ ] Environment variables set in both frontend and backend
- [ ] CORS updated in backend with frontend URL
- [ ] Razorpay webhook configured
- [ ] Tested checkout flow

## Troubleshooting

**Build fails on Vercel:**
- Check that Root Directory is set to `frontend`
- Verify build command is `yarn build`
- Check environment variables are set

**Backend not connecting:**
- Verify backend URL in frontend env vars
- Check CORS settings in backend
- Ensure backend is running and accessible

**Payment not working:**
- Verify Razorpay keys are correct
- Check webhook URL is set in Razorpay dashboard
- Ensure backend can receive webhooks (check firewall)

