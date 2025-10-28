-- SVFMS Database Setup
-- Run this in Supabase SQL Editor

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
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
CREATE TABLE IF NOT EXISTS vehicles (
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
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  pump_id UUID,
  liters_claimed FLOAT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  odometer_reading INTEGER,
  gps_lat FLOAT,
  gps_lng FLOAT,
  photos JSONB,
  ocr_text JSONB,
  ocr_confidence FLOAT,
  fraud_score FLOAT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('submitted', 'pending', 'approved', 'rejected')),
  approver_id UUID REFERENCES employees(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('receipt', 'odometer', 'pump', 'other')),
  file_url TEXT NOT NULL,
  checksum TEXT,
  phash TEXT,
  exif_timestamp TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create zones table
CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  geojson JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create location_logs table
CREATE TABLE IF NOT EXISTS location_logs (
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

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  performed_by UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Employees can view own data
CREATE POLICY "Employees can view own data" ON employees
  FOR SELECT USING (auth.uid()::text = id::text);

-- Approvers can view all employees
CREATE POLICY "Approvers can view all employees" ON employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE employees.id::text = auth.uid()::text 
      AND employees.role IN ('approver', 'admin')
    )
  );

-- Employees can view own claims
CREATE POLICY "Employees can view own claims" ON claims
  FOR SELECT USING (auth.uid()::text = employee_id::text);

-- Approvers can view all claims
CREATE POLICY "Approvers can view all claims" ON claims
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE employees.id::text = auth.uid()::text 
      AND employees.role IN ('approver', 'admin')
    )
  );

-- Employees can insert claims
CREATE POLICY "Employees can insert claims" ON claims
  FOR INSERT WITH CHECK (auth.uid()::text = employee_id::text);

-- All can view vehicles
CREATE POLICY "All can view vehicles" ON vehicles
  FOR SELECT USING (true);

-- All can view zones
CREATE POLICY "All can view zones" ON zones
  FOR SELECT USING (active = true);

-- Insert sample data
INSERT INTO employees (employee_code, name, email, role) VALUES
  ('EMP001', 'Admin User', 'admin@svfms.com', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO employees (employee_code, name, email, role) VALUES
  ('EMP002', 'Approver User', 'approver@svfms.com', 'approver')
ON CONFLICT (email) DO NOTHING;

INSERT INTO employees (employee_code, name, email, role) VALUES
  ('EMP003', 'Regular Employee', 'employee@svfms.com', 'employee')
ON CONFLICT (email) DO NOTHING;

INSERT INTO vehicles (reg_no, model) VALUES
  ('MH-12-AB-3456', 'Toyota Innova')
ON CONFLICT (reg_no) DO NOTHING;

INSERT INTO vehicles (reg_no, model) VALUES
  ('MH-12-CD-7890', 'Mahindra Bolero')
ON CONFLICT (reg_no) DO NOTHING;

INSERT INTO vehicles (reg_no, model) VALUES
  ('MH-12-EF-1234', 'Maruti Swift')
ON CONFLICT (reg_no) DO NOTHING;

-- Create a test zone
INSERT INTO zones (name, geojson) VALUES
  ('Mumbai Central Zone', 
   '{"type": "circle", "center": [72.8777, 19.0760], "radius": 5000}'
  )
ON CONFLICT DO NOTHING;

