# 🚀 Quick Setup Guide

## ⚠️ IMPORTANT: Complete These Steps Before Running

### Step 1: Get Your Supabase Anon Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/hbydnuuzcdkcfimlwsyd
2. Navigate to **Settings** → **API**
3. Copy the **"anon" public** key (NOT the service_role key)

### Step 2: Update Configuration Files

Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your actual anon key in:

1. **`src/integrations/supabase/client.ts`** - Line 6
2. **`.env.local`** - Line 2

Example:
```typescript
// Before:
const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";

// After (with your actual key):
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### Step 3: Run Database Migrations

You have two options:

#### Option A: Using Supabase CLI (Recommended)
```bash
supabase db push
```

#### Option B: Manual SQL Execution
1. Go to your Supabase Dashboard → SQL Editor
2. Execute these migration files in order:
   - `supabase/migrations/20260109000001_create_admin_users.sql`
   - `supabase/migrations/20260109000002_create_important_urls.sql`

### Step 4: Start the Development Server

```bash
npm run dev
# or
bun run dev
```

## 🔑 Admin Login Credentials

- **Username**: `sofigoats`
- **Password**: `sofiinduction2`

## 📊 Database Information

**Connection String**: `postgresql://postgres:[YOUR-PASSWORD]@db.hbydnuuzcdkcfimlwsyd.supabase.co:5432/postgres`

**Project URL**: `https://hbydnuuzcdkcfimlwsyd.supabase.co`

### Tables Created:
1. **applications** - Stores all induction form submissions
2. **admin_users** - Stores admin login credentials
3. **important_urls** - Stores important SoFI links and URLs

## ✅ Verification Checklist

- [ ] Supabase anon key added to `client.ts`
- [ ] Supabase anon key added to `.env.local`
- [ ] Database migrations executed successfully
- [ ] Development server running
- [ ] Can access the application at `http://localhost:5173` (or your port)
- [ ] Admin login works with credentials above
- [ ] Form submissions save to database

## 🆘 Troubleshooting

### "Failed to fetch" or connection errors:
- Verify your anon key is correct
- Check that migrations ran successfully in Supabase Dashboard
- Ensure your Supabase project is active

### Admin login not working:
- Check that the `admin_users` migration ran
- Verify the admin user exists in Supabase Table Editor
- Password is exactly: `sofiinduction2` (no spaces, lowercase)

### Form submission errors:
- Verify the `applications` table exists
- Check browser console for detailed errors
- Ensure RLS policies are enabled

## 📝 Next Steps

After setup, you can:
1. Access the admin panel at `/admin`
2. View and manage form submissions
3. Add/edit important URLs in the database
4. Customize the application as needed

---

**Need more details?** See `DATABASE_SETUP.md` for comprehensive documentation.
