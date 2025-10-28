-- Drop all existing policies to allow schema changes
DROP POLICY IF EXISTS "Allow authenticated users to read employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to read vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated users to read claims" ON claims;
DROP POLICY IF EXISTS "Allow authenticated users to read zones" ON zones;
DROP POLICY IF EXISTS "Allow authenticated users to read images" ON images;
DROP POLICY IF EXISTS "Allow authenticated users to read location_logs" ON location_logs;

DROP POLICY IF EXISTS "Allow all access for authenticated users" ON employees;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON claims;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON zones;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON images;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON location_logs;

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON employees;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON claims;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON zones;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON images;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON location_logs;

SELECT 'Policies dropped successfully!' as status;

