# Vercel Deployment Checklist

## Before Deploying

- [ ] Code is pushed to GitHub
- [ ] All dependencies are in `frontend/package.json`
- [ ] `frontend/yarn.lock` is committed (or `package-lock.json`)

## Vercel Project Settings

Go to: Vercel Dashboard → Your Project → Settings → General

- [ ] **Root Directory**: Set to `frontend`
- [ ] **Framework Preset**: Create React App (or leave blank)
- [ ] **Build Command**: `yarn build` (auto-detected if Root Directory is `frontend`)
- [ ] **Output Directory**: `build` (auto-detected)
- [ ] **Install Command**: `yarn install` (auto-detected)

## Environment Variables

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables (for Production, Preview, and Development):

- [ ] `REACT_APP_SUPABASE_URL` = Your Supabase project URL
- [ ] `REACT_APP_SUPABASE_ANON_KEY` = Your Supabase anon/public key
- [ ] `REACT_APP_BACKEND_URL` = Your backend API URL (e.g., `https://your-backend.railway.app/api`)
- [ ] `REACT_APP_RAZORPAY_KEY_ID` = Your Razorpay key ID (if using payments)

**Important Notes:**
- Variable names MUST start with `REACT_APP_`
- After adding/changing variables, you MUST redeploy
- Variables are embedded at BUILD TIME, not runtime

## After Deployment

1. **Check Build Logs**
   - Go to Deployments → Latest deployment → Build Logs
   - Look for any errors or warnings
   - Build should complete with "Build Completed" message

2. **Test the Site**
   - Visit your Vercel URL
   - Open browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

3. **Common Issues**

   **Blank Page:**
   - Check browser console for JavaScript errors
   - Verify environment variables are set
   - Check if `index.html` is loading (View Page Source)

   **404 Errors:**
   - Verify `_redirects` file exists in `frontend/public/`
   - Check `vercel.json` rewrite rules

   **API Errors:**
   - Verify `REACT_APP_BACKEND_URL` is correct
   - Check backend CORS settings include your Vercel domain
   - Test backend URL directly in browser

## Quick Debug Commands

**Test build locally:**
```bash
cd frontend
yarn install
yarn build
```

**Serve build locally:**
```bash
cd frontend/build
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Files to Verify

- [ ] `vercel.json` exists in root (optional, but helpful)
- [ ] `frontend/public/_redirects` exists (for routing)
- [ ] `frontend/package.json` has build script
- [ ] `frontend/src/index.js` renders App component
- [ ] `frontend/public/index.html` has `<div id="root"></div>`

## Next Steps After Fixing

1. Commit and push changes to GitHub
2. Vercel will auto-deploy
3. Check deployment status in Vercel dashboard
4. Test the live site
