-- Schema definition for Bridemeup

-- Clean up existing tables (if any, use with caution)
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.wedding_plans;
DROP TABLE IF EXISTS public.stylists;
DROP TABLE IF EXISTS public.salons;

-- 1. Create Salons Table
CREATE TABLE public.salons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    rating NUMERIC(3, 2) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    cosmetic_brands JSONB DEFAULT '[]'::jsonb,
    packages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Stylists Table
CREATE TABLE public.stylists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    profile_image TEXT,
    domain_ratings JSONB DEFAULT '{}'::jsonb,
    portfolio_images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Enable RLS
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;

-- 3. Create Wedding Plans Table
CREATE TABLE public.wedding_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Appointments Table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
    stylist_id UUID REFERENCES public.stylists(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Enable RLS
ALTER TABLE public.wedding_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Read Policies
-- We grant SELECT access to 'anon' and 'authenticated' roles.
CREATE POLICY "Allow public read access on salons"
ON public.salons
FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Allow public read access on stylists"
ON public.stylists
FOR SELECT TO anon, authenticated
USING (true);

-- 6. User Policies for new tables
CREATE POLICY "Users can manage their own wedding plans"
ON public.wedding_plans
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own appointments"
ON public.appointments
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Seed Data
DO $$
DECLARE
    salon1_id UUID := gen_random_uuid();
    salon2_id UUID := gen_random_uuid();
    salon3_id UUID := gen_random_uuid();
BEGIN
    -- Insert Salons
    INSERT INTO public.salons (id, name, address, phone, rating, reviews_count, cosmetic_brands, packages)
    VALUES 
    (salon1_id, 'Lumière Artistry', '120, The Chanakya, Chanakyapuri, New Delhi', '+91 98765 43210', 4.9, 120, 
     '[{"brand": "Chanel", "category": "Base Makeup", "image_url": "https://images.unsplash.com/photo-1596462502278-27bf85033e5a"}, {"brand": "Dior", "category": "Lips", "image_url": "https://images.unsplash.com/photo-1586495777744-4413f21062fa"}]'::jsonb,
     '[{"id": "pkg_1", "name": "Royal Delhi Bridal", "price": 25000, "services": ["Airbrush", "Hairstyling", "Draping"]}, {"id": "pkg_2", "name": "Pre-Wedding Glow", "price": 15000, "services": ["Facial", "Nails", "Spa"]}]'::jsonb),
    
    (salon2_id, 'The Velvet Room', 'M-Block Market, Greater Kailash 1, New Delhi', '+91 98765 43211', 4.8, 95, 
     '[{"brand": "Charlotte Tilbury", "category": "Glow", "image_url": "https://images.unsplash.com/photo-1522337360788-8b13fee7a3af"}]'::jsonb,
     '[{"id": "pkg_3", "name": "Classic Elegance", "price": 18000, "services": ["HD Makeup", "Hair Setup"]}]'::jsonb),
     
    (salon3_id, 'Glow & Glamour', 'DLF Emporio, Vasant Kunj, New Delhi', '+91 98765 43212', 4.7, 85, 
     '[{"brand": "Fenty Beauty", "category": "Contour", "image_url": "https://images.unsplash.com/photo-1512496015851-a1dc8a477d15"}]'::jsonb,
     '[{"id": "pkg_4", "name": "Minimalist Bride", "price": 12000, "services": ["Soft Glam", "Waves"]}]'::jsonb);

    -- Insert Stylists
    INSERT INTO public.stylists (salon_id, name, profile_image, domain_ratings, portfolio_images)
    VALUES 
    (salon1_id, 'Anya Sharma', '/images/artist-1.jpg', 
     '{"Hair": 4.9, "Makeup": 4.9, "Draping": 4.8}'::jsonb, 
     ARRAY['/images/gallery-makeup.jpg', '/images/hero-bride.jpg']),
     
    (salon1_id, 'Kabir Singh', '/images/artist-2.jpg', 
     '{"Hair": 4.8, "Coloring": 4.7}'::jsonb, 
     ARRAY['/images/gallery-reception.jpg']),
     
    (salon2_id, 'Meera Kapoor', '/images/artist-3.jpg', 
     '{"Makeup": 4.8, "Facials": 4.9}'::jsonb, 
     ARRAY['/images/gallery-haldi.jpg']),
     
    (salon2_id, 'Rahul Jain', '/images/artist-1.jpg', 
     '{"Mehendi": 4.9, "Nails": 4.7}'::jsonb, 
     ARRAY['/images/gallery-mehendi.jpg']),
     
    (salon3_id, 'Sneha Patel', '/images/artist-2.jpg', 
     '{"Photography": 4.7}'::jsonb, 
     ARRAY['/images/gallery-couple.jpg']),
     
    (salon3_id, 'Aditi Desai', '/images/artist-3.jpg', 
     '{"Setup": 4.8, "Decor": 4.9}'::jsonb, 
     ARRAY['/images/gallery-mandap.jpg', '/images/gallery-embroidery.jpg']);

END $$;
