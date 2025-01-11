import { ReactNode } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardNav } from '@/components/dashboard/nav'

interface DashboardLayoutProps {
  children: ReactNode   
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardNav className="hidden md:flex w-64 flex-col fixed inset-y-0" />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}

