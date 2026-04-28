-- SUPABASE SETUP SCRIPT FOR FJ BAUSERVICE
-- Project: shujaPorject1 (sjhvxwlvqbzdfojcabax)

-- 1. CREATE TABLES (IF NOT EXISTS prevents errors if they are already there)
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

-- 2. CRITICAL: DISABLE RLS (Row Level Security)
-- This allows the website to read and write without login.
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings DISABLE ROW LEVEL SECURITY;

-- 3. STORAGE INSTRUCTIONS
-- To make image uploading work, you must go to STORAGE in your Supabase Dashboard:
-- 1. Create a new Bucket named "projects"
-- 2. Set it to "Public" (Important!)
-- 3. Go to Policies -> Storage -> and create a policy that allows "Anon" or "Public" to UPLOAD and READ.
--    Or simpler: Disable RLS on the storage bucket if possible, or use a "Public" bucket.

-- 4. INSERT DEFAULT CONTENT (Only if not already there)
INSERT INTO public.website_settings (key, value) VALUES 
('company_name', 'FJ Bauservice'),
('slogan_de', 'Raum für Neues schaffen'),
('phone', '0159 06142923'),
('email', 'amjad.ali@fj-bauservice.com'),
('address', 'Rosenheim, Deutschland'),
('opening_hours', 'Mo - Sa: 08:00 - 18:00')
ON CONFLICT (key) DO NOTHING;
