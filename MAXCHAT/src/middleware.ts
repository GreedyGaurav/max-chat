import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/chat') && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat', '/login'],
};
