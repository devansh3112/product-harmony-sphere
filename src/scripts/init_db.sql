-- Set up error handling
DO $$ 
BEGIN

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (careful with this in production!)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create categories table first (since products depend on it)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  use_cases TEXT[] DEFAULT ARRAY[]::TEXT[],
  clients TEXT[] DEFAULT ARRAY[]::TEXT[],
  competition TEXT[] DEFAULT ARRAY[]::TEXT[],
  domain TEXT,
  parent_tech TEXT,
  subscription_type TEXT,
  whitepaper_links TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_category FOREIGN KEY (category) REFERENCES categories(name) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_role CHECK (role IN ('admin', 'internal', 'external'))
);

-- Insert basic categories
INSERT INTO categories (name, description) VALUES
('Cybersecurity', 'Security solutions and services'),
('Cloud', 'Cloud computing and services'),
('Networking', 'Network infrastructure and solutions'),
('Software', 'Enterprise software applications')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, category, short_description) VALUES
('VMware vSphere', 'Software', 'Enterprise virtualization platform'),
('Cisco Meraki', 'Networking', 'Cloud-managed networking'),
('Palo Alto Networks', 'Cybersecurity', 'Next-gen security platform'),
('AWS Services', 'Cloud', 'Cloud computing platform')
ON CONFLICT DO NOTHING;

-- Insert initial admin user
INSERT INTO user_profiles (email, name, role) VALUES
('admin@example.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for authenticated users" ON user_profiles FOR SELECT USING (auth.role() = 'authenticated');

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'An error occurred: %', SQLERRM;
    ROLLBACK;
END $$; 