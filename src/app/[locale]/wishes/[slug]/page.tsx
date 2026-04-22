import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PublicGreeting } from '@/components/greeting/PublicGreeting';

export default async function WishPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch wish data with related template and media
  const { data: wish, error } = await supabase
    .from('wishes')
    .select('*, templates(*), wish_media(*)')
    .eq('slug', slug)
    .single();

  if (error || !wish) {
    notFound();
  }

  // Check if wish is active (unless preview/admin?)
  if (wish.status !== 'active') {
    // For now allow viewing drafts for the creator, but strictly we should check
  }

  return (
    <div className="min-h-screen">
      <PublicGreeting wish={wish} />
    </div>
  );
}
