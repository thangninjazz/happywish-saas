-- 1. Create a function to check if the current user is an admin
-- This function uses SECURITY DEFINER to bypass RLS and avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Ensure RLS is enabled for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- 3. Fix policies for public.users
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update users" ON public.users;
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (public.is_admin());

-- 4. Fix policies for public.templates
DROP POLICY IF EXISTS "Admins can manage templates" ON public.templates;
CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (public.is_admin());

-- 5. Fix policies for public.wishes
DROP POLICY IF EXISTS "Admins can view all wishes" ON public.wishes;
CREATE POLICY "Admins can view all wishes" ON public.wishes
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete wishes" ON public.wishes;
CREATE POLICY "Admins can delete wishes" ON public.wishes
  FOR DELETE USING (public.is_admin());

-- 6. Fix policies for public.orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders
  FOR UPDATE USING (public.is_admin());
