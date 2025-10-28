# 📱 Build APK in Android Studio

## ✅ Native Project Created!

The `android` folder has been generated. Now let's build the APK!

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Android Studio
1. Launch Android Studio
2. Click "Open an Existing Project"
3. Navigate to: `D:\ASML Vehicle Management system\mobile\android`
4. Click "OK"

### Step 2: Wait for Gradle Sync
- Android Studio will sync (first time takes 5-10 minutes)
- Let it download dependencies automatically
- Wait for "Gradle Build Finished" message

### Step 3: Build APK

#### Option A: Build Signed APK (For Distribution)
1. **Build** → **Generate Signed Bundle / APK**
2. Select **APK** → Click **Next**
3. Create new keystore:
   - Click **Create new...**
   - Path: `android/app/release.keystore`
   - Password: `password123` (or your own)
   - Confirm password
   - Validity: 100 years
   - Fill in name, organization, etc.
   - Click **OK**
4. Click **Next**
5. Select **release** → Click **Finish**
6. APK will be at: `android/app/release/app-release.apk`

#### Option B: Build Debug APK (Faster for Testing)
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for "Build completed successfully"
3. Click **locate** in the notification
4. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## ✅ Install APK on Phone

### Method 1: USB Connection
1. Enable USB Debugging on phone
2. Connect phone to computer
3. Click "Run" in Android Studio
4. Select your phone
5. App installs automatically!

### Method 2: Transfer APK File
1. Copy APK to phone (USB, email, etc.)
2. On phone: Settings → Security → Enable "Unknown Sources"
3. Open file manager, tap APK file
4. Install!

---

## 🎯 Quick Tips

- **If build fails**: Click "Sync Project with Gradle Files"
- **If missing SDK**: Tools → SDK Manager → Install required SDKs
- **Faster**: Use Option B (Debug APK) - no signing needed!

---

## ⚡ Even Faster: Run Directly

Instead of building APK, run directly on connected device:

1. Connect phone via USB
2. Enable USB debugging
3. In Android Studio: Click **Run** button (green play icon)
4. App installs and runs on your phone!

**No APK file needed!** 📱

---

## 📱 What You'll Get

After building, you'll have an APK file you can:
- Install on any Android device
- Share with others
- Deploy to Google Play Store
- Install from file manager

**The app is ready to build!** 🎉

