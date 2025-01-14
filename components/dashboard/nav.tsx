'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Calendar, Users, Settings } from 'lucide-react'

interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Reservas",
    href: "/dashboard/reservas",
    icon: Calendar
  },
  {
    title: "Usuarios",
    href: "/dashboard/usuarios",
    icon: Users
  },
  {
    title: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings
  }
]

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("bg-background border-r", className)} {...props}>
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/">
          <h2 className="text-lg font-semibold">RCF</h2>
        </Link>
      </div>
      <div className="space-y-1 p-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href && "bg-muted"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
} 