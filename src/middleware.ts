import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Update Supabase session
  const supabaseResponse = await updateSession(request);
  
  // If updateSession redirected, return that redirect
  if (supabaseResponse.headers.get('location')) {
    return supabaseResponse;
  }

  // Handle i18n routing
  const response = handleI18nRouting(request);
  
  // Combine cookies from both responses
  // Supabase updateSession might have refreshed the token and set new cookies
  const supabaseCookies = supabaseResponse.headers.get('set-cookie');
  if (supabaseCookies) {
    // Note: this is a basic merge, complex cases might require a proper Set-Cookie parser
    response.headers.append('set-cookie', supabaseCookies);
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};

