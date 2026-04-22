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

-- Note: Admin user creation should be done via the Supabase Auth UI or API, 
-- and then their role can be updated in the public.users table.
