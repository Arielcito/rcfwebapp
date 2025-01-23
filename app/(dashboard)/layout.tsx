'use client'

import { ReactNode } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardNav } from '@/components/dashboard/nav'
import { PredioProvider } from '@/lib/context/PredioContext'

interface DashboardLayoutProps {
  children: ReactNode   
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <PredioProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader className="w-full" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardNav className="hidden md:flex w-64 flex-col" />
          <main className="flex-1 overflow-y-auto bg-background p-4">
            {children}
          </main>
        </div>
      </div>
    </PredioProvider>
  )
}

