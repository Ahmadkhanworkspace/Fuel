# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables to your Vercel project:

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:

```bash
# Database Connection (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.tksodydfsuierqlnmnrr:Ahmadkhanprofessi@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://tksodydfsuierqlnmnrr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrc29keWRmc3VpZXJxbG5tbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTI3MDEsImV4cCI6MjA3NzEyODcwMX0.YrUr28nJUB6istkCwh_p-qpX_ITVafEWCDbo01I9Zx0"
```

## Local Development

Update your `.env.local` file:

```bash
DATABASE_URL="postgresql://postgres.tksodydfsuierqlnmnrr:Ahmadkhanprofessi@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://tksodydfsuierqlnmnrr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrc29keWRmc3VpZXJxbG5tbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTI3MDEsImV4cCI6MjA3NzEyODcwMX0.YrUr28nJUB6istkCwh_p-qpX_ITVafEWCDbo01I9Zx0"
```

## After Adding Variables

1. Run `npx prisma db push --accept-data-loss` locally to sync schema
2. Deploy to Vercel
3. Run Prisma migrations in Vercel after deployment

