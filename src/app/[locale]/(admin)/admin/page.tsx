import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Palette, Gift, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { ExportReportButton, DetailLink } from '@/components/admin/DashboardActions';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch basic stats
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: templateCount } = await supabase.from('templates').select('*', { count: 'exact', head: true });
  const { count: wishCount } = await supabase.from('wishes').select('*', { count: 'exact', head: true });
  const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

  const stats = [
    { label: 'Tổng người dùng', value: userCount || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Mẫu thiết kế', value: templateCount || 0, icon: Palette, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Lời chúc đã tạo', value: wishCount || 0, icon: Gift, color: 'text-pink-600', bg: 'bg-pink-100' },
    { label: 'Tổng đơn hàng', value: orderCount || 0, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Chào mừng quay trở lại, đây là tổng quan hệ thống của bạn.</p>
        </div>
        <ExportReportButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-card overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg transition-transform group-hover:scale-110`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-2 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    U{i}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Người dùng mới vừa đăng ký</p>
                    <p className="text-xs text-muted-foreground">user{i}@example.com • {i} giờ trước</p>
                  </div>
                  <DetailLink label="người dùng" id={i} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Đơn hàng mới nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Thanh toán thành công #{1000 + i}</p>
                    <p className="text-xs text-muted-foreground">{(50000 * i).toLocaleString()}đ • {i * 30} phút trước</p>
                  </div>
                  <DetailLink label="đơn hàng" id={1000 + i} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
