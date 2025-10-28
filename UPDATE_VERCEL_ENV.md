# Update Vercel Environment Variables

## Current Status
✅ NEXT_PUBLIC_SUPABASE_URL - SET  
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY - SET  
❌ DATABASE_URL - MISSING (required for Prisma)

## Add DATABASE_URL to Vercel

### Option 1: Via Vercel Dashboard
1. Go to https://vercel.com/ahmadkhanworkspace-gmailcoms-projects/fuel/settings/environment-variables
2. Click "Add New"
3. Name: `DATABASE_URL`
4. Value: `postgresql://postgres.tksodydfsuierqlnmnrr:Ahmadkhanprofessi@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`
5. Select all environments (Production, Preview, Development)
6. Click "Save"

### Option 2: Via CLI (run this in PowerShell)
```powershell
vercel env add DATABASE_URL production
# Enter value when prompted: postgresql://postgres.tksodydfsuierqlnmnrr:Ahmadkhanprofessi@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

vercel env add DATABASE_URL preview
# Enter same value

vercel env add DATABASE_URL development
# Enter same value
```

## After Adding Environment Variable

1. Redeploy your project on Vercel
2. Run `npx prisma db push --accept-data-loss` locally
3. Database will sync with Supabase

## Check Current Env Variables
```bash
vercel env ls
```

