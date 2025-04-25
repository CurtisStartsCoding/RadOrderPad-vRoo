-- Create trial_users table in radorder_main database
-- This table stores information about trial users who are testing the dictation-validation workflow
-- without full registration or PHI involvement

CREATE TABLE IF NOT EXISTS trial_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  specialty TEXT,
  validation_count INTEGER NOT NULL DEFAULT 0,
  max_validations INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  last_validation_at TIMESTAMP NULL
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_trial_users_email ON trial_users(email);

-- Add comment to table
COMMENT ON TABLE trial_users IS 'Stores information about trial users who are testing the dictation-validation workflow without full registration or PHI involvement';

-- Add comments to columns
COMMENT ON COLUMN trial_users.id IS 'Primary key for the trial user';
COMMENT ON COLUMN trial_users.email IS 'Trial user email address (used for login)';
COMMENT ON COLUMN trial_users.password_hash IS 'Bcrypt hash of the trial user password';
COMMENT ON COLUMN trial_users.first_name IS 'Trial user first name';
COMMENT ON COLUMN trial_users.last_name IS 'Trial user last name';
COMMENT ON COLUMN trial_users.specialty IS 'Medical specialty (for trial physicians)';
COMMENT ON COLUMN trial_users.validation_count IS 'Number of validations performed by the trial user';
COMMENT ON COLUMN trial_users.max_validations IS 'Maximum number of validations allowed for the trial user';
COMMENT ON COLUMN trial_users.created_at IS 'Timestamp when the trial user was created';
COMMENT ON COLUMN trial_users.last_validation_at IS 'Timestamp of trial user last validation';