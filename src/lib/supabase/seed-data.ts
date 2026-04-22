import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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
  }
];

async function seed() {
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
  
  console.log('Seed completed!');
}

seed();
