# 🎯 Complete Setup Instructions - Supabase, Vercel & Android APK

## ⚡ Quick Summary

You have 3 main tasks:
1. ✅ **Supabase** - Database & Storage setup
2. ✅ **Vercel** - Dashboard deployment  
3. ✅ **EAS Build** - Android APK build

---

## 📋 DETAILED INSTRUCTIONS

### 🗄️ TASK 1: Supabase Setup (5 minutes)

**Step 1.1: Run Database Setup**
1. Open: https://supabase.com/dashboard/project/tksodydfsuierqlnmnrr
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Open file: `database-setup.sql`
5. Copy ALL content (Ctrl+A, Ctrl+C)
6. Paste in Supabase SQL editor
7. Click **RUN** button
8. Wait for "Success" message ✅

**Step 1.2: Create Storage Bucket**
1. Still in Supabase dashboard
2. Click **Storage** in left sidebar
3. Click **New Bucket** button
4. Enter:
   - **Name**: `fuel-receipts`
   - **Public bucket**: ✅ Check this box (make it public)
5. Click **Create bucket**
6. Done! ✅

**Result**: Your database is ready with all tables!

---

### 🌐 TASK 2: Deploy Dashboard to Vercel (10 minutes)

**Step 2.1: Create Vercel Account**
1. Go to: https://vercel.com
2. Click **Sign Up** (use GitHub if possible)
3. Login to your account

**Step 2.2: Deploy Project**
1. In Vercel dashboard, click **Add New Project**
2. Choose option:
   - **Option A**: Import Git repository (recommended)
     - Connect your GitHub account
     - Select this repository
     - Click **Import**
   - **Option B**: Deploy manually
     - Click **Browse** → Select your project folder
     - Click **Deploy**

**Step 2.3: Configure Environment Variables**
1. After deployment starts, go to **Settings**
2. Click **Environment Variables**
3. Add these TWO variables:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://tksodydfsuierqlnmnrr.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrc29keWRmc3VpZXJxbG5tbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTI3MDEsImV4cCI6MjA3NzEyODcwMX0.YrUr28nJUB6istkCwh_p-qpX_ITVafEWCDbo01I9Zx0
```

4. Click **Save** for each variable

**Step 2.4: Redeploy**
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete (2-3 minutes)
5. Copy your live URL (e.g., `https://your-project.vercel.app`)

**Result**: Your dashboard is now live on Vercel! 🎉

---

### 📱 TASK 3: Build Android APK (15 minutes)

**Method: EAS Build (Cloud - Recommended)**

**Step 3.1: Install EAS CLI**
```bash
# Open Command Prompt or PowerShell in project root
npm install -g eas-cli
```

**Step 3.2: Login to Expo**
```bash
eas login
# Create Expo account if you don't have one (it's free)
```

**Step 3.3: Build APK**
```bash
# Navigate to mobile folder
cd mobile

# Build APK (cloud build)
eas build --platform android --profile preview

# This will take 10-15 minutes
# You'll get prompts in terminal
# Follow instructions
```

**Step 3.4: Download & Install APK**
1. Wait for build to complete
2. Check your email for download link
3. Or check terminal for download link
4. Download APK to your Android phone
5. Enable "Install from Unknown Sources" in phone settings
6. Install APK
7. Launch the app!

**Result**: Your mobile app APK is ready to install! 📱

---

## 🧪 TASK 4: Test Everything

### Test Dashboard
1. Go to your Vercel URL
2. Login page appears
3. Click **Login** (demo mode - any credentials work)
4. Dashboard loads
5. Navigate through all pages:
   - Claims Queue
   - Employees (with Ban/Unban)
   - Vehicles
   - Location Logs
   - Analytics
   - Settings
   - Zones
   - Maintenance

### Test Mobile App
1. Open app on your phone
2. Sign in (demo mode)
3. Go to **Claim Fuel**
4. Take a receipt photo
5. Take an odometer photo
6. Fill in fuel details
7. Submit claim
8. Tap **Sync** button
9. Check dashboard for the claim
10. Approve claim from dashboard
11. Check status updates in mobile app

---

## ✅ Final Checklist

- [ ] Supabase database setup complete
- [ ] Storage bucket `fuel-receipts` created
- [ ] Vercel deployment successful
- [ ] Environment variables added
- [ ] Dashboard accessible at Vercel URL
- [ ] Android APK built
- [ ] APK installed on phone
- [ ] Mobile app connects to Supabase
- [ ] Dashboard shows claims from mobile app
- [ ] Sync works correctly
- [ ] Ban/Unban functionality works
- [ ] Zone restrictions work

---

## 🚨 Troubleshooting

### Dashboard Shows 404 Error
- **Fix**: Check environment variables in Vercel dashboard are correct
- Rebuild: Go to Vercel → Deployments → Redeploy

### Mobile App Can't Login
- **Fix**: Demo mode should work without authentication
- Check `.env` file in mobile folder exists

### APK Build Fails
- **Fix**: Make sure you're logged in: `eas login`
- Try again: `eas build --platform android --profile preview`

### Claims Not Syncing
- **Fix**: 
  1. Check Supabase database is set up
  2. Verify Storage bucket exists
  3. Check mobile app logs for errors

---

## 🎉 Success Indicators

✅ Dashboard loads on Vercel
✅ Can login and see all pages
✅ Mobile app installs and runs
✅ Can submit fuel claims from mobile
✅ Dashboard shows claims from mobile
✅ Photos upload successfully
✅ OCR data is captured
✅ GPS coordinates are saved
✅ Approve/Reject works
✅ Employee management works
✅ Ban/Unban works
✅ Zone restrictions work

---

## 📞 Quick Command Reference

```bash
# Deploy to Vercel (in project root)
vercel --prod

# Build Android APK (in mobile folder)
cd mobile
eas build --platform android --profile preview

# Start local dashboard
npm run dev

# Start mobile dev server
cd mobile
npm start
```

---

## 🎯 Next Steps After Setup

1. ✅ Test all features
2. ✅ Add real employee data
3. ✅ Configure zones
4. ✅ Set fraud detection thresholds
5. ✅ Customize branding
6. ✅ Go live with production deployment!

---

## 💡 Tips

- **Use `deploy-to-vercel.bat`** for easy Vercel deployment
- **Use `build-apk.bat`** for easy APK building
- **Keep Supabase dashboard open** during setup to check tables
- **Check Vercel logs** if deployment fails
- **Use Expo Go app** for quick mobile testing during development

---

## 🌟 You're All Set!

Your complete ASMS Vehicle Management System is now:
- ✅ Deployed on Vercel
- ✅ Connected to Supabase
- ✅ Mobile app APK ready
- ✅ Production-ready!

**Start using your system and manage your vehicle fleet!** 🚗⛽📱


