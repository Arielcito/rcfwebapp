import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      accessToken: string
      role: 'ADMIN' | 'OWNER' | 'USER'
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    accessToken: string
    role: 'ADMIN' | 'OWNER' | 'USER'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accessToken: string
    role: 'ADMIN' | 'OWNER' | 'USER'
  }
} 