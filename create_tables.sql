-- MS-CIT Tables for Supabase
-- Paste into Supabase Dashboard > SQL Editor > New Query

-- Users (for auth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'student')) NOT NULL DEFAULT 'student',
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trainers
CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialization TEXT,
  join_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Batches
CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Morning', 'Evening', 'Weekend')) NOT NULL,
  trainer_id TEXT REFERENCES trainers(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  capacity INTEGER DEFAULT 30,
  schedule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  join_date DATE,
  photo TEXT,
  address TEXT,
  fee_status TEXT CHECK (fee_status IN ('paid', 'pending', 'partial')) DEFAULT 'pending',
  total_fee NUMERIC DEFAULT 5000,
  paid_amount NUMERIC DEFAULT 0,
  attendance JSONB DEFAULT '{}',
  marks JSONB DEFAULT '{}',
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  batch_id TEXT REFERENCES batches(id) ON DELETE CASCADE,
  date DATE,
  total_marks INTEGER DEFAULT 100,
  passing_marks INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  method TEXT CHECK (method IN ('cash', 'card', 'cheque')) DEFAULT 'cash',
  status TEXT CHECK (status IN ('completed', 'pending')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  date DATE,
  read BOOLEAN DEFAULT false,
  type TEXT CHECK (type IN ('info', 'warning', 'error')) DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for security (disable for dev if needed)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Sample admin user (password: admin123 - hash it for production!)
INSERT INTO users (id, email, password, role, name) VALUES 
('admin-1', 'admin@mscit.com', 'admin123', 'admin', 'Admin User') ON CONFLICT DO NOTHING;

INSERT INTO trainers (id, name, email, phone, specialization, join_date) VALUES 
('trainer-admin', 'Admin Trainer', 'trainer@mscit.com', '+92-300-0000001', 'MS-CIT Coordination', CURRENT_DATE) ON CONFLICT DO NOTHING;

-- Policy for public read or admin write (adjust for production)
CREATE POLICY "Public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Public read batches" ON batches FOR SELECT USING (true);
-- Add more policies as needed
