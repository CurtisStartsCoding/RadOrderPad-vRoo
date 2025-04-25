-- Create trial_users table in radorder_main database
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

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON trial_users TO radorder_app;
GRANT USAGE, SELECT ON SEQUENCE trial_users_id_seq TO radorder_app;