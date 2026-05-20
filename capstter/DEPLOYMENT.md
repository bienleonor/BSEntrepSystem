# Deployment Guide - Vercel

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub account with the repository pushed

## Step 1: Update API URL for Production

1. Update your backend API URL in the environment variables
2. For local development, use `.env.local`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Step 2: Deploy to Vercel

### Option A: Via Vercel CLI (Recommended for first deployment)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From the `capstter` directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to your Vercel account
   - Select your project
   - Configure environment variables

### Option B: Via GitHub (Recommended for ongoing deployments)

1. Push your code to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Select the `capstter` folder as the Root Directory
5. Add environment variables in the project settings

## Step 3: Set Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables:

Click **+ Add New Environment Variable** and add:

```
Name: VITE_API_URL
Value: https://bsentrepsystem-production.up.railway.app/api
```

Replace `bsentrepsystem-production.up.railway.app` with your actual Railway backend domain.

Verify it includes `/api` at the end!

## Step 4: Redeploy

After adding environment variables, trigger a new deployment:
- Via CLI: `vercel --prod`
- Via GitHub: Push a new commit to trigger automatic deployment

## Frontend Build Details

- **Build Command**: `npm run build && workbox injectManifest workbox-config.cjs`
- **Output Directory**: `dist`
- **Node Version**: 18 (or latest stable)

## PWA Features

Your app includes PWA support with:
- Service Worker registration (`src/registerSW.js`)
- Offline functionality (`public/offline.html`)
- Manifest file (`public/manifest.webmanifest`)

## Troubleshooting

### API calls returning 404
- Check that `VITE_API_URL` environment variable is set correctly
- Verify backend is running and accessible from Vercel's region

### Service Worker not updating
- Clear browser cache
- Rebuild and redeploy with `vercel --prod`

### Build fails
- Check Node version compatibility
- Verify all dependencies are in `package.json`
- Run `npm install` locally to ensure lock file is updated

## Local Development

```bash
cd capstter
npm install
npm run dev
```

The app will run on `http://localhost:5173` (Vite default)

## Additional Notes

- The `.gitignore` already excludes `.env.local` and `node_modules`
- Use `.env.example` to document required environment variables
- Production deployments should use HTTPS API endpoints
