# 📱 SVFMS Mobile App - Implementation Guide

## ✅ What's Implemented

### Framework: React Native with Expo ✅

**Why React Native over Flutter?**
- ✅ Same language as web dashboard (TypeScript)
- ✅ Shared Supabase integration
- ✅ Easy to maintain
- ✅ Large community
- ✅ Expo for rapid development

**Why Supabase over Firebase?**
- ✅ Already integrated with dashboard
- ✅ Real-time database built-in
- ✅ Better relational database
- ✅ No vendor lock-in
- ✅ Open source

### ✅ Implemented Features

#### 1. **Authentication** (`app/(auth)/login.tsx`)
- Supabase Auth integration
- Email/password login
- Secure session storage
- Auto-logout on expiry

#### 2. **Dashboard** (`app/(tabs)/dashboard.tsx`)
- Welcome screen with user info
- Quick action cards
- Navigation to all features
- Logout functionality

#### 3. **Fuel Claims** (`app/(tabs)/claims/new.tsx`)
- Camera permission requests
- Location permission requests
- Photo capture
- Odometer entry
- Liters entry
- Offline queue integration

#### 4. **Offline Support** (`lib/zustand-store.ts`)
- Zustand state management
- Offline claim queue
- Auto-sync when online
- Sync status tracking

#### 5. **Supabase Integration** (`lib/supabase.ts`)
- Client setup
- AsyncStorage for persistence
- Auto token refresh
- Real-time subscriptions ready

## 📱 App Structure

```
mobile/
├── app/
│   ├── (auth)/
│   │   └── login.tsx           # Login screen
│   └── (tabs)/
│       ├── dashboard.tsx       # Main dashboard
│       ├── claims/
│       │   ├── index.tsx       # Claims list
│       │   └── new.tsx         # New claim form
│       ├── maintenance.tsx     # Maintenance requests
│       ├── vehicles.tsx        # Vehicle info
│       └── sync.tsx            # Offline sync status
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── zustand-store.ts       # State management
├── app.json                   # Expo configuration
└── package.json               # Dependencies
```

## 🚀 To Run Mobile App

### Step 1: Install Dependencies

```bash
cd mobile
npm install
```

### Step 2: Configure Environment

Create `mobile/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Start Development

```bash
npx expo start
```

### Step 4: Run on Device

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web (testing):**
```bash
npm run web
```

## 📋 Features to Complete

### ✅ Done
- Login screen
- Dashboard screen
- Supabase integration
- Offline queue setup
- Permission requests

### 🔄 In Progress
- Camera capture implementation
- Photo upload to Supabase Storage
- OCR processing integration
- Zone validation API calls
- Location tracking
- Image pHash calculation
- Nonce overlay system

### 📝 To Do
- EXIF metadata extraction
- Odometer reading camera
- Maintenance request flow
- Vehicle information display
- Real-time claim status updates
- Push notifications
- QR code scanner for pumps

## 🎯 Key Features

### 1. **Offline Queue**
- Stores claims when offline
- Auto-retry on reconnection
- Shows pending uploads
- Batch synchronization

### 2. **GPS Tracking**
- Automatic location capture
- Zone validation
- Route tracking (future)
- Geofencing alerts

### 3. **Camera Integration**
- Force camera (no gallery)
- Triple photo capture
- Receipt, odometer, pump photos
- Image quality optimization
- Nonce overlay support

### 4. **Fraud Prevention**
- Real-time zone checking
- Photo hash comparison
- EXIF validation
- Timestamp verification
- Offline enforcement

## 🔒 Permissions Required

Android permissions in `app.json`:
- CAMERA - To capture receipt photos
- ACCESS_FINE_LOCATION - GPS tracking
- ACCESS_COARSE_LOCATION - Approximate location
- WRITE_EXTERNAL_STORAGE - Save photos temporarily
- READ_EXTERNAL_STORAGE - Access stored photos

## 🎨 UI Design

- Modern blue theme (matches dashboard)
- Card-based interface
- Large touch targets
- Clear navigation
- Loading states
- Error handling
- Offline indicators

## 📊 Database Integration

Uses same Supabase tables as web dashboard:
- `claims` - Fuel claims
- `vehicles` - Vehicle information  
- `employees` - User profiles
- `location_logs` - GPS tracking
- `images` - Photo metadata

## 🔄 Sync Strategy

1. **Online**: Direct upload to Supabase
2. **Offline**: Store in Zustand + AsyncStorage
3. **Background Sync**: Check network, upload queued items
4. **Conflict Resolution**: Server timestamp wins

## 🚀 Deployment

### Development Build
```bash
npm run android
npm run ios
```

### Production Build
```bash
eas build --platform android
eas build --platform ios
```

## 📝 Next Steps

1. Complete camera capture logic
2. Implement photo upload
3. Add OCR processing
4. Integrate zone validation
5. Add maintenance module
6. Implement push notifications
7. Add analytics tracking

## ✅ Recommendation

**Framework**: React Native ✅  
**Backend**: Supabase ✅  
**State**: Zustand ✅  
**Navigation**: Expo Router ✅  

All aligned with the existing web dashboard!

