-- Demo Template
INSERT INTO public.templates (slug, title, category, price, is_active)
VALUES (
  'birthday-classic', 
  'Classic Birthday Surprise', 
  'birthday', 
  0, 
  true
);

-- Note: Admin user creation should be done via the Supabase Auth UI or API, 
-- and then their role can be updated in the public.users table.
