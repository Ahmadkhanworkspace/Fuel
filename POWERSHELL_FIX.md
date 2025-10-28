# ⚠️ PowerShell PATH Issue - Quick Fix

## Why Commands Didn't Work

Each PowerShell command I run starts a **NEW shell session**, so the PATH variable isn't preserved between commands.

## ✅ Permanent Fix

### Option 1: Restart PowerShell (Recommended)
1. **Close ALL PowerShell windows**
2. **Open a NEW PowerShell window**
3. Now npm commands will work!

### Option 2: Use CMD Instead
1. Press **Win + R**
2. Type: `cmd`
3. Navigate to: `cd "d:\ASML Vehicle Management system"`
4. Run: `npm run dev`

### Option 3: Refresh PATH Manually

In PowerShell, run:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Then try:
```powershell
npm --version
npm run dev
```

---

## 🚀 EASIEST Solution Right Now:

### **Just double-click `start-server.bat`!**

The batch file handles everything automatically and will:
1. Find Node.js
2. Install dependencies
3. Start the server
4. Show you the URL

---

## 📋 Alternative: Manual Steps

If you prefer to run it manually:

1. **Close current PowerShell**
2. **Open Command Prompt** (not PowerShell):
   - Press Win + R
   - Type: `cmd`
   - Press Enter
3. Navigate:
   ```cmd
   cd "d:\ASML Vehicle Management system"
   ```
4. Run:
   ```cmd
   npm run dev
   ```

---

## 🎯 Why This Happens

When Node.js was installed, the installer added it to the system PATH. But:
- Existing PowerShell sessions don't see it
- You need a **NEW** PowerShell or CMD window
- Or use the batch file (easiest!)

---

## ✅ QUICK FIX: Just Use CMD!

Command Prompt works better because it doesn't have PowerShell's execution policies.

