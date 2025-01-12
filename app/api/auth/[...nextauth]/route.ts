import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import axiosInstance from '@/lib/axios'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔑 Authorize function called')
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ Missing credentials')
          throw new Error('Email y contraseña son requeridos')
        }

        try {
          console.log('📡 Making login request to backend')
          const response = await axiosInstance.post('/api/users/login', credentials)
          
          console.log('✅ Login response received:', response.status)
          if (response.data) {
            console.log('👤 User data received:', response.data)
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              role: response.data.user.role,
              accessToken: response.data.token,
            }
          }
          console.log('❌ No user data in response')
          return null
        } catch (error: any) {
          console.error('❌ Login error:', error.response?.data || error.message)
          const message = error.response?.data?.message || 'Error al iniciar sesión'
          throw new Error(message)
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎫 JWT Callback', { hasUser: !!user, hasToken: !!token, user, token })
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      console.log('🔐 Session Callback', { hasSession: !!session, hasToken: !!token, token })
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

