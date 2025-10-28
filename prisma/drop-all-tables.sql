-- Drop all tables to clear existing structure
DROP TABLE IF EXISTS location_logs CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS zones CASCADE;

-- Drop all triggers
DROP TRIGGER IF EXISTS update_zones_updated_at ON zones;
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
DROP TRIGGER IF EXISTS update_claims_updated_at ON claims;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

SELECT 'All tables and policies dropped successfully! Now run prisma db push --accept-data-loss' as status;

