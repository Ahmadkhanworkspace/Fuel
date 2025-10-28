# 🚀 Quick Start Guide - SVFMS Dashboard

## Prerequisites

1. **Install Node.js** (v18+)
   - Download from https://nodejs.org/
   - Or use package manager: `winget install OpenJS.NodeJS.LTS`

2. **Create Supabase Account**
   - Sign up at https://supabase.com (free tier available)
   - Create a new project
   - Note your project URL and API keys

## Setup Steps

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14
- React & TypeScript
- Tailwind CSS
- Supabase
- shadcn/ui components
- Lucide icons

### Step 2: Configure Environment

Create `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Optional (for future features)
GOOGLE_VISION_API_KEY=your-google-vision-key
MAPBOX_API_KEY=your-mapbox-key
```

### Step 3: Set Up Database

Go to your Supabase project → SQL Editor and run:

```sql
-- Create employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('employee', 'approver', 'admin')),
  zone_id UUID,
  allowed_quota_liters FLOAT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_no TEXT UNIQUE NOT NULL,
  model TEXT,
  assigned_employee_id UUID REFERENCES employees(id),
  avg_mileage FLOAT,
  last_odometer INTEGER,
  next_service_km INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create claims table
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  liters_claimed FLOAT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  odometer_reading INTEGER,
  gps_lat FLOAT,
  gps_lng FLOAT,
  photos JSONB,
  ocr_text JSONB,
  ocr_confidence FLOAT,
  fraud_score FLOAT,
  status TEXT NOT NULL CHECK (status IN ('submitted', 'pending', 'approved', 'rejected')),
  approver_id UUID REFERENCES employees(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create zones table
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  geojson JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create location_logs table
CREATE TABLE location_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id),
  employee_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  address TEXT,
  is_within_zone BOOLEAN DEFAULT false,
  zone_id UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Employees can view own data" ON employees
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Employees can view own claims" ON claims
  FOR SELECT USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Approvers can view all claims" ON claims
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE employees.id::text = auth.uid()::text 
      AND employees.role IN ('approver', 'admin')
    )
  );

-- Insert sample data
INSERT INTO employees (employee_code, name, email, role) VALUES
  ('EMP001', 'Admin User', 'admin@svfms.com', 'admin'),
  ('EMP002', 'Approver User', 'approver@svfms.com', 'approver'),
  ('EMP003', 'Regular Employee', 'employee@svfms.com', 'employee');

INSERT INTO vehicles (reg_no, model) VALUES
  ('MH-12-AB-3456', 'Toyota Innova'),
  ('MH-12-CD-7890', 'Mahindra Bolero'),
  ('MH-12-EF-1234', 'Maruti Swift');
```

### Step 4: Set Up Authentication

1. Go to Supabase Dashboard → Authentication → Settings
2. Enable Email provider
3. Create a user for admin@svfms.com

### Step 5: Run the Development Server

```bash
npm run dev
```

### Step 6: Open in Browser

Visit: http://localhost:3000

Login with: admin@svfms.com (password you set)

## Features Available

### ✅ **Dashboard Overview**
- Real-time statistics
- KPI cards with gradients
- Zone violation alerts
- Quick action buttons

### ✅ **Claims Queue**
- View all fuel claims
- Filter by status and risk score
- Approve/reject claims
- Search functionality
- Export to CSV

### ✅ **Location Logs**
- Track GPS coordinates
- Zone compliance monitoring
- Violation detection
- Historical data

### ✅ **Role Management**
- Admin-only access
- User role assignment
- Permission matrix view
- Employee management

### ✅ **Zone Restrictions**
- Automatic validation
- Real-time checking
- Violation logging
- Historical tracking

## Premium UI Features

- **Gradient backgrounds** on cards
- **Shadow effects** for depth
- **Smooth animations** on hover
- **Modern color scheme** (blue to purple gradients)
- **Responsive design** for all devices
- **Icons** from Lucide React

## Zone Restrictions

The system automatically:
1. Tracks GPS coordinates when claims are submitted
2. Validates against assigned zones
3. Logs violations
4. Flags claims outside allowed zones

See: `/dashboard/location-logs` for details

## Roles & Permissions

- **Employee**: Can submit claims, view own data
- **Approver**: Can approve/reject claims, view location logs
- **Admin**: Full access including user management and zones

## Troubleshooting

### Issue: "npm not found"
**Solution**: Install Node.js from https://nodejs.org/

### Issue: "Module not found"
**Solution**: Run `npm install` again

### Issue: Can't connect to Supabase
**Solution**: Check `.env.local` file exists and has correct keys

### Issue: "Table does not exist"
**Solution**: Run SQL migrations from Step 3

## Next Steps

1. Set up mobile app (React Native)
2. Implement OCR for receipts
3. Add fraud detection algorithms
4. Configure push notifications
5. Deploy to Vercel

## Support

- **Documentation**: See `IMPLEMENTATION.md`
- **Project Outline**: See `project outline.txt`
- **Database Schema**: See SQL above

## Deployment to Vercel

1. Push code to GitHub
2. Import in Vercel (https://vercel.com)
3. Add environment variables
4. Deploy automatically

Enjoy your premium vehicle management system! 🚗

