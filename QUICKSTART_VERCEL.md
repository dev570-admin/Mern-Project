# Quick Start: Vercel Deployment

## 1️⃣ Local Setup (Test Before Deploying)

### Backend
```bash
cd backend
npm install
cp ../.env.example .env.local
# Edit .env.local with your MongoDB URI and JWT_SECRET
npm start
```

### Frontend  
```bash
cd frontend
npm install
cp .env.example .env.local
# Keep default settings for local dev
npm run dev
```

Test at: `http://localhost:5173`

---

## 2️⃣ Prepare for Vercel

### Create `.env.local` in backend (never commit this):
```bash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here_at_least_32_chars
FRONTEND_URL=http://localhost:5173
```

### Install Vercel CLI:
```bash
npm install -g vercel
```

---

## 3️⃣ Deploy Backend API

```bash
# From project root
vercel

# Answer prompts:
# ? Which scope? → Your Vercel account
# ? Link to existing project? → No (first time)
# ? Project name? → mern-app (or your choice)
# ? Directory? → .
# ? Want to override settings? → No
```

**After deployment**, go to Vercel Dashboard → Settings → Environment Variables and add:
- `MONGO_URI` = your MongoDB connection string
- `JWT_SECRET` = your secret key
- `FRONTEND_URL` = (leave empty for now, will update after frontend deployment)

**Redeploy** to apply env vars:
```bash
vercel --prod
```

Your API is now at: `https://your-project.vercel.app/api/`

---

## 4️⃣ Deploy Frontend

### Update axios.js reference:
```bash
cd frontend
```

Create `.env.local`:
```
VITE_API_URL=https://your-project.vercel.app/
```

### Deploy:
```bash
npm run build
vercel
```

Your Frontend is now at: `https://your-frontend-project.vercel.app`

---

## 5️⃣ Final Step: Update Backend CORS

Go to Backend → Vercel Dashboard → Settings → Environment Variables:
- Update `FRONTEND_URL` = `https://your-frontend-project.vercel.app`
- Redeploy: `vercel --prod`

---

## ✅ Testing

### Health Check API
```bash
curl https://your-project.vercel.app/api/health
# Should return: {"status":"healthy"}
```

### Login Test
Open frontend → Sign Up → Create account → Login

---

## 🚀 Production Checklist

- [ ] MongoDB Atlas cluster created and whitelisted Vercel IPs
- [ ] `MONGO_URI` environment variable set
- [ ] `JWT_SECRET` is a strong random string
- [ ] `FRONTEND_URL` points to your deployed frontend
- [ ] Frontend `VITE_API_URL` points to your deployed backend
- [ ] Both backend and frontend deployed on Vercel
- [ ] CORS errors resolved
- [ ] Tested signup, login, and product operations

---

## 🆘 Troubleshooting

### "Cannot find module"
- Make sure `api/index.js` exists in project root
- Check all imports use `.js` extensions

### CORS errors
- Verify `FRONTEND_URL` env var in backend
- Check browser console for exact error

### Database connection failed
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas firewall allows Vercel (use `0.0.0.0/0` for testing)

### Functions timing out
- Check Vercel logs: `vercel logs`
- Increase MongoDB Atlas connection pool

---

## 📚 References
- [Vercel Deployment Docs](VERCEL_DEPLOYMENT.md)
- [Project Root](../)
