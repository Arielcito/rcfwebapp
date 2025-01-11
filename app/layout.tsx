import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import SessionProvider from './SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Futbol Manager',
  description: 'Gestión de canchas de fútbol',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

