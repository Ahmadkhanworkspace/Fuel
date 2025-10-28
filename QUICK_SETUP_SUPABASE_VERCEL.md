# ⚡ Quick Setup - Supabase, Vercel & Android APK

## 📋 Step-by-Step Guide

### 🗄️ STEP 1: Supabase Setup (5 minutes)

1. Go to [https://supabase.com](https://supabase.com) and login
2. Your project URL is: `https://supabase.com/dashboard/project/tksodydfsuierqlnmnrr`
3. Click **SQL Editor** on the left sidebar
4. Click **New Query**
5. Copy and paste ALL content from `database-setup.sql`
6. Click **Run** (green button)
7. You should see "Success" message

**Create Storage Bucket:**
1. Click **Storage** on left sidebar
2. Click **New Bucket**
3. Name: `fuel-receipts`
4. Make it **Public** (uncheck private)
5. Click **Create**

✅ Supabase is ready!

---

### 🌐 STEP 2: Vercel Deployment (5 minutes)

**Option A: Using Vercel Dashboard**

1. Go to [https://vercel.com](https://vercel.com) and sign up/login
2. Click **Add New Project**
3. Import this Git repository (or upload the folder)
4. In **Environment Variables**, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://tksodydfsuierqlnmnrr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrc29keWRmc3VpZXJxbG5tbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTI3MDEsImV4cCI6MjA3NzEyODcwMX0.YrUr28nJUB6istkCwh_p-qpX_ITVafEWCDbo01I9Zx0
   ```
5. Click **Deploy**
6. Wait 2-3 minutes for deployment
7. Your dashboard is live! 🎉

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables when prompted or in Vercel dashboard
```

✅ Dashboard deployed to Vercel!

---

### 📱 STEP 3: Build Android APK (10 minutes)

**EASIEST METHOD - Use EAS Build (Cloud)**

```bash
# Navigate to mobile folder
cd mobile

# Install EAS CLI (if not already installed)
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview

# This will take 10-15 minutes
# You'll get a download link when done!
```

**Install APK:**
1. Check your email for download link
2. Download APK to your Android phone
3. Enable "Install from Unknown Sources" in phone settings
4. Install and launch the app!

---

### 🧪 STEP 4: Test Everything

**Test Dashboard:**
1. Go to your Vercel URL: `https://your-project.vercel.app`
2. Login with demo credentials
3. Check Claims Queue
4. Manage Employees
5. Everything should work!

**Test Mobile App:**
1. Open the app on your phone
2. Login (demo mode)
3. Submit a fuel claim
4. Tap "Sync"
5. Check dashboard for the claim
6. Approve from dashboard
7. Check status in mobile app

---

## 🎯 Complete Checklist

- [ ] Supabase database setup complete
- [ ] Storage bucket created
- [ ] Vercel deployment live
- [ ] Environment variables set
- [ ] Android APK built and installed
- [ ] Mobile app connects to Supabase
- [ ] Dashboard displays claims
- [ ] Sync works end-to-end
- [ ] Ready for production!

---

## 📞 Need Help?

1. **Dashboard not loading?**
   - Check environment variables in Vercel
   - Rebuild: `vercel --prod`

2. **Mobile app errors?**
   - Check Supabase connection
   - Verify `.env` in mobile folder
   - Check mobile logs for errors

3. **APK build fails?**
   - Use EAS Build instead: `eas build --platform android --profile preview`
   - Check Expo account is logged in
   - Verify credentials are correct

---

## 🚀 You're All Set!

Your complete system:
- ✅ Dashboard deployed on Vercel
- ✅ Mobile app APK built
- ✅ Supabase database configured
- ✅ Everything synced and working!

**Start using your system now!** 🎉


