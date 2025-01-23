'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Calendar, Users, Settings, BookOpen } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isOwner = session?.user?.role === 'OWNER'

  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      variant: "ghost" as const,
    },
    {
      title: "Reservas",
      href: "/dashboard/reservas",
      icon: BookOpen,
      variant: "ghost" as const,
    },
    {
      title: "Calendario",
      href: "/dashboard/calendario",
      icon: Calendar,
      variant: "ghost" as const,
    },
    ...(isOwner ? [{
      title: "Usuarios",
      href: "/dashboard/usuarios",
      icon: Users,
      variant: "ghost" as const,
    }] : []),
    {
      title: "Configuración",
      href: "/dashboard/configuracion",
      icon: Settings,
      variant: "ghost" as const,
    },
  ]

  return (
    <nav
      className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}
      {...props}
    >
      {items.map((item) => (
        <Button
          key={item.href}
          variant={item.variant}
          size="lg"
          className={cn(
            "justify-start pl-6 hover:bg-primary/10",
            pathname === item.href
              ? "bg-primary/10 text-primary hover:bg-primary/20"
              : "text-muted-foreground hover:text-primary"
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
} 