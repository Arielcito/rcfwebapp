import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
      cookieName: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token'
    })
     
    const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'

    // Proteger rutas del dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return NextResponse.next()
    }

    // Manejar páginas de autenticación
    if (isAuthPage) {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    console.error('❌ Error en middleware:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configurar las rutas que el middleware debe manejar
export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*']
} 