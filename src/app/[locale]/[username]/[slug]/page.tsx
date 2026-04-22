import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PublicGreeting } from '@/components/greeting/PublicGreeting';
import crypto from 'crypto';

export default async function PublicGreetingPage({
  params,
}: {
  params: { username: string; slug: string; locale: string };
}) {
  const { username, slug } = await params;
  const supabase = await createClient();

  // 1. Fetch wish data
  const { data: wish, error } = await supabase
    .from('wishes')
    .select('*, users!inner(email)')
    .eq('slug', slug)
    .single();

  if (error || !wish) {
    notFound();
  }

  // Check if it's active
  if (wish.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-center p-4">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold">This greeting is not available</h1>
          <p className="text-muted-foreground">It might be expired, draft, or pending payment.</p>
        </div>
      </div>
    );
  }

  // 2. Track Analytics (Basic server-side logging for now)
  // Normally we would get IP from headers and hash it
  try {
    const ipHash = crypto.createHash('sha256').update('anonymous-ip').digest('hex');
    await supabase.from('analytics_views').insert({
      wish_id: wish.id,
      ip_hash: ipHash,
      device: 'unknown',
      country: 'unknown'
    });
  } catch (e) {
    console.error('Analytics tracking failed', e);
  }

  return <PublicGreeting wish={wish} />;
}
