import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { GreetingBuilder } from '@/components/builder/GreetingBuilder';

export default async function CreateGreetingPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch template data
  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !template) {
    notFound();
  }

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto py-8 px-4">
      <GreetingBuilder template={template} user={user} />
    </div>
  );
}
