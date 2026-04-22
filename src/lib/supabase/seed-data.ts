import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file if it exists (local development)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Connecting to Supabase:', supabaseUrl);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Admin user to ensure access
const ADMIN_EMAIL = 'thang.dv220620001@gmail.com';

const templates = [
  {
    slug: 'birthday-classic',
    title: 'Classic Birthday Surprise',
    category: 'birthday',
    price: 0,
    is_active: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=600&auto=format&fit=crop'
  },
  {
    slug: 'anniversary-elegant',
    title: 'Elegant Anniversary',
    category: 'anniversary',
    price: 50000,
    is_active: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop'
  },
  {
    slug: 'wedding-romantic',
    title: 'Romantic Wedding',
    category: 'wedding',
    price: 99000,
    is_active: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop'
  },
  {
    slug: 'baby-cute',
    title: 'Cute Baby Celebration',
    category: 'baby',
    price: 30000,
    is_active: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1530652101053-8c0db4fbb5de?q=80&w=600&auto=format&fit=crop'
  },
  {
    slug: 'special-love',
    title: 'Special Love (Particle Heart)',
    category: 'romantic',
    price: 150000,
    is_active: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1518196775789-afc6294f217a?q=80&w=600&auto=format&fit=crop'
  }
];

async function seed() {
  console.log('--- Database Seeding ---');

  // 1. Seed Templates
  console.log('Seeding templates...');
  for (const template of templates) {
    const { error } = await supabase
      .from('templates')
      .upsert(template, { onConflict: 'slug' });
    
    if (error) {
      console.error(`Error seeding template ${template.slug}:`, error.message);
    } else {
      console.log(`Successfully seeded template: ${template.slug}`);
    }
  }

  // 2. Ensure Admin User Access
  console.log(`Ensuring admin access for: ${ADMIN_EMAIL}`);
  
  // Try to find the user in auth.users first to get their ID if possible
  // However, we can just upsert into public.users based on email if we handle ID carefully
  // For now, let's update any existing user with this email to be admin
  const { data: userData, error: userError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('email', ADMIN_EMAIL);

  if (userError) {
    console.error('Error updating admin role:', userError.message);
  } else {
    console.log('Admin role updated/verified for', ADMIN_EMAIL);
  }
  
  console.log('--- Seed Completed ---');
}

seed();
