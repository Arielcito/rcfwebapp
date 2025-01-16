import type { NextAuthOptions } from 'next-auth'
import type { AxiosError } from 'axios'
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        try {
          const response = await axiosInstance.post('/api/users/login', credentials)

          if (response.data) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              role: response.data.user.role,
              accessToken: response.data.token,
            }
          }
          return null
        } catch (error) {
          const axiosError = error as AxiosError<{ message?: string }>
          const message = axiosError.response?.data?.message || 'Error al iniciar sesión'
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
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
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