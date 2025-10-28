# 🔧 Mobile App Loading Issue - Fix

## ⚠️ Issue: App Keeps Loading

This usually means the Expo server isn't connected properly.

### ✅ Quick Fix

**Double-click**: `start-mobile-simple.bat`

This uses port 8082 to avoid conflicts.

---

## 🔄 Try These Steps

### Step 1: Kill Previous Servers
```bash
# In PowerShell or CMD
taskkill /F /IM node.exe
```

### Step 2: Restart Server
```bash
cd mobile
npm start -- --port 8082
```

### Step 3: Refresh on Phone
- In Expo Go app, press **R** to reload
- Or shake phone and tap "Reload"

---

## 📱 Alternative: Use Tunnel Mode

If WiFi doesn't work:

1. Start server: `npm start`
2. Press **t** for tunnel mode
3. Scan new QR code
4. This uses internet (slower but more reliable)

---

## 🌐 Or Use Web Version

If mobile keeps loading, test in browser:

1. Start server: `npm start`
2. Press **w** for web
3. Opens in browser automatically
4. Test all features there

---

## ✅ Current Status

The server is starting on **port 8082**.

Wait for QR code, then:
1. Open Expo Go
2. Scan QR code
3. Should load now!

If still loading:
- Close Expo Go app completely
- Clear cache: Shake phone → "Reload"
- Try tunnel mode (press **t**)

---

## 🎯 What to Check

### In Terminal:
- Does it show "Connected to Expo"?
- Any error messages?

### On Phone:
- Is Expo Go connected? (green dot)
- Any error messages?

### Network:
- Same WiFi as computer?
- Firewall blocking connection?

---

## 🔥 Nuclear Option

If nothing works:

```bash
cd mobile
rmdir /s /q node_modules
rmdir /s /q .expo
npm install
npm start -- --reset-cache
```

Then scan QR code again.

---

**Try the batch file first!** It should work now on port 8082. 📱

