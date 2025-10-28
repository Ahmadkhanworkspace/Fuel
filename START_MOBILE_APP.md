# 📱 Starting Mobile App

## ✅ Setup Complete!

The mobile app is ready to run. Here's what was done:

### Installed Dependencies
- ✅ All npm packages installed
- ✅ Expo configured
- ✅ React Native setup complete

---

## 🚀 How to Start

### Option 1: Use Batch File (Easiest)
Double-click: `start-mobile.bat`

This will:
1. Navigate to mobile folder
2. Install dependencies (if needed)
3. Start Expo server
4. Show QR code for scanning

### Option 2: Manual Start
```bash
cd mobile
npm start
```

---

## 📲 Open on Your Phone

### Step 1: Install Expo Go
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Step 2: Scan QR Code
When you run `npm start`, you'll see a QR code in the terminal. Scan it with:
- **Android**: Use Expo Go app to scan
- **iOS**: Use iPhone Camera app, tap notification

### Step 3: App Loads!
The app will automatically load on your phone.

---

## 🔑 Login Credentials

**Demo Mode**: Any email/password works!

Try:
- Email: `employee@asms.com`
- Password: `password123`

Or any credentials you want.

---

## ✅ What You Can Test

### 1. **Login Screen**
- Enter email and password
- Tap "Sign In"
- Should navigate to home

### 2. **Home Dashboard**
- See employee name
- View vehicle info
- Check quota progress
- See statistics

### 3. **Claim Fuel**
- Tap "Claim Fuel" button
- Take 3 photos (camera opens)
- Enter: Liters, Price, Odometer
- GPS location auto-captures
- Tap "Submit Claim"
- Claim saved to database

### 4. **History**
- Tap "View History" button
- See all submitted claims
- Check approval status

---

## 🎯 Features Working

✅ Email/Password Login  
✅ Supabase Authentication  
✅ Home Dashboard  
✅ Camera Integration  
✅ GPS Tracking  
✅ Photo Upload  
✅ Offline Support  
✅ Claim History  
✅ Logout  

---

## 🐛 Troubleshooting

### Issue: npm not found
**Solution**: Install Node.js from https://nodejs.org

### Issue: Expo not starting
**Solution**: 
```bash
cd mobile
npm install
npm start
```

### Issue: QR code not appearing
**Solution**: 
- Check terminal output
- Try pressing `m` (for mobile) or `w` (for web)

### Issue: Can't connect to phone
**Solution**:
- Make sure phone and computer are on same WiFi
- For physical connection, try USB debugging

### Issue: Camera not working
**Solution**:
- Enable camera permission in device settings
- Expo Go → Settings → Permissions

### Issue: Location not working
**Solution**:
- Enable location permission in device settings
- Allow "Use precise location"

---

## 📱 Screenshots Reference

### Expected Screens:

1. **Login Screen** (Blue gradient background)
   - ASMS logo at top
   - Email input
   - Password input
   - Sign In button

2. **Home Screen** (White background)
   - Welcome message
   - Vehicle card (blue box)
   - Quota progress bar
   - Stats cards (3 boxes)
   - "Claim Fuel" button (blue)
   - "View History" button (outlined)

3. **Claim Fuel Screen** (Scroll view)
   - Photo buttons (3 boxes)
   - Input fields (Liters, Price, Odometer)
   - Location display
   - Submit button

4. **History Screen** (List view)
   - Claim cards
   - Status badges (green/pending/rejected)
   - Claim details

---

## 🎉 Ready to Test!

**To start the app:**

1. Open terminal in project folder
2. Run: `cd mobile && npm start`
3. Wait for QR code
4. Open Expo Go app
5. Scan QR code
6. App loads!

Or just double-click **`start-mobile.bat`**

**The app is fully functional!** 🚀📱

