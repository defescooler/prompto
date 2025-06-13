-- PostgreSQL initialization script for Prompt Copilot
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create additional indexes for better performance
-- (These will be created by SQLAlchemy, but we can add custom ones here)

-- Grant additional permissions if needed
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO prompt_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO prompt_user;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Prompt Copilot database initialized successfully!';
END $$; 