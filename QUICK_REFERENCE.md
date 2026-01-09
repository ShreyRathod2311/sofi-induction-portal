# 📋 Quick Reference Card

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/hbydnuuzcdkcfimlwsyd |
| API Settings | https://supabase.com/dashboard/project/hbydnuuzcdkcfimlwsyd/settings/api |
| Database URL | postgresql://postgres:[PASSWORD]@db.hbydnuuzcdkcfimlwsyd.supabase.co:5432/postgres |
| Project URL | https://hbydnuuzcdkcfimlwsyd.supabase.co |

## 🔑 Credentials

| Item | Value |
|------|-------|
| Admin Username | `sofigoats` |
| Admin Password | `sofiinduction2` |
| Project ID | `hbydnuuzcdkcfimlwsyd` |

## 📂 Key Files to Update

1. `src/integrations/supabase/client.ts` (line 6) - Add anon key
2. `.env.local` (line 2) - Add anon key

## ⚡ Quick Commands

```bash
# Configure Supabase (interactive)
node setup-config.js

# Run migrations
supabase db push

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🗄️ Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `applications` | Form submissions | full_name, bits_id, email, all answers |
| `admin_users` | Admin auth | username, password_hash |
| `important_urls` | SoFI links | title, url, category |

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Connection error | Check anon key is set correctly |
| Admin login fails | Verify migrations ran, password is `sofiinduction2` |
| Form won't submit | Check `applications` table exists |
| Build errors | Run `npm install` again |

## 📝 Setup Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Get Supabase anon key
- [ ] Run `node setup-config.js` OR manually update files
- [ ] Run `supabase db push` OR execute SQL files
- [ ] Run `npm run dev`
- [ ] Test admin login
- [ ] Test form submission
- [ ] Verify data in Supabase Table Editor

## 📚 Documentation Files

- `SETUP_INSTRUCTIONS.md` - Quick setup guide
- `DATABASE_SETUP.md` - Database documentation
- `CONFIGURATION_SUMMARY.md` - All changes made
- `README.md` - Project overview

---

**Print this page for quick reference during setup!**
