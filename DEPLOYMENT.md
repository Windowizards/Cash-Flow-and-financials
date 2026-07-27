# Finance Tracker - Deployment Guide

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details (name, password, region)
4. Wait for project to initialize (2-3 min)
5. Go to **Settings > API**
6. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` (scroll down) → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Set Up Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy & paste content from `lib/finance-schema.sql`
4. Click **Run**
5. Enable RLS if prompted

### 3. Update Local .env.local

Copy `.env.local.example` to `.env.local` and fill in your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Initialize Git & Push to GitHub

```bash
cd finance-tracker
git init
git add .
git commit -m "Initial finance tracker commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finance-tracker
git push -u origin main
```

### 5. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/log in with GitHub
3. Click **Add New Project**
4. Select `finance-tracker` repo
5. Click **Import Project**
6. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
7. Click **Deploy**

**Your app is now live!** 🚀

### 6. Update API Routes (When Ready)

The Supabase client is already set up in `lib/supabaseClient.js`. When you want to add real data persistence:

1. Uncomment and implement the API route calls in each page
2. Update forms to POST/PATCH/DELETE to `/api/finance/*` endpoints
3. Data will persist in Supabase

## Environment Variables Checklist

For production (Vercel), add these env vars:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` (public - OK to expose)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public - OK to expose)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (SECRET - never commit)

## Troubleshooting

**Module not found errors?**
- Make sure `jsconfig.json` is in root
- Run `npm install` again

**Supabase connection fails?**
- Check env vars are copied correctly
- Verify project is active in Supabase dashboard
- Check browser console for detailed error

**RLS errors on API calls?**
- Run the schema SQL again
- Make sure policies are enabled
- Verify authenticated user is logged in

## Next Steps

- Add Supabase auth (sign up/login)
- Implement real data storage
- Add more calculations & reports
- Mobile app with Capacitor (like flyer-tracker-app)
- Automated notifications & reminders
