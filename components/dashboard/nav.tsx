'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  CalendarDays,
  Settings,
  Users,
  DollarSign,
  Wallet,
} from 'lucide-react'
import { useSession } from 'next-auth/react'

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isOwner = session?.user?.role === 'OWNER'

  const items = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Reservas',
      href: '/dashboard/reservas',
      icon: CalendarDays,
    },
    {
      title: 'Movimientos',
      href: '/dashboard/movimientos',
      icon: Wallet,
    },
    {
      title: 'Usuarios',
      href: '/dashboard/usuarios',
      icon: Users,
    },
    {
      title: 'Clientes',
      href: '/dashboard/clientes',
      icon: Users,
    },
    {
      title: 'Configuración',
      href: '/dashboard/configuracion',
      icon: Settings,
    },
    
  ]

  return (
    <nav
      className={cn('flex flex-col space-y-2 p-4', className)}
      {...props}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
          >
            <span
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === item.href ? 'bg-accent' : 'transparent',
                'cursor-pointer'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
} 