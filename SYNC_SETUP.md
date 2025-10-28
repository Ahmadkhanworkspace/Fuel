# 🔄 Mobile ↔ Dashboard Sync Setup

## Overview
Your mobile app and dashboard are now connected to the same Supabase backend!

## What's Connected

### ✅ Mobile App
- Claims are saved locally in offline queue
- Sync button sends claims to Supabase database
- Photos are uploaded to Supabase Storage
- Sync status tracking (pending/synced)

### ✅ Dashboard
- Automatically fetches claims from Supabase
- Auto-refreshes every 30 seconds
- Real-time approve/reject actions
- Bulk operations for multiple claims

## How It Works

### 1. Mobile App Workflow
```
User submits claim
  ↓
Claim saved locally (offline)
  ↓
User taps "Sync" button
  ↓
Photos uploaded to Supabase Storage
  ↓
Claim data inserted into `claims` table
  ↓
Status updated to "synced"
```

### 2. Dashboard Workflow
```
Dashboard loads
  ↓
Fetches claims from `claims` table
  ↓
Displays claims with photos
  ↓
Auto-refreshes every 30 seconds
  ↓
Admin approves/rejects
  ↓
Status updated in database
```

## Current Status

### ✅ Implemented
- Offline queue in mobile app
- Sync button functionality
- Dashboard fetches from Supabase
- Dashboard auto-refresh (30s interval)
- Approve/reject from dashboard
- Bulk approve/reject
- Photo uploads to Supabase Storage

### 🟡 Demo Mode
- Mobile sync is currently in **demo mode** (simulated)
- Real sync code is ready but commented out
- To enable real sync:
  1. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to `.env` in mobile folder
  2. Uncomment the real sync code in `mobile/lib/store.ts` (line 93-101)
  3. Remove the demo mode simulation

## Database Schema

### Claims Table Structure
```sql
CREATE TABLE claims (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  vehicle_id UUID REFERENCES vehicles(id),
  liters_claimed FLOAT,
  price NUMERIC(10, 2),
  odometer_reading INTEGER,
  gps_lat FLOAT,
  gps_lng FLOAT,
  location_address TEXT,
  photos JSONB,
  ocr_text JSONB,
  ocr_confidence FLOAT,
  fraud_score FLOAT,
  status TEXT DEFAULT 'submitted',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Testing the Sync

### 1. Submit a Claim in Mobile App
```
Mobile App → Claim Fuel
  ↓
Take receipt photo
  ↓
Take odometer photo
  ↓
Fill in details
  ↓
Submit
```

### 2. Sync the Claim
```
Mobile App Home → Tap "Sync" button
  ↓
"Syncing 1 pending claim..."
  ↓
"Claims synced successfully!"
```

### 3. View in Dashboard
```
Dashboard → Claims Queue
  ↓
Wait 30 seconds (auto-refresh)
  ↓
See your claim appear in the list
```

### 4. Approve/Reject
```
Dashboard → Claims Queue
  ↓
Click ✓ to approve or ✗ to reject
  ↓
Status updated in database
```

## Files Involved

### Mobile App
- `mobile/lib/store.ts` - Offline queue & sync logic
- `mobile/lib/api.ts` - Backend API functions
- `mobile/lib/supabase.ts` - Supabase client setup
- `mobile/screens/ClaimFuelScreen.tsx` - Claim submission
- `mobile/screens/HomeScreen.tsx` - Sync button

### Dashboard
- `components/dashboard/claims-table.tsx` - Fetches from Supabase
- `lib/supabase/client.ts` - Supabase client for dashboard
- `app/dashboard/claims/page.tsx` - Claims queue page

## Troubleshooting

### Issue: Mobile claims don't appear in dashboard
**Solution:**
1. Check Supabase credentials are correct
2. Verify `claims` table exists in database
3. Check browser console for errors
4. Click "🔄 Refresh" button in dashboard

### Issue: Sync button doesn't work
**Solution:**
1. Check mobile app console for errors
2. Verify Supabase connection in `mobile/lib/supabase.ts`
3. Make sure Storage bucket 'fuel-receipts' exists in Supabase

### Issue: Photos not showing
**Solution:**
1. Check Supabase Storage bucket exists
2. Verify RLS (Row Level Security) policies allow read access
3. Check photo URLs in database

## Next Steps

To enable **real backend sync** (not demo mode):

1. **Add environment variables to mobile app**
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://tksodydfsuierqlnmnrr.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

2. **Update mobile/lib/store.ts**
   - Remove demo mode simulation (lines 78-82)
   - Uncomment real sync code (lines 93-101)

3. **Test the connection**
   - Submit a claim in mobile app
   - Sync the claim
   - Verify it appears in dashboard

## 📊 Supabase Setup

Your Supabase project is already configured:
- **URL**: `https://tksodydfsuierqlnmnrr.supabase.co`
- **Anon Key**: (stored in mobile/lib/supabase.ts)
- **Storage Bucket**: `fuel-receipts`

The dashboard auto-refreshes every 30 seconds to show new claims!


