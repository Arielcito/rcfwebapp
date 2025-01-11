import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, Menu } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4">
        <button className="md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
} 