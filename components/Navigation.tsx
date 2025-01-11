'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/dashboard" className={pathname === '/dashboard' ? 'font-bold' : ''}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/reservations" className={pathname === '/reservations' ? 'font-bold' : ''}>
            Reservas
          </Link>
        </li>
        <li>
          <Link href="/fields" className={pathname === '/fields' ? 'font-bold' : ''}>
            Canchas
          </Link>
        </li>
        <li className="ml-auto">
          <Button variant="ghost" onClick={() => signOut()}>
            Cerrar sesión
          </Button>
        </li>
      </ul>
    </nav>
  )
}

