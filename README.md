# SoFI Induction Portal

A modern, interactive induction form application for the Society of Financial Informatics (SoFI) at BITS Pilani.

## 🚀 Quick Start

### Prerequisites
- Node.js & npm (or Bun)
- Supabase account with access to project `hbydnuuzcdkcfimlwsyd`

### Setup Instructions

1. **Clone and Install**
   ```sh
   git clone <YOUR_GIT_URL>
   cd sofi-induction-portal
   npm install
   ```

2. **Configure Supabase**
   
   **Option A: Using the setup script (recommended)**
   ```sh
   node setup-config.js
   ```
   
   **Option B: Manual configuration**
   - Get your anon key from [Supabase Dashboard](https://supabase.com/dashboard/project/hbydnuuzcdkcfimlwsyd/settings/api)
   - Update `src/integrations/supabase/client.ts` (line 6)
   - Update `.env.local` (line 2)
   
   See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed steps.

3. **Run Database Migrations**
   ```sh
   supabase db push
   ```
   
   Or manually execute SQL files from the Supabase SQL Editor (see [DATABASE_SETUP.md](DATABASE_SETUP.md))

4. **Start Development Server**
   ```sh
   npm run dev
   ```

## 🔐 Admin Access

- **Username**: `sofigoats`
- **Password**: `sofiinduction2`

Access the admin panel at `/admin` after logging in.

## 📊 Database

**Project**: `https://hbydnuuzcdkcfimlwsyd.supabase.co`

**Connection String**: 
```
postgresql://postgres:[YOUR-PASSWORD]@db.hbydnuuzcdkcfimlwsyd.supabase.co:5432/postgres
```

### Tables:
- **applications** - Stores induction form submissions
- **admin_users** - Admin authentication
- **important_urls** - SoFI links and resources

## 📚 Documentation

- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Quick setup guide
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Detailed database documentation

## 🛠️ Technology Stack

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL)
- Bun/npm

## Project info

**URL**: https://lovable.dev/projects/cade914b-bc07-43de-81e1-c5fc78e6ae61

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cade914b-bc07-43de-81e1-c5fc78e6ae61) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cade914b-bc07-43de-81e1-c5fc78e6ae61) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
