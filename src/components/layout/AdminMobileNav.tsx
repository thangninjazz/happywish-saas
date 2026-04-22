'use client';

import { useState } from 'react';
import { Menu, X, LayoutDashboard, Users, Palette, ShoppingBag, Gift, Settings, LogOut } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const items = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Người dùng', href: '/admin/users', icon: Users },
    { label: 'Mẫu thiết kế', href: '/admin/templates', icon: Palette },
    { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Lời chúc', href: '/admin/wishes', icon: Gift },
  ];

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              HW
            </div>
            <span>Admin CP</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
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
      </div>
    </div>
  );
}
