
-- Insert admin user
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, last_sign_in_at)
VALUES 
  ('admin-id', 'admin@example.com', current_timestamp, current_timestamp, current_timestamp, current_timestamp),
  ('internal-id', 'internal@westcon.com', current_timestamp, current_timestamp, current_timestamp, current_timestamp),
  ('external-id', 'external@client.com', current_timestamp, current_timestamp, current_timestamp, current_timestamp)
ON CONFLICT (id) DO NOTHING;

-- Set passwords (for development only, in production use proper auth setup)
-- Default passwords here are 'Password123' but in a real system you would use a proper auth process
INSERT INTO auth.users (id, encrypted_password)
VALUES 
  ('admin-id', '$2a$10$V0nVX5jKHnK5NPq9tM41Hu0JXhK7SVlI7KZAKk1JcJtfj4HnGS7LW'),
  ('internal-id', '$2a$10$V0nVX5jKHnK5NPq9tM41Hu0JXhK7SVlI7KZAKk1JcJtfj4HnGS7LW'),
  ('external-id', '$2a$10$V0nVX5jKHnK5NPq9tM41Hu0JXhK7SVlI7KZAKk1JcJtfj4HnGS7LW')
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password;

-- Create user profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'internal', 'external')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial users into profiles table
INSERT INTO user_profiles (email, name, role, is_active) 
VALUES 
  ('admin@example.com', 'Admin User', 'admin', true),
  ('internal@westcon.com', 'Internal User', 'internal', true),
  ('external@client.com', 'External User', 'external', true)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Set up RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow admins full access
CREATE POLICY admin_all ON user_profiles FOR ALL TO authenticated 
USING (EXISTS (
  SELECT 1 FROM user_profiles up 
  WHERE up.email = auth.jwt() ->> 'email' AND up.role = 'admin'
));

-- Allow all users to see their own profile
CREATE POLICY user_select_own ON user_profiles FOR SELECT TO authenticated 
USING (email = auth.jwt() ->> 'email');

-- Allow internal users to see all profiles
CREATE POLICY internal_select_all ON user_profiles FOR SELECT TO authenticated 
USING (EXISTS (
  SELECT 1 FROM user_profiles up 
  WHERE up.email = auth.jwt() ->> 'email' AND (up.role = 'admin' OR up.role = 'internal')
));
