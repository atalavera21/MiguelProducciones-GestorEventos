import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que no requieren autenticación
const RUTAS_PUBLICAS = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const esPublica = RUTAS_PUBLICAS.some((ruta) => pathname.startsWith(ruta));

  // Sin token y ruta protegida → redirige al login
  if (!token && !esPublica) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Con token y ruta de login → redirige a la agenda
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/agenda', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Aplica el middleware a todas las rutas excepto assets estáticos y API routes de Next.js
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
