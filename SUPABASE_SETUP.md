# Supabase Setup Guide

This guide will help you set up Supabase authentication for your MCP Next.js application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Click "New project"
3. Choose your organization and provide a project name
4. Set a database password (save this for later)
5. Choose a region close to your users
6. Click "Create new project"

## 2. Configure Authentication Providers

### GitHub Provider (Recommended)

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Find **GitHub** in the list and click to expand it
3. Enable the GitHub provider
4. You'll need to create a GitHub OAuth App:
   - Go to GitHub > Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"
   - Fill in the details:
     - Application name: Your app name
     - Homepage URL: `http://localhost:3000` (for development)
     - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Click "Register application"
   - Copy the Client ID and Client Secret

5. Back in Supabase, enter your GitHub Client ID and Client Secret
6. Click "Save"

### Other Providers

You can also enable other providers like Google, Discord, Facebook, etc. The process is similar - enable the provider and configure the OAuth credentials.

## 3. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (starts with `https://...supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## 4. Configure Environment Variables

Update your `.env` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database (use your existing PostgreSQL database or Supabase database)
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# OAuth (for MCP server functionality)
AUTH_SECRET="your-random-secret-string"

# Redis (for SSE transport)
REDIS_URL="redis://localhost:6379"
```

## 5. Update Your OAuth App URLs

When deploying to production, make sure to update:

1. **GitHub OAuth App** callback URL to: `https://your-project.supabase.co/auth/v1/callback`
2. **NEXT_PUBLIC_SITE_URL** to your production domain
3. **Supabase Auth Settings**:
   - Go to **Authentication** > **URL Configuration**
   - Set **Site URL** to your production domain
   - Add your production domain to **Redirect URLs**

## 6. Database Setup

You can either:

### Option A: Use Supabase Database
- Use the DATABASE_URL from your Supabase project
- Run `prisma db push` to create the tables

### Option B: Use External Database
- Keep your existing PostgreSQL database
- The Supabase auth and your app database can be separate

## 7. Testing

1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Sign in with GitHub"
4. You should be redirected to GitHub for authentication
5. After authorizing, you should be redirected back and logged in

## Security Notes

- Never commit your `.env` file to version control
- Use different Supabase projects for development and production
- Rotate your secrets regularly
- Enable RLS (Row Level Security) on your Supabase tables if using Supabase database