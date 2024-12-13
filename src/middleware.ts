import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();

  const protectedPaths = [
    '/dashboard',
    '/sell',
    '/admin',
    '/profile'
  ];

  const path = req.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp));

  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/auth', req.url);
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }

  if (path.startsWith('/admin') && session?.user.user_metadata.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sell/:path*',
    '/admin/:path*',
    '/profile/:path*'
  ],
};