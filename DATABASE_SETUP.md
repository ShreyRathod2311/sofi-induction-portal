# Database Setup Instructions

## Supabase Configuration

This project is configured to connect to the Supabase database at:
- **Project URL**: `https://hbydnuuzcdkcfimlwsyd.supabase.co`
- **Database**: `postgresql://postgres:[YOUR-PASSWORD]@db.hbydnuuzcdkcfimlwsyd.supabase.co:5432/postgres`

## Setup Steps

### 1. Get Your Supabase Anon Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hbydnuuzcdkcfimlwsyd
2. Navigate to **Settings** → **API**
3. Copy the **anon public** key
4. Update the following files with your anon key:
   - `src/integrations/supabase/client.ts` (replace `YOUR_SUPABASE_ANON_KEY_HERE`)
   - `.env.local` (replace `YOUR_SUPABASE_ANON_KEY_HERE`)

### 2. Run Database Migrations

Run the migrations to create the necessary tables:

```bash
# Using Supabase CLI (recommended)
supabase db push

# Or manually run the SQL files in your Supabase SQL Editor:
# - supabase/migrations/20260109000001_create_admin_users.sql
# - supabase/migrations/20260109000002_create_important_urls.sql
```

### 3. Database Schema

The following tables will be created:

#### `applications` (already exists)
Stores all induction form submissions with all answers and personal information.

#### `admin_users` (new)
Stores admin credentials for the admin panel.
- **Default Admin**:
  - Username: `sofigoats`
  - Password: `sofiinduction2`

#### `important_urls` (new)
Stores important links and URLs related to SoFI.

### 4. Verify Setup

1. Check that all migrations ran successfully in Supabase Dashboard → Database → Migrations
2. Verify tables exist in Database → Tables
3. Confirm the admin user exists:
   ```sql
   SELECT username FROM admin_users;
   ```

### 5. Test the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

2. Test the admin login with:
   - Username: `sofigoats`
   - Password: `sofiinduction2`

3. Submit a test induction form to verify database connectivity

## Database Tables Overview

### applications
- Stores all induction form responses
- Includes personal info, answers to questions, case studies
- Publicly readable, anyone can insert

### admin_users
- Stores admin login credentials
- MD5 hashed passwords (for demo purposes)
- Used for admin panel authentication

### important_urls
- Stores important links for SoFI
- Can be managed through admin panel
- Categories: official, social, portal, etc.

## Security Notes

- **IMPORTANT**: The current implementation uses MD5 for password hashing, which is for demonstration only
- For production, implement proper authentication with bcrypt or use Supabase Auth
- Keep your Supabase anon key secure (it's in `.env.local` which is gitignored)
- The database password in the connection string should be kept secure

## Troubleshooting

### Connection Issues
- Verify your Supabase project is active
- Check that the anon key is correctly set
- Ensure your IP is not blocked (Supabase has IP restrictions in some cases)

### Migration Issues
- Run migrations in order (by filename timestamp)
- Check the Supabase logs for detailed error messages
- Verify you have the correct permissions

### Authentication Issues
- Make sure the admin_users table was created
- Verify the admin user was inserted (check in Supabase Table Editor)
- Password is: `sofiinduction2` (no spaces, all lowercase)

## Admin Credentials

**Username**: `sofigoats`  
**Password**: `sofiinduction2`

⚠️ **Change these credentials in production!**
