-- Update zones table schema to match UI requirements
ALTER TABLE zones ADD COLUMN IF NOT EXISTS center_lat FLOAT;
ALTER TABLE zones ADD COLUMN IF NOT EXISTS center_lng FLOAT;
ALTER TABLE zones ADD COLUMN IF NOT EXISTS radius_km FLOAT;
ALTER TABLE zones ADD COLUMN IF NOT EXISTS vehicle_count INTEGER DEFAULT 0;
ALTER TABLE zones ADD COLUMN IF NOT EXISTS violation_count INTEGER DEFAULT 0;

-- Create zones table if it doesn't exist with full schema
CREATE TABLE IF NOT EXISTS zones (
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

-- Enable Row Level Security
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read zones
CREATE POLICY "Allow authenticated users to read zones" ON zones
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow admins to manage zones
CREATE POLICY "Allow admins to manage zones" ON zones
  FOR ALL USING (auth.role() = 'authenticated');

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

