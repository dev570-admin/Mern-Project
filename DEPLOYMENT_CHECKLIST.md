# Vercel Deployment Checklist

## Pre-Deployment ✅

- [ ] **Code is committed to Git** (GitHub, GitLab, or Bitbucket)
  - [ ] No sensitive credentials in code files
  - [ ] `.env` files are in `.gitignore`
  - [ ] `node_modules/` is in `.gitignore`

- [ ] **Local Testing Complete**
  - [ ] Backend runs: `cd backend && npm start`
  - [ ] Frontend runs: `cd frontend && npm run dev`
  - [ ] Can signup/login
  - [ ] Can create products
  - [ ] No TypeScript errors: `npm run build`

- [ ] **MongoDB Setup**
  - [ ] MongoDB Atlas account created
  - [ ] Cluster created and running
  - [ ] Database user created with strong password
  - [ ] Connection string obtained: `mongodb+srv://user:pass@...`
  - [ ] Network access configured (allow Vercel IPs initially)

- [ ] **Environment Variables Prepared**
  - [ ] `MONGO_URI` - MongoDB connection string
  - [ ] `JWT_SECRET` - Strong random string (32+ chars)
  - [ ] `FRONTEND_URL` - Will be set after frontend deployment
  - [ ] Optional: `NODE_ENV=production`

- [ ] **Project Dependencies Fixed**
  - [ ] `backend/package.json` has all dependencies
  - [ ] No version conflicts
  - [ ] ES modules syntax verified (`"type": "module"`)
  - [ ] All imports use `.js` extensions

---

## Vercel Setup ✅

- [ ] **Vercel Account**
  - [ ] Account created at vercel.com
  - [ ] Email verified
  - [ ] Billing set up (free tier available)

- [ ] **Git Repository**
  - [ ] Code pushed to GitHub/GitLab/Bitbucket
  - [ ] `.gitignore` includes `.env*`, `node_modules/`, `dist/`
  - [ ] `.vercelignore` created to exclude frontend, node_modules, etc.

- [ ] **Vercel Configuration Files**
  - [ ] `vercel.json` created with correct build config
  - [ ] `api/index.js` created as serverless entry point
  - [ ] `.vercelignore` created

---

## Backend Deployment ✅

- [ ] **Install Vercel CLI**
  ```bash
  npm install -g vercel
  vercel login
  ```

- [ ] **Deploy Backend**
  ```bash
  vercel
  # Or: vercel --prod for production
  ```
  - [ ] Project created on Vercel
  - [ ] Build successful (check Vercel dashboard)
  - [ ] Functions deployed successfully

- [ ] **Environment Variables Set**
  - [ ] Go to Vercel Dashboard → Project Settings → Environment Variables
  - [ ] Add `MONGO_URI`
  - [ ] Add `JWT_SECRET`
  - [ ] Add `FRONTEND_URL` (set to empty string for now)
  - [ ] Redeploy: `vercel --prod`

- [ ] **Backend API Accessible**
  - [ ] Test health endpoint: `https://your-project.vercel.app/api/health`
  - [ ] Returns: `{"status":"healthy"}`
  - [ ] API routes accessible (check in browser/Postman)

---

## Frontend Deployment ✅

- [ ] **Build Frontend Locally**
  ```bash
  cd frontend
  npm install
  npm run build
  ```
  - [ ] No build errors
  - [ ] `dist/` folder created

- [ ] **Update Frontend API URL**
  - [ ] Create `frontend/.env.local` with:
    ```
    VITE_API_URL=https://your-backend-api.vercel.app/
    ```
  - [ ] Rebuild: `npm run build`

- [ ] **Deploy Frontend**
  ```bash
  cd frontend
  vercel
  ```
  - [ ] Project created on Vercel
  - [ ] Build successful
  - [ ] Deployed to URL like `https://your-frontend.vercel.app`

- [ ] **Test Frontend**
  - [ ] Can access frontend URL
  - [ ] No CORS errors in console
  - [ ] Signup/Login works
  - [ ] Products page loads
  - [ ] Can create products

---

## Post-Deployment Configuration ✅

- [ ] **Update Backend CORS**
  - [ ] Get frontend deployed URL
  - [ ] Backend → Vercel Dashboard → Settings → Environment Variables
  - [ ] Update `FRONTEND_URL` to frontend URL
  - [ ] Save and redeploy: `vercel --prod`

- [ ] **Verify CORS Settings**
  - [ ] Frontend can make API calls
  - [ ] No CORS errors in browser console
  - [ ] Cookies are being sent correctly

- [ ] **Security Review**
  - [ ] No credentials exposed in code
  - [ ] `MONGO_URI` and `JWT_SECRET` are in Vercel, not in repo
  - [ ] CORS origin is specific (not `*`)
  - [ ] Frontend URL matches CORS whitelist

---

## Production Hardening ✅

- [ ] **MongoDB Security**
  - [ ] Network access restricted to Vercel IPs only (in production)
  - [ ] Strong password for database user
  - [ ] Database backups enabled
  - [ ] IP whitelist configured

- [ ] **JWT Security**
  - [ ] Secret is 32+ characters
  - [ ] Generated cryptographically secure
  - [ ] Only known to backend
  - [ ] Rotated periodically (plan)

- [ ] **API Security**
  - [ ] Rate limiting configured (if needed)
  - [ ] Input validation on all endpoints
  - [ ] Error messages don't leak sensitive data
  - [ ] HTTPS enforced (automatic on Vercel)

- [ ] **Frontend Security**
  - [ ] No sensitive data in localStorage except email
  - [ ] JWT token not stored in localStorage
  - [ ] HTTPS enforced
  - [ ] CSP headers configured

---

## Monitoring & Maintenance ✅

- [ ] **Vercel Dashboard**
  - [ ] Set up alerts for function errors
  - [ ] Monitor serverless function execution time
  - [ ] Monitor bandwidth usage
  - [ ] Check deployment logs regularly

- [ ] **MongoDB Atlas**
  - [ ] Monitor connection count
  - [ ] Monitor storage usage
  - [ ] Set up alerts for performance issues
  - [ ] Enable activity tracking

- [ ] **Ongoing Tasks**
  - [ ] Weekly: Check Vercel logs for errors
  - [ ] Weekly: Verify app is accessible
  - [ ] Monthly: Review costs and optimize if needed
  - [ ] Quarterly: Update dependencies for security patches

---

## Troubleshooting Checklist ✅

If something goes wrong:

1. **Check Vercel Logs**
   - [ ] Backend: `vercel logs` (in terminal)
   - [ ] Frontend: Check build logs in dashboard
   - [ ] Look for error messages and stack traces

2. **CORS Errors**
   - [ ] Verify `FRONTEND_URL` environment variable
   - [ ] Check browser console for exact error
   - [ ] Verify frontend domain matches CORS whitelist

3. **Database Connection**
   - [ ] Verify `MONGO_URI` is correct
   - [ ] Check MongoDB Atlas connection string has correct password
   - [ ] Verify Vercel IPs are whitelisted in MongoDB Atlas
   - [ ] Test connection locally first

4. **Module Import Errors**
   - [ ] All imports have `.js` extensions
   - [ ] Backend has `"type": "module"` in package.json
   - [ ] Check for circular dependencies

5. **Deployment Failures**
   - [ ] Check `vercel.json` configuration
   - [ ] Ensure `api/index.js` exists
   - [ ] Check Node version compatibility
   - [ ] Review build command output

---

## Rollback Plan ✅

- [ ] Keep previous deployment URL
- [ ] Know how to revert to previous version in Vercel
- [ ] Have local backup of `.env` variables
- [ ] Database backups are available

---

## Success Criteria ✅

- [ ] Backend API health check returns 200
- [ ] Frontend loads without errors
- [ ] Can signup and create account
- [ ] Can login and stay authenticated
- [ ] Can create, read, update products
- [ ] No CORS errors in browser
- [ ] No unhandled errors in Vercel logs
- [ ] Page load times are acceptable
- [ ] Mobile responsive and functional

---

## Post-Launch Monitoring ✅

- [ ] Track API response times
- [ ] Monitor error rates
- [ ] Check daily for new issues
- [ ] Review user feedback
- [ ] Plan for scaling if needed

