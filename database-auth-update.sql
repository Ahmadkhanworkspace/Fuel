-- Add authentication fields to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Operations';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS password_reset_token TEXT UNIQUE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMPTZ;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_employees_username ON employees(username);

-- Success message
SELECT 'Authentication fields added successfully!' as status;

