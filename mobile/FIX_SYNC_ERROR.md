# 🔧 Fix Android Studio Sync Error

## ⚠️ The Error
"Unresolved reference: servicese" during Gradle sync

---

## ✅ SOLUTION 1: Invalidate Caches (Recommended)

1. Open Android Studio
2. Go to: **File → Invalidate Caches...**
3. Check **ALL boxes**:
   - ☑️ Clear file system cache and Local History
   - ☑️ Clear downloaded shared indexes
   - ☑️ Clear VCS Log caches and indexes
4. Click **"Invalidate and Restart"**
5. Wait for Android Studio to restart
6. Click **"Sync Project with Gradle Files"**

**This fixes 90% of sync errors!** ✨

---

## ✅ SOLUTION 2: Clean Build

In Android Studio Terminal:

```bash
cd android
./gradlew clean
```

Then:
1. **Build → Clean Project**
2. **Build → Rebuild Project**
3. **File → Sync Project with Gradle Files**

---

## ✅ SOLUTION 3: Delete Build Folders

Close Android Studio, then delete:
- `mobile/android/.gradle/`
- `mobile/android/build/`
- `mobile/android/app/build/`

Reopen Android Studio and sync again.

---

## 🎯 After Syncing Successfully

Once sync works:
1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Find APK in: `app/build/outputs/apk/debug/app-debug.apk`

---

**Try Solution 1 first - it's the fastest!** 🚀

