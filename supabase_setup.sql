
-- SUPABASE SETUP SCRIPT (Idempotent Version)
-- This script safely creates tables and policies. You can run it multiple times.

-- 1. Create Tables (if they don't exist)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title_de TEXT NOT NULL,
    title_en TEXT,
    category_de TEXT,
    category_en TEXT,
    image_url TEXT,
    description_de TEXT,
    description_en TEXT
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title_de TEXT NOT NULL,
    title_en TEXT,
    description_de TEXT,
    description_en TEXT,
    icon TEXT DEFAULT 'Hammer',
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Insert Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Update Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Delete Projects" ON public.projects;

DROP POLICY IF EXISTS "Public Read Services" ON public.services;
DROP POLICY IF EXISTS "Public Insert Services" ON public.services;
DROP POLICY IF EXISTS "Public Update Services" ON public.services;
DROP POLICY IF EXISTS "Public Delete Services" ON public.services;

DROP POLICY IF EXISTS "Public Read Settings" ON public.website_settings;
DROP POLICY IF EXISTS "Public Upsert Settings" ON public.website_settings;

-- 4. Create Policies for Public Access
-- Note: 'anon' role is used for the API key provided in the app.

-- Projects Policies
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Insert Projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Public Delete Projects" ON public.projects FOR DELETE USING (true);

-- Services Policies
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Insert Services" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Services" ON public.services FOR UPDATE USING (true);
CREATE POLICY "Public Delete Services" ON public.services FOR DELETE USING (true);

-- Settings Policies
CREATE POLICY "Public Read Settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public Upsert Settings" ON public.website_settings FOR ALL USING (true);

-- 5. Insert Default Settings
INSERT INTO public.website_settings (key, value) VALUES 
('company_name', 'FJ Bauservice'),
('slogan_de', 'Raum für Neues schaffen'),
('phone', '0159 06142923'),
('email', 'amjad.ali@fj-bauservice.com'),
('address', 'Rosenheim, Deutschland')
ON CONFLICT (key) DO NOTHING;
