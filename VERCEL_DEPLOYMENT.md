# Vercel Deployment Guide

## Overview
This project is configured for serverless deployment on Vercel. The backend API is deployed as serverless functions, and the frontend can be deployed separately.

## Project Structure
```
.
├── api/
│   └── index.js          # Main serverless function entry point
├── backend/              # Express app and routes
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── Middleware/
│   └── package.json
├── frontend/             # React + TypeScript frontend
├── vercel.json          # Vercel configuration
├── .vercelignore        # Files to ignore during deployment
└── .env.example         # Environment variables template
```

## Prerequisites
- Vercel account (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)
- MongoDB Atlas account (for cloud database)
- Node.js 18+ locally

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user and get the connection string
4. Get your connection string in the format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

## Step 2: Prepare Your Project

1. Ensure both `backend/package.json` and `package-vercel.json` exist
2. Create `.env.local` file locally (not committed):
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=http://localhost:5173
   ```

3. Test locally:
   ```bash
   cd backend && npm install
   npm start
   ```

## Step 3: Deploy Backend to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. When prompted:
   - Confirm project name
   - Set build and output settings (defaults are fine)
   - Add environment variables when asked

### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework: `Other`
   - Root Directory: `.` (root)
   - Build Command: Leave empty
   - Output Directory: Leave empty
6. Add environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret
   - `FRONTEND_URL` - Your frontend URL (will be set after frontend deployment)

## Step 4: Set Environment Variables on Vercel

After deployment, add environment variables in Vercel dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add:
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (secure random string)
   - `FRONTEND_URL` (your frontend domain once deployed)

## Step 5: Deploy Frontend to Vercel

1. Navigate to frontend folder:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

   Or through GitHub integration:
   - Push frontend code to a separate repo OR
   - Configure a monorepo setup in vercel.json

3. In `frontend/src/axios.js`, update the API base URL:
   ```javascript
   const baseURL = process.env.NODE_ENV === 'production'
     ? 'https://your-backend-api.vercel.app'
     : 'http://localhost:5000';
   ```

4. Redeploy frontend with the new environment variables

## Step 6: Update CORS Settings

After both deployments, update the `FRONTEND_URL` environment variable on the backend to match your frontend deployment URL:

1. Backend API will allow requests from that URL
2. Frontend will communicate with the backend through the correct domain

## API Endpoint

Once deployed, your API will be available at:
```
https://your-project-name.vercel.app/api/
```

Available endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/getallproducts` - Get all products
- `POST /api/addproduct` - Add new product (requires auth)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens (use a secure random string) |
| `FRONTEND_URL` | Yes | Your frontend deployment URL (for CORS) |
| `NODE_ENV` | No | Set to 'production' automatically by Vercel |

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` environment variable is set correctly
- Check browser console for exact error message
- Verify the frontend domain matches the CORS whitelist

### Database Connection Errors
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas firewall allows Vercel IPs
- Try adding `0.0.0.0/0` to IP whitelist (or use static IPs for production)

### Functions Timing Out
- Check if MongoDB is connecting properly
- Review serverless function logs in Vercel dashboard

### Import/Export Issues
- Ensure all imports use `.js` extensions for ES modules
- Backend uses `"type": "module"` in package.json

## Vercel CLI Commands

```bash
# Deploy the project
vercel

# Deploy with production settings
vercel --prod

# View logs
vercel logs

# Remove a deployment
vercel remove
```

## Additional Notes

- Keep MongoDB Atlas connection string secure and use environment variables
- Generate a strong JWT secret (use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Use environment variables for all sensitive data
- Monitor Vercel usage (free tier has limits on serverless function execution time)

## References

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js Guide](https://expressjs.com/)
