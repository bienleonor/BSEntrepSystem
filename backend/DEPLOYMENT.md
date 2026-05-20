# Backend Deployment Guide - Railway

## Prerequisites

- Railway account (https://railway.app)
- GitHub account with the repository pushed
- MySQL database (Railway provides one, or use your own)

## Step 1: Push Code to GitHub

Ensure your backend code is pushed to GitHub with the updated `.env.example` and `Procfile`.

```bash
cd backend
git add .
git commit -m "Prepare backend for Railway deployment"
git push
```

## Step 2: Create Database on Railway

### Option A: Use Railway's MySQL Plugin (Recommended)

1. Go to [https://railway.app](https://railway.app)
2. Create a new project
3. Click "Add a Plugin" → Select "MySQL"
4. Railway will automatically provide database credentials

### Option B: Use Your Own MySQL Server

If you already have a MySQL server running:
- Note down: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## Step 3: Deploy Backend to Railway

### Using Railway CLI (Recommended for first deployment)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize and deploy:
   ```bash
   cd backend
   railway init
   railway up
   ```

4. This will open Railway dashboard and deploy your service

### Using Railway Dashboard (Alternative)

1. Go to [https://railway.app](https://railway.app)
2. Create a new project
3. Click "Deploy from GitHub"
4. Select your repository
5. Select the `backend` folder as Root Directory

## Step 4: Configure Environment Variables in Railway

In Railway Dashboard → Select Service → Variables:

### Database Variables (if using Railway MySQL)
Railway will auto-detect and populate:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

### Required Environment Variables to Set Manually

```
JWT_SECRET = your_jwt_secret_key_here_change_this

CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret

FRONTEND_URL = https://your-app.vercel.app
```

### Optional Variables

```
PORT = 5000  # Railway sets this automatically, usually leave blank
```

## Step 5: Test Your Deployment

1. Get your Railway deployment URL from the dashboard
2. Update [FRONTEND_URL] in your frontend `.env` to point to your Railway backend:
   ```
   VITE_API_URL=https://your-railway-backend-url/api
   ```

3. Test an API call:
   ```bash
   curl https://your-railway-backend-url/api/auth/health
   ```

## Step 6: Update Frontend Deployment

Go back to Vercel and update the environment variable:

```
VITE_API_URL = https://your-railway-backend-url/api
```

Then trigger a redeployment on Vercel.

## Troubleshooting

### Database Connection Error

**Error**: `connect ECONNREFUSED` or `Cannot read properties of undefined`

**Solution**:
1. Verify all `DB_*` environment variables are set in Railway
2. Check that the MySQL service is running
3. Ensure `DB_NAME` matches the database you created

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Verify `FRONTEND_URL` is set correctly (e.g., `https://your-app.vercel.app`)
2. Trigger a redeployment in Railway after updating the variable

### Port Issues

**Error**: `EADDRINUSE` or port already in use

**Solution**:
- Leave `PORT` environment variable blank; Railway assigns one automatically
- Update `package.json` to use `process.env.PORT || 5000`

(This is already done in your `server.js`)

### Deployment Fails

**Check**:
1. Node version compatibility - Railway uses Node 18 LTS by default
2. Verify `Procfile` exists in backend directory
3. Check `package.json` has `start` script: `"start": "node src/server.js"`
4. Run locally: `npm install && npm start` to verify it works

## Deployment URLs

Once deployed, you'll have:

- **Backend API**: `https://your-railway-backend-url/api/...`
- **Database**: Connected automatically via environment variables

## Database Migrations

If you need to run migrations on Railway:

```bash
railway run node migrations/your-migration.js
```

Or use Railway dashboard to execute commands.

## Viewing Logs

In Railway Dashboard:
- Click on your service
- Go to "Logs" tab to see real-time logs
- Check for errors and debug issues

## Monitoring & Health

Add a health check endpoint to your `app.js`:

```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});
```

Monitor it at: `https://your-railway-backend-url/api/health`

## Summary of Commands

```bash
# Local development
npm install
npm run dev

# Test production build locally
NODE_ENV=production npm start

# Railway deployment
railway login
railway init
railway up
```

## Next Steps

1. ✅ Update `.env` file with production values
2. ✅ Deploy to Railway using CLI or Dashboard
3. ✅ Set all environment variables in Railway dashboard
4. ✅ Test API endpoints
5. ✅ Update frontend `VITE_API_URL`
6. ✅ Redeploy frontend on Vercel
