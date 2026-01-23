# Vercel Deployment Troubleshooting

## Issue: Site Shows Blank/No Content

### Common Causes & Solutions

### 1. **Check Vercel Project Settings**

In your Vercel dashboard, verify:
- **Root Directory**: Should be set to `frontend` (not root)
- **Framework Preset**: Create React App
- **Build Command**: `yarn build` (or `npm run build`)
- **Output Directory**: `build`
- **Install Command**: `yarn install` (or `npm install`)

### 2. **Check Build Logs**

1. Go to your Vercel project dashboard
2. Click on the latest deployment
3. Check the "Build Logs" tab
4. Look for any errors or warnings

Common build errors:
- Missing dependencies
- Environment variable errors
- Build script failures

### 3. **Environment Variables**

Make sure these are set in Vercel (Settings → Environment Variables):

**Required:**
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_BACKEND_URL=https://your-backend-url.com/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Important:** 
- Environment variable names MUST start with `REACT_APP_` to be accessible in the React app
- After adding/changing env vars, you need to **redeploy** the project

### 4. **Check Browser Console**

1. Open your deployed site
2. Open browser DevTools (F12)
3. Check the Console tab for JavaScript errors
4. Check the Network tab for failed requests

Common errors:
- `Failed to fetch` - Backend URL incorrect or CORS issue
- `Cannot read property of undefined` - Missing environment variables
- `404 Not Found` - Routing issue

### 5. **Fix vercel.json Configuration**

If using `vercel.json` at the root, make sure it's configured correctly. The current config should work, but if issues persist, try this alternative:

**Option A: Root Directory = `frontend` (Recommended)**
- Set Root Directory to `frontend` in Vercel settings
- Remove or simplify `vercel.json` (Vercel will auto-detect React)

**Option B: Keep Root Directory = `.` (root)**
- Use the current `vercel.json` configuration
- Make sure build commands are correct

### 6. **Check Routing**

If you see a blank page but the HTML loads:
- This is likely a React Router issue
- The `vercel.json` rewrite rule should handle this: `"source": "/(.*)", "destination": "/index.html"`
- If not working, try adding a `_redirects` file in `frontend/public/`:

```
/*    /index.html   200
```

### 7. **Verify Build Output**

1. Check if `frontend/build` directory exists after build
2. Verify `frontend/build/index.html` exists
3. Check if static assets are being generated

### 8. **Quick Fixes to Try**

**Fix 1: Update vercel.json**
```json
{
  "buildCommand": "cd frontend && yarn install && yarn build",
  "outputDirectory": "frontend/build",
  "installCommand": "cd frontend && yarn install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Fix 2: Add _redirects file**
Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

**Fix 3: Check package.json build script**
Make sure `frontend/package.json` has:
```json
{
  "scripts": {
    "build": "craco build"
  }
}
```

### 9. **Debug Steps**

1. **Test build locally:**
   ```bash
   cd frontend
   yarn install
   yarn build
   ```
   Check if build succeeds and `build/` folder is created

2. **Test build output:**
   ```bash
   cd frontend/build
   python3 -m http.server 8000
   ```
   Visit `http://localhost:8000` and see if site works

3. **Check environment variables in build:**
   - Environment variables are embedded at build time
   - If you change env vars, you MUST rebuild
   - Check Vercel build logs to see if env vars are being used

### 10. **Common Issues**

**Issue: "Cannot GET /"**
- Solution: Add rewrite rule in vercel.json or _redirects file

**Issue: "Failed to fetch" errors**
- Solution: Check REACT_APP_BACKEND_URL is correct
- Solution: Check backend CORS settings include your Vercel domain

**Issue: Blank white page**
- Solution: Check browser console for errors
- Solution: Verify React app is mounting (check if root div exists)
- Solution: Check if JavaScript bundle is loading (Network tab)

**Issue: "Module not found" errors**
- Solution: Check all dependencies are in package.json
- Solution: Run `yarn install` locally to verify

### 11. **Force Redeploy**

After making changes:
1. Push to GitHub
2. Vercel will auto-deploy
3. Or manually trigger: Vercel Dashboard → Deployments → Redeploy

### 12. **Check Deployment Status**

In Vercel dashboard:
- Green checkmark = Successful deployment
- Red X = Failed deployment (check logs)
- Yellow warning = Deployment with warnings

## Still Not Working?

1. Check Vercel build logs for specific errors
2. Check browser console for JavaScript errors
3. Verify all environment variables are set
4. Test the build locally first
5. Check if backend is accessible and CORS is configured
