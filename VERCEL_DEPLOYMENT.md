# Vercel Deployment Checklist

## Backend Environment Variables in Vercel:

Go to your backend Vercel project settings and add these environment variables:

```
MONGO_URI=mongodb+srv://monkeiydluffy752:hdx2lkDWkNhNOggC@cluster0.jtvkt.mongodb.net/anime-site?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
PORT=3000
NODE_ENV=production
JIKAN_API_URL=https://api.jikan.moe/v4
FRONTEND_URL=https://anime-verse-ultimate-destination-fo.vercel.app
```

## Frontend Environment Variables in Vercel:

Go to your frontend Vercel project settings and add:

```
VITE_API_URL=https://animeversebackend-dacewas-projects.vercel.app/api
```

## Testing Endpoints:

After deployment, test these URLs:

1. **Health Check:**
   https://animeversebackend-dacewas-projects.vercel.app/

2. **API Endpoints:**
   - https://animeversebackend-dacewas-projects.vercel.app/api/anime/top
   - https://animeversebackend-dacewas-projects.vercel.app/api/anime/search?q=naruto
   - https://animeversebackend-dacewas-projects.vercel.app/api/auth/me

## Common Issues:

### 1. No data showing:
- ✅ Check Vercel logs (Functions tab)
- ✅ Verify all environment variables are set
- ✅ MongoDB Atlas IP whitelist: Add `0.0.0.0/0` (allow all)

### 2. CORS errors:
- ✅ FRONTEND_URL must match exactly (no trailing slash)
- ✅ Updated CORS config to allow your frontend

### 3. 500 errors:
- ✅ Check MongoDB connection string
- ✅ Check Vercel function logs

## MongoDB Atlas Setup:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Save

## After Changes:

```bash
git add .
git commit -m "Fix Vercel deployment and CORS"
git push origin main
```

Vercel will auto-deploy on push.

## View Logs:

Backend logs: https://vercel.com/cross-entropy0/animeversebackend-dacewas-projects/logs
Frontend logs: https://vercel.com/cross-entropy0/anime-verse-ultimate-destination-fo/logs
