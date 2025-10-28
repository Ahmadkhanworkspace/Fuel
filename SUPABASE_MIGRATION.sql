-- Complete ASMS Database Migration
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (in correct order for foreign keys)
DROP TABLE IF EXISTS location_logs CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS zones CASCADE;

-- Create zones table
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  center_lat FLOAT,
  center_lng FLOAT,
  radius_km FLOAT,
  geojson JSONB,
  active BOOLEAN DEFAULT TRUE,
  vehicle_count INTEGER DEFAULT 0,
  violation_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('employee', 'approver', 'admin')) DEFAULT 'employee',
  zone_id UUID REFERENCES zones(id),
  allowed_quota_liters FLOAT DEFAULT 100,
  is_banned BOOLEAN DEFAULT FALSE,
  allowed_zones TEXT[] DEFAULT '{}',
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
  pump_id TEXT,
  liters_claimed FLOAT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  odometer_reading INTEGER,
  gps_lat FLOAT,
  gps_lng FLOAT,
  photos TEXT[],
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
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('receipt', 'odometer', 'pump', 'other')),
  file_url TEXT NOT NULL,
  checksum TEXT,
  phash TEXT,
  exif_timestamp TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
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
  is_within_zone BOOLEAN DEFAULT FALSE,
  zone_id UUID REFERENCES zones(id),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_employees_zone ON employees(zone_id);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_vehicles_employee ON vehicles(assigned_employee_id);
CREATE INDEX idx_claims_employee ON claims(employee_id);
CREATE INDEX idx_claims_vehicle ON claims(vehicle_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_created ON claims(created_at);
CREATE INDEX idx_images_claim ON images(claim_id);
CREATE INDEX idx_location_claim ON location_logs(claim_id);
CREATE INDEX idx_location_employee ON location_logs(employee_id);
CREATE INDEX idx_location_zone ON location_logs(zone_id);
CREATE INDEX idx_zones_active ON zones(active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (demo mode - open for all)
CREATE POLICY "Enable all access for authenticated users" ON employees
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON vehicles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON claims
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON zones
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON images
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON location_logs
  FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data
INSERT INTO zones (name, center_lat, center_lng, radius_km, active) VALUES
  ('Bahawalpur Central Zone', 29.4000, 71.6833, 5, TRUE),
  ('Karachi Zone', 24.8607, 67.0011, 8, TRUE),
  ('Lahore Zone', 31.5204, 74.3587, 10, FALSE);

-- Insert sample employees
INSERT INTO employees (employee_code, name, email, phone, role, allowed_quota_liters) VALUES
  ('EMP001', 'Rajesh Kumar', 'rajesh@ashrafsugar.com', '+92-300-1234567', 'employee', 150),
  ('EMP002', 'Priya Sharma', 'priya@ashrafsugar.com', '+92-300-2345678', 'employee', 120),
  ('EMP003', 'Amit Patel', 'amit@ashrafsugar.com', '+92-300-3456789', 'employee', 100),
  ('ADMIN001', 'Admin User', 'admin@ashrafsugar.com', '+92-300-1111111', 'admin', 0),
  ('APR001', 'Approver One', 'approver@ashrafsugar.com', '+92-300-2222222', 'approver', 0);

-- Insert sample vehicles
INSERT INTO vehicles (reg_no, model, avg_mileage, last_odometer, next_service_km) VALUES
  ('UP32AB1234', 'Toyota Innova', 12.5, 45230, 50000),
  ('HR26DK4567', 'Maruti Swift', 18.2, 32150, 36000),
  ('DL01CA7890', 'Honda City', 15.8, 28900, 35000);

-- Success message
SELECT 'Database migration completed successfully!' as status;

