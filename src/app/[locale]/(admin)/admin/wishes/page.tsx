import { createClient } from '@/lib/supabase/server';
import { WishesTable } from '@/components/admin/WishesTable';

export default async function WishesAdminPage() {
  const supabase = await createClient();

  const { data: wishes, error } = await supabase
    .from('wishes')
    .select('*, users(full_name, email), templates(title)')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-3xl border border-destructive/20">
        <h2 className="text-xl font-bold mb-2">Lỗi tải danh sách lời chúc</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <WishesTable initialWishes={(wishes as any) || []} />
    </div>
  );
}
