# 📱 Build APK for Mobile App

## ✅ EASIEST WAY: EAS Build (Recommended)

### Step 1: Login to Expo
```bash
cd mobile
eas login
```
Create free account at: https://expo.dev

### Step 2: Build APK
```bash
eas build --platform android --profile preview
```

This creates the APK in the cloud (takes 5-10 minutes).

### Step 3: Download
You'll get a download link in your terminal.

---

## 🚀 QUICK START (Right Now)

### Option 1: Build Locally (Fastest)

If you have Android Studio installed:

```bash
cd mobile
npx expo run:android
```

This builds and installs on connected device.

### Option 2: Generate APK without Android Studio

```bash
cd mobile
npx expo prebuild --clean
```

Then in Android Studio:
1. Open android folder
2. Build → Generate Signed Bundle/APK
3. Select APK
4. Follow wizard

---

## 📱 SIMPLEST: Use Web Version

Since building APK takes time, you can:

1. **Access mobile app in browser**: http://localhost:8081
2. **Save as PWA**: Chrome → Install App
3. **Works like native app**!

---

## ⚡ Your Options

1. **EAS Build** (5-10 min, cloud)
2. **Local Build** (requires Android Studio)
3. **Web PWA** (instant, works now)

**Choose one!** The app code is ready, just needs to be built!

