# 🚀 Complete Deployment Guide - Supabase, Vercel & Android APK

## Overview
This guide will help you deploy the dashboard to Vercel and build an Android APK for testing.

---

## Step 1: Supabase Setup

### 1.1. Go to Supabase Dashboard
1. Visit [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Click on your project: **tksodydfsuierqlnmnrr**

### 1.2. Run Database Setup
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `database-setup.sql`
3. Click **Run** to create all tables

### 1.3. Create Storage Bucket
1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name: `fuel-receipts`
4. **Public bucket**: Enable (uncheck private)
5. Click **Create bucket**

### 1.4. Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: https://tksodydfsuierqlnmnrr.supabase.co
   - **Anon/Public Key**: (already in code)
   - **Service Role Key**: Keep this secret! (for server-side only)

---

## Step 2: Local Environment Setup

### 2.1. Create `.env.local` file
```bash
# Create from example
cp .env.local.example .env.local
```

### 2.2. Fill in your credentials
```env
NEXT_PUBLIC_SUPABASE_URL=https://tksodydfsuierqlnmnrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrc29keWRmc3VpZXJxbG5tbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTI3MDEsImV4cCI6MjA3NzEyODcwMX0.YrUr28nJUB6istkCwh_p-qpX_ITVafEWCDbo01I9Zx0

# Get this from Supabase dashboard Settings > API > Service Role Key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2.3. Test locally
```bash
npm run dev
```

Visit: http://localhost:3000

---

## Step 3: Deploy to Vercel

### 3.1. Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2. Deploy
```bash
# In project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: asms-vehicle-management
# - Directory: ./
# - Override settings: No

# Enter Supabase credentials when asked
```

### 3.3. Add Environment Variables in Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click your project → **Settings** → **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3.4. Redeploy
```bash
vercel --prod
```

Your dashboard will be live at: `https://your-project.vercel.app`

---

## Step 4: Android APK Build

### Option A: Using EAS Build (Cloud - Recommended)

#### 4.1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 4.2. Login to Expo
```bash
eas login
```

#### 4.3. Configure Build
The `eas.json` is already created. Configure if needed:
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

#### 4.4. Build APK
```bash
cd mobile
eas build --platform android --profile preview
```

This will:
1. Build your APK in the cloud
2. Email you when done
3. Download link provided

#### 4.5. Download & Install APK
1. Check your email for download link
2. Download APK to your Android device
3. Install (enable "Install from unknown sources" if needed)
4. Launch the app!

---

### Option B: Local Build (Faster for Testing)

#### 4.1. Prerequisites
- Android Studio installed
- Android SDK configured
- JAVA_HOME set

#### 4.2. Generate Keystore
```bash
cd mobile/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

#### 4.3. Build APK Locally
```bash
cd mobile
npx expo run:android
```

This will:
1. Build the APK locally
2. Install on connected device
3. Launch the app

Or build APK only:
```bash
cd mobile/android
./gradlew assembleDebug

# APK location: mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Step 5: Mobile App Configuration

### 5.1. Update Mobile App `.env`
```bash
cd mobile
cp .env.example .env
```

Edit `mobile/.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tksodydfsuierqlnmnrr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 5.2. Test Mobile App
1. Install APK on your Android device
2. Open the app
3. Sign in (demo mode works)
4. Submit a fuel claim
5. Check dashboard for the claim

---

## Step 6: Final Testing

### 6.1. Mobile to Dashboard Flow
1. **Mobile App**: Submit fuel claim with photos
2. **Mobile App**: Tap "Sync" to upload
3. **Dashboard**: Login at Vercel URL
4. **Dashboard**: Claims Queue → See the claim
5. **Dashboard**: Approve/Reject the claim
6. **Mobile App**: History → Check status

### 6.2. Verify Features
- ✅ Employee management
- ✅ Ban/Unban users
- ✅ Zone restrictions
- ✅ Fuel claim submission
- ✅ Photo uploads
- ✅ OCR processing
- ✅ Fraud detection
- ✅ Location tracking

---

## Troubleshooting

### Dashboard not loading on Vercel
- Check environment variables in Vercel dashboard
- Rebuild: `vercel --prod`

### Mobile app can't connect to Supabase
- Check `.env` in mobile folder
- Verify Supabase URL is correct
- Check Supabase RLS policies

### APK build fails
- Clear cache: `cd mobile && rm -rf node_modules && npm install`
- Update Expo: `npx expo install --fix`
- Use EAS build instead: `eas build --platform android`

---

## Quick Commands Reference

```bash
# Deploy to Vercel
vercel --prod

# Build APK with EAS (Cloud)
cd mobile && eas build --platform android --profile preview

# Build APK locally
cd mobile && npx expo run:android

# Start mobile dev server
cd mobile && npm start

# Start dashboard locally
npm run dev

# Run database setup
# Copy database-setup.sql to Supabase SQL Editor
```

---

## 📱 Your App URLs

After deployment, you'll have:
- **Dashboard**: https://your-project.vercel.app
- **Mobile APK**: Download from EAS or local build
- **Database**: https://tksodydfsuierqlnmnrr.supabase.co

---

## Next Steps

1. ✅ Run database setup in Supabase
2. ✅ Deploy to Vercel
3. ✅ Build Android APK
4. ✅ Test mobile app
5. ✅ Test dashboard
6. ✅ Verify sync works
7. ✅ Production ready! 🎉


