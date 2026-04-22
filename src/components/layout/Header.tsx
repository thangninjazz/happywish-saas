'use client';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, memo, useCallback } from 'react';

const Header = memo(function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  }, [supabase.auth]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              HappyWish
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/templates"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Templates
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              My Wishes
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden lg:inline-block text-sm text-muted-foreground">
                Hi, {user.email?.split('@')[0]}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

export { Header };
