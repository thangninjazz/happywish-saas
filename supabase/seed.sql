-- Demo Template 1
INSERT INTO public.templates (slug, title, category, price, is_active, thumbnail_url)
VALUES (
  'birthday-classic', 
  'Classic Birthday Surprise', 
  'birthday', 
  0, 
  true,
  'https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=600&auto=format&fit=crop'
);

-- Demo Template 2
INSERT INTO public.templates (slug, title, category, price, is_active, thumbnail_url)
VALUES (
  'anniversary-elegant', 
  'Elegant Anniversary', 
  'anniversary', 
  50000, 
  true,
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop'
);

-- Demo Template 3
INSERT INTO public.templates (slug, title, category, price, is_active, thumbnail_url)
VALUES (
  'wedding-romantic', 
  'Romantic Wedding', 
  'wedding', 
  99000, 
  true,
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop'
);

-- Demo Template 4
INSERT INTO public.templates (slug, title, category, price, is_active, thumbnail_url)
VALUES (
  'baby-cute', 
  'Cute Baby Celebration', 
  'baby', 
  30000, 
  true,
  'https://images.unsplash.com/photo-1530652101053-8c0db4fbb5de?q=80&w=600&auto=format&fit=crop'
);

-- Demo Template 5
INSERT INTO public.templates (slug, title, category, price, is_active, thumbnail_url)
VALUES (
  'special-love', 
  'Special Love (Particle Heart)', 
  'romantic', 
  150000, 
  true,
  'https://images.unsplash.com/photo-1518196775789-afc6294f217a?q=80&w=600&auto=format&fit=crop'
);

-- Note: Admin user creation should be done via the Supabase Auth UI or API, 
-- and then their role can be updated in the public.users table.
