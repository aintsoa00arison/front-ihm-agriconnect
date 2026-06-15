// middleware.ts - Version simplifiée
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Récupérer le token depuis le cookie
  const token = request.cookies.get('access_token')?.value;
  
  // Routes protégées
  if ((pathname.startsWith('/c') || pathname.startsWith('/f')) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/c/:path*', '/f/:path*'],
};