# Complete Deployment Checklist - BSEntrepSystem

## 📋 Full System Deployment Plan

Your system has 4 components to deploy:
1. **Database** (MySQL) → Railway
2. **Backend** (Node.js) → Railway
3. **Forecast Service** (Python/FastAPI) → Railway
4. **Frontend** (React/Vite) → Vercel

---

## 🗄️ Phase 1: Database Setup (Do First!)

### Prerequisites
- [ ] Local MySQL database running with all tables
- [ ] MySQL command-line tools installed

### Export Database
- [ ] Run `export_database.bat` (Windows) or `export_database.sh` (Mac/Linux)
- [ ] Save the backup file `capstter_backup_YYYYMMDD_HHMMSS.sql`
- [ ] Note the file size and location

### Deploy to Railway
- [ ] Create Railway account (railway.app)
- [ ] Create new project
- [ ] Add MySQL Plugin
- [ ] Wait for provisioning (2-3 minutes)
- [ ] Copy credentials: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`

### Import Data
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Connect: `railway connect --service mysql`
- [ ] Import backup: `SOURCE /path/to/capstter_backup_YYYYMMDD_HHMMSS.sql;`
- [ ] Verify tables: `SHOW TABLES;`
- [ ] Verify data: `SELECT COUNT(*) FROM user_table;`

**Status**: ✅ Database ready

---

## 🔧 Phase 2: Backend Deployment

### Prerequisites
- [ ] Backend pushed to GitHub
- [ ] `.env.example` updated
- [ ] `Procfile` exists in backend folder
- [ ] `package.json` has `start` script

### Create Backend Service in Railway
- [ ] Railway Dashboard → New Service → Deploy from GitHub
- [ ] Select `backend` folder as root directory
- [ ] Wait for build (3-5 minutes)

### Configure Database Connection
In Railway Backend → Variables, add:

```
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_NAME=${{MYSQLDATABASE}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
```

- [ ] Added database variables (with ${{ }} syntax)

### Configure Other Variables
In Railway Backend → Variables, add:

```
PORT=5000
JWT_SECRET=[your-secret-key]
CLOUDINARY_CLOUD_NAME=[your-cloud-name]
CLOUDINARY_API_KEY=[your-api-key]
CLOUDINARY_API_SECRET=[your-api-secret]
FRONTEND_URL=https://your-vercel-app.com
ALLOWED_ORIGINS=https://your-vercel-app.com
```

- [ ] Added JWT_SECRET
- [ ] Added Cloudinary credentials
- [ ] Added FRONTEND_URL (will update with Vercel URL)
- [ ] Set ALLOWED_ORIGINS

### Verify Backend
- [ ] Check Railway logs: No database errors
- [ ] Test health endpoint: `curl https://your-backend-url/api/health`
- [ ] Response: `{"status": "OK"}`
- [ ] Note the Backend URL: `https://your-backend-railway.up.railway.app`

**Status**: ✅ Backend ready

---

## 🤖 Phase 3: Forecast Service Deployment

### Prerequisites
- [ ] Forecast Service pushed to GitHub
- [ ] `Procfile` exists
- [ ] `requirements.txt` includes uvicorn
- [ ] `.env.example` created

### Create Forecast Service in Railway
- [ ] Railway → New Service → Deploy from GitHub
- [ ] Select `forecast-service` folder
- [ ] Wait for build

### Configure Environment
In Railway Forecast Service → Variables:

```
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-vercel-app.com,https://your-backend-railway.up.railway.app
```

- [ ] Set ENVIRONMENT to `production`
- [ ] Set ALLOWED_ORIGINS (comma-separated)

### Verify Forecast Service
- [ ] Check logs: No errors
- [ ] Test health: `curl https://your-forecast-url/`
- [ ] Response: `{"service": "Forecast Service", "status": "running"}`
- [ ] Check API docs: `https://your-forecast-url/docs`
- [ ] Note the URL: `https://your-forecast-railway.up.railway.app`

**Status**: ✅ Forecast Service ready

---

## 🎯 Phase 4: Backend Update (Forecast Service Integration)

### Update Backend with Forecast Service URL

In Railway Backend → Variables, add:

```
FORECAST_SERVICE_URL=https://your-forecast-railway.up.railway.app
```

- [ ] Added FORECAST_SERVICE_URL
- [ ] Backend will redeploy automatically

### Verify Integration
- [ ] Check backend logs: No errors
- [ ] Backend can reach Forecast Service

**Status**: ✅ Backend ↔ Forecast Service integration complete

---

## 🎨 Phase 5: Frontend Deployment (Vercel)

### Prerequisites
- [ ] Frontend code pushed to GitHub
- [ ] `vercel.json` created
- [ ] `axiosInstance.jsx` uses `VITE_API_URL`
- [ ] `.env.example` created

### Deploy to Vercel
- [ ] Go to vercel.com → New Project
- [ ] Import repository
- [ ] Select `capstter` folder as root
- [ ] Click Deploy

### Configure Environment
In Vercel Project Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-railway.up.railway.app/api
```

- [ ] Set VITE_API_URL to backend URL

### Trigger Redeployment
- [ ] Vercel → Deployments → Redeploy (apply new env vars)
- [ ] Wait for build

### Verify Frontend
- [ ] Frontend loads at `https://your-app.vercel.app`
- [ ] No console errors
- [ ] Can make API calls to backend
- [ ] Login works
- [ ] Get Vercel URL: `https://your-app.vercel.app`

**Status**: ✅ Frontend ready

---

## 🔄 Phase 6: Update CORS & Origins

### Update Frontend URL Everywhere

#### Backend (if not done)
In Railway Backend → Variables:
```
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

#### Forecast Service
In Railway Forecast Service → Variables:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-backend-railway.up.railway.app
```

- [ ] Updated all CORS origins
- [ ] Services redeploy automatically

### Verify Cross-Service Communication
- [ ] [ ] Frontend → Backend ✓
- [ ] [ ] Backend → Forecast Service ✓
- [ ] [ ] Backend → Database ✓
- [ ] [ ] No CORS errors ✓

**Status**: ✅ All services communicate

---

## 🧪 Phase 7: Testing & Verification

### Database Connectivity
- [ ] Backend logs show no database errors
- [ ] Can query user data: `GET /api/users`
- [ ] Data returns correctly

### Backend Functionality
- [ ] Authentication works: `POST /api/auth/login`
- [ ] Protected routes work: `GET /api/auth/verify`
- [ ] Business operations work

### Forecast Service
- [ ] Health check: `GET /forecast/`
- [ ] Auto forecast: `POST /forecast/auto`
- [ ] Returns valid predictions

### Frontend
- [ ] Can navigate without errors
- [ ] Login/logout works
- [ ] Dashboard loads
- [ ] API calls succeed
- [ ] No console errors

### Cross-Domain
- [ ] No CORS errors
- [ ] Frontend can call backend
- [ ] Backend can call forecast service

**Status**: ✅ All systems operational

---

## 📊 Deployment Summary

| Component | Platform | Status | URL |
|-----------|----------|--------|-----|
| Database | Railway MySQL | ✅ | `${{MYSQLHOST}}:${{MYSQLPORT}}` |
| Backend | Railway | ✅ | `https://your-backend-railway.up.railway.app` |
| Forecast | Railway | ✅ | `https://your-forecast-railway.up.railway.app` |
| Frontend | Vercel | ✅ | `https://your-app.vercel.app` |

---

## 🚀 Launch Checklist

Before going live:

- [ ] All services are running
- [ ] All tests pass
- [ ] Database is backed up
- [ ] Monitoring is set up
- [ ] Logs are being collected
- [ ] Support documentation exists
- [ ] Team is trained on the system
- [ ] Runbook for incidents created
- [ ] Deployment process documented
- [ ] Rollback plan in place

---

## 📝 Deployment URLs (Save These)

```
Frontend:    https://your-app.vercel.app
Backend API: https://your-backend-railway.up.railway.app/api
Forecast:    https://your-forecast-railway.up.railway.app
DB Host:     [MYSQLHOST from Railway]
API Docs:    https://your-backend-railway.up.railway.app/api/docs
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] CORS only allows your domains
- [ ] Cloudinary API keys are correct
- [ ] Database password is strong
- [ ] No secrets in code or git
- [ ] HTTPS enforced everywhere
- [ ] Environment variables are hidden
- [ ] Backup strategy in place

---

## 📞 Support Resources

### Documentation
- [`DATABASE_DEPLOYMENT.md`](./DATABASE_DEPLOYMENT.md) - Complete database guide
- [`DATABASE_QUICK_REFERENCE.md`](./DATABASE_QUICK_REFERENCE.md) - Quick reference
- [`backend/DEPLOYMENT.md`](./backend/DEPLOYMENT.md) - Backend guide
- [`capstter/DEPLOYMENT.md`](./capstter/DEPLOYMENT.md) - Frontend guide
- [`forecast-service/DEPLOYMENT.md`](./forecast-service/DEPLOYMENT.md) - Forecast guide

### Helpful Commands

```bash
# Export database
./export_database.bat          # Windows
bash export_database.sh        # Mac/Linux

# Connect to Railway services
railway login
railway connect --service mysql
railway connect --service backend

# Monitor logs
railway tail                   # All services
railway tail --service backend # Specific service

# Test endpoints
curl https://your-backend/api/health
curl https://your-forecast/
curl https://your-app.vercel.app
```

---

## ✅ Final Verification

Run this final checklist before declaring deployment complete:

- [ ] **Database**: `SELECT COUNT(*) FROM user_table;` returns data
- [ ] **Backend**: `GET /api/health` returns `{"status":"OK"}`
- [ ] **Forecast**: `GET /forecast/` returns service info
- [ ] **Frontend**: Page loads without console errors
- [ ] **Auth**: Can login successfully
- [ ] **API**: Get `/api/users` returns user list
- [ ] **Forecast**: Post to `/forecast/auto` returns predictions
- [ ] **CORS**: No CORS errors in console
- [ ] **Performance**: Page loads in < 3 seconds
- [ ] **Mobile**: Works on mobile devices

---

## 🎉 Deployment Complete!

Your BSEntrepSystem is now live and production-ready!

**Next**: Monitor logs, set up alerts, and maintain the system.

---

*Last Updated: May 20, 2026*
*Deployment System: Railway + Vercel*
