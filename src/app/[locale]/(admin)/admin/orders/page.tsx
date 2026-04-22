import { createClient } from '@/lib/supabase/server';
import { OrdersTable } from '@/components/admin/OrdersTable';

export default async function OrdersAdminPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, users(email, full_name)')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-3xl border border-destructive/20">
        <h2 className="text-xl font-bold mb-2">Lỗi tải danh sách đơn hàng</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <OrdersTable initialOrders={(orders as any) || []} />
    </div>
  );
}
