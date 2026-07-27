# Finance Tracker - Quick Start

Your finance tracker is set up **exactly like FlyerPath** — Vercel + Supabase.

## 🚀 Get Online in 5 Minutes

### Step 1: Create Supabase Project (2 min)
- Go to [supabase.com](https://supabase.com)
- New Project → fill details
- Settings > API → copy 3 keys (URL, anon key, service role key)

### Step 2: Update .env.local (1 min)
```bash
# Copy .env.local.example to .env.local
# Paste your 3 Supabase keys
```

### Step 3: Push to GitHub (1 min)
```bash
cd finance-tracker
git init
git add .
git commit -m "Finance tracker"
git remote add origin https://github.com/YOU/finance-tracker
git push -u origin main
```

### Step 4: Deploy to Vercel (1 min)
- vercel.com → Sign in with GitHub
- Import Project → select finance-tracker
- Add env vars (same 3 Supabase keys)
- Deploy ✅

**Your app is live!**

## 📁 Project Structure (Same as FlyerPath)

```
finance-tracker/
├── app/               # Next.js pages & API routes
│   ├── page.js        # Dashboard
│   ├── accounts/      # Bank accounts page
│   ├── invoices/      # Invoices page
│   ├── jobs/          # Jobs page
│   ├── expenses/      # Expenses page
│   └── taxes/         # Tax tracking page
├── components/        # Reusable React components
├── lib/
│   ├── supabaseClient.js  # Supabase connection
│   ├── financeUtils.js    # Calculations & helpers
│   └── finance-schema.sql # Database tables
├── .env.local.example # Template for secrets
├── vercel.json        # Vercel config
└── package.json       # Dependencies
```

## 🔧 What's Different from Local?

| Feature | Local | Production |
|---------|-------|------------|
| Data | In-memory (resets) | Supabase (persistent) |
| Hosting | localhost:3000 | your-domain.vercel.app |
| Auth | None yet | Ready to add |
| API Routes | Ready | Auto-deployed |

## 📝 Database Schema

The schema is already defined in `lib/finance-schema.sql`. When you deploy:
1. Go to Supabase SQL Editor
2. Create new query
3. Paste finance-schema.sql
4. Run it
5. Done! Tables are ready

## 🔐 Secrets Management

- ✅ `NEXT_PUBLIC_SUPABASE_URL` — Safe to expose (public)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Safe to expose (public)
- 🔒 `SUPABASE_SERVICE_ROLE_KEY` — NEVER commit to GitHub

Vercel keeps secrets in their vault. Your `.env.local` stays local only.

## 🎯 Next: Connect Data to Database

When ready for real persistence:
1. Uncomment API calls in each page
2. Implement API routes in `/app/api/finance/*`
3. Use `supabase` client from `lib/supabaseClient.js`
4. Data automatically syncs to Supabase

## 💡 Pro Tips

- Test locally first: `npm run dev` with .env.local filled
- Use Supabase dashboard to browse/edit data directly
- Check Vercel deployment logs if something breaks
- Keep service_role_key super secret — it has full database access

---

**Need help?** See `DEPLOYMENT.md` for detailed instructions.
