import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('🔒 Middleware - URL:', request.nextUrl.pathname)
  
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
      cookieName: 'next-auth.session-token'
    })
    
    // Log del token completo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 Token details:', JSON.stringify(token, null, 2))
      console.log('🍪 Cookies:', request.cookies.toString())
    } else {
      console.log('🔑 Token status:', token ? 'Present' : 'Not present')
    }
    
    const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'
    console.log('📍 Is auth page:', isAuthPage)

    // Proteger rutas del dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!token) {
        console.log('🚫 Unauthorized access to dashboard, redirecting to login')
        return NextResponse.redirect(new URL('/login', request.url))
      }
      console.log('✅ Authorized access to dashboard')
      return NextResponse.next()
    }

    // Manejar páginas de autenticación
    if (isAuthPage) {
      if (token) {
        console.log('👉 Redirecting authenticated user from auth page to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      console.log('✅ Allowing unauthenticated access to auth page')
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    console.error('❌ Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configurar las rutas que el middleware debe manejar
export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*']
} 