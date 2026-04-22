import { createClient } from '@/lib/supabase/server';
import { UsersTable } from '@/components/admin/UsersTable';

export default async function UsersAdminPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-3xl border border-destructive/20">
        <h2 className="text-xl font-bold mb-2">Lỗi tải danh sách người dùng</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UsersTable initialUsers={users || []} />
    </div>
  );
}
