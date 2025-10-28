# 📱 Mobile App Development Plan

## Tech Stack Decision

### ❌ Flutter vs ✅ React Native

**Why React Native?**
1. ✅ You already have a Next.js team (React knowledge transfers)
2. ✅ Supabase has excellent React Native support
3. ✅ Faster development with Expo
4. ✅ Can reuse TypeScript types from dashboard
5. ✅ Single codebase for iOS & Android

**Recommended: React Native + Expo**

---

## Project Structure

```
mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── index.tsx (home)
│   │   ├── claims/
│   │   │   ├── new.tsx
│   │   │   └── [id].tsx
│   │   ├── history.tsx
│   │   └── maintenance.tsx
│   └── _layout.tsx
├── components/
│   ├── camera/
│   ├── forms/
│   └── ui/
├── lib/
│   ├── supabase.ts
│   ├── ocr.ts
│   └── zustand-store.ts (offline queue)
└── package.json
```

---

## Core Features to Build

### 1. Authentication ✅ (Easy)
- Login with Supabase Auth
- Auto-login on app open
- Logout

### 2. Home Screen ✅ (Easy)
- Remaining quota (Liters & PKR)
- Quick action: "Claim Fuel"
- Recent claims status
- Vehicle info

### 3. Fuel Claim Flow ⚠️ (Medium)
- Vehicle selection
- Camera capture (2-3 photos)
- GPS auto-capture
- Odometer entry
- OCR preview with corrections
- Submit with offline fallback

### 4. Camera Integration ⚠️ (Medium)
- Force camera (no gallery)
- Multiple photo capture
- Photo preview before submit
- Overlay with GPS & timestamp
- Optional: Nonce overlay

### 5. Offline Queue 🔴 (Complex)
- Store claims in local SQLite/Zustand
- Auto-sync when online
- Show sync status
- Retry failed uploads

### 6. History Screen ✅ (Easy)
- List of all claims
- Filter by status
- View claim details
- Download receipts

---

## Development Timeline

### Week 1: Foundation
- Day 1-2: Setup Expo + Supabase
- Day 3: Login screen
- Day 4: Home dashboard
- Day 5-6: Camera integration

### Week 2: Core Features
- Day 1-2: Fuel claim form
- Day 3: GPS tracking
- Day 4: OCR integration
- Day 5-6: Offline queue

### Week 3: Polish
- Day 1-2: History & details
- Day 3: Maintenance module
- Day 4: Notifications
- Day 5-6: Testing & bug fixes

### Week 4: Deployment
- Day 1-3: Testing on real devices
- Day 4-5: Build & deploy
- Day 6: Documentation

---

## Required Libraries

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-camera": "^14.0.0",
    "expo-location": "^16.0.0",
    "expo-image-picker": "^14.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "zustand": "^4.0.0",
    "react-native-gesture-handler": "^2.0.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/stack": "^6.0.0"
  }
}
```

---

## Key Challenges to Solve

1. **Camera Quality** - Ensure good photos for OCR
2. **GPS Accuracy** - Handle indoor/weak GPS
3. **Offline Sync** - Queue management & conflicts
4. **Image Upload** - Large file sizes on slow networks
5. **Battery Usage** - Optimize for all-day use

---

## Next: Should I Start Building?

I can start with:
1. ✅ Expo project setup
2. ✅ Login screen
3. ✅ Supabase integration
4. ✅ Home dashboard
5. ✅ Camera basics

Ready to begin? 🚀

