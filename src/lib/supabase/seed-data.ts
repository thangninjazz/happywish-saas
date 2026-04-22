import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('CRITICAL: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use Service Role Key for admin bypass
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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
  console.log('--- STARTING DATABASE SEED ---');
  
  try {
    // 1. Seed Templates
    console.log('Seeding templates...');
    const { data: tData, error: tError } = await supabase
      .from('templates')
      .upsert(templates, { onConflict: 'slug' })
      .select();
    
    if (tError) throw new Error(`Templates seed failed: ${tError.message}`);
    console.log(`Successfully seeded ${tData?.length} templates.`);

    // 2. Ensure Admin User Access
    console.log(`Searching for user with email: ${ADMIN_EMAIL}...`);
    
    // List users from Auth to find the UUID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw new Error(`Auth list failed: ${listError.message}`);
    
    const targetUser = users.find(u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    
    if (targetUser) {
      console.log(`Found User ID: ${targetUser.id}. Upserting into public.users...`);
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: targetUser.id,
          email: targetUser.email,
          role: 'admin',
          full_name: targetUser.user_metadata?.full_name || 'Admin User'
        });
      
      if (upsertError) throw new Error(`User upsert failed: ${upsertError.message}`);
      console.log('Admin role verified and upserted successfully.');
    } else {
      console.log(`Warning: User ${ADMIN_EMAIL} not found in Supabase Auth. Please sign up first.`);
    }

    console.log('--- SEED COMPLETED SUCCESSFULLY ---');
  } catch (err: any) {
    console.error('--- SEED FAILED ---');
    console.error(err.message);
    process.exit(1);
  }
}

seed();
