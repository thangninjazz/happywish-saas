-- Users table (extends Supabase Auth users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  preview_url TEXT,
  price NUMERIC DEFAULT 0,
  config_schema JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishes table
CREATE TABLE public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_name TEXT,
  message TEXT,
  event_date DATE,
  music_url TEXT,
  theme_color TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wish Media table
CREATE TABLE public.wish_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID REFERENCES public.wishes(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  wish_id UUID REFERENCES public.wishes(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Views table
CREATE TABLE public.analytics_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID REFERENCES public.wishes(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  device TEXT,
  country TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons table
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'percent' CHECK (type IN ('percent', 'fixed')),
  value NUMERIC NOT NULL,
  max_use INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  expired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Templates: Everyone can read active templates
CREATE POLICY "Active templates are viewable by everyone" ON public.templates
  FOR SELECT USING (is_active = true);

-- Wishes: Users can read/write their own wishes. Active wishes are readable by everyone.
CREATE POLICY "Users can view their own wishes" ON public.wishes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Active wishes are viewable by everyone" ON public.wishes
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own wishes" ON public.wishes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishes" ON public.wishes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishes" ON public.wishes
  FOR DELETE USING (auth.uid() = user_id);

-- Storage buckets setup (to be run via Supabase SQL editor)
-- insert into storage.buckets (id, name, public) values ('wish-media', 'wish-media', true);
-- insert into storage.buckets (id, name, public) values ('templates', 'templates', true);
