import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { Eye, Edit, Trash2, ExternalLink } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  // Get wishes
  const { data: wishes, error } = await supabase
    .from('wishes')
    .select('*, templates(title, thumbnail_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your greeting websites</p>
        </div>
        <Link href="/templates" className={buttonVariants({ variant: "default" })}>
          Create New
        </Link>
      </div>

      {wishes && wishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishes.map((wish) => (
            <Card key={wish.id} className="overflow-hidden flex flex-col">
              <div className="h-32 bg-muted relative">
                {/* Normally an image here based on template */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                  <span className="font-serif text-2xl opacity-50">{wish.recipient_name}</span>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant={wish.status === 'active' ? 'default' : 'secondary'}>
                    {wish.status}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="truncate">For: {wish.recipient_name}</CardTitle>
                <CardDescription className="truncate">
                  Template: {wish.templates?.title || 'Unknown'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(wish.created_at).toLocaleDateString()}
                </p>
                {wish.event_date && (
                  <p className="text-sm text-muted-foreground">
                    Event: {new Date(wish.event_date).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-4 flex justify-between border-t gap-2 bg-muted/20">
                 <Link href={`/${user.id}/${wish.slug}`} target="_blank" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                    <ExternalLink size={16} className="mr-1" /> View
                 </Link>
                 {/* 
                   Normally we would need a proper username for the link. 
                   For now using user.id or creating a placeholder route.
                 */}
                 <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="px-2" title="Edit">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-2 text-destructive hover:bg-destructive/10" title="Delete">
                      <Trash2 size={16} />
                    </Button>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed shadow-sm">
          <h2 className="text-xl font-semibold mb-2">No greetings yet</h2>
          <p className="text-muted-foreground mb-6">Create your first personalized greeting website now!</p>
          <Link href="/templates" className={buttonVariants({ variant: "default" })}>
            Browse Templates
          </Link>
        </div>
      )}
    </div>
  );
}
