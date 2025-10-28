-- Complete Database Migration for ASMS
-- Run this ENTIRE script in Supabase SQL Editor

-- First, drop all policies
DROP POLICY IF EXISTS "Allow authenticated users to read employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to read vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated users to read claims" ON claims;
DROP POLICY IF EXISTS "Allow authenticated users to read zones" ON zones;
DROP POLICY IF EXISTS "Allow authenticated users to read images" ON images;
DROP POLICY IF EXISTS "Allow authenticated users to read location_logs" ON location_logs;
DROP POLICY IF EXISTS "Employees can view own claims" ON claims;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON employees;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON claims;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON zones;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON images;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON location_logs;

-- Drop all triggers and functions
DROP TRIGGER IF EXISTS update_zones_updated_at ON zones;
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
DROP TRIGGER IF EXISTS update_claims_updated_at ON claims;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop all tables in correct order (to respect foreign key constraints)
DROP TABLE IF EXISTS location_logs CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS zones CASCADE;

SELECT 'All tables and policies dropped successfully! Now run: npx prisma db push --accept-data-loss' as status;

