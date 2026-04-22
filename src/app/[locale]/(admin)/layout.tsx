import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { 
  LayoutDashboard, 
  Users, 
  Palette, 
  ShoppingBag, 
  Gift,
  Settings,
  LogOut
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  // 2. Role check
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md bg-card rounded-2xl shadow-xl border border-destructive/20">
          <h1 className="text-3xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Bạn không có quyền truy cập vào khu vực quản trị này.</p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium transition-transform hover:scale-105 active:scale-95"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Người dùng', href: '/admin/users', icon: Users },
    { label: 'Mẫu thiết kế', href: '/admin/templates', icon: Palette },
    { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Lời chúc', href: '/admin/wishes', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              HW
            </div>
            <span>Admin CP</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            <Settings className="w-5 h-5" />
            Cài đặt
          </Link>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-8 sticky top-0 z-10">
          <div className="flex-1 font-semibold text-lg">Hệ thống quản trị HappyWish</div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{userData.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 border-2 border-background shadow-sm" />
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
