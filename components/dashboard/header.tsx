'use client'


import Image from 'next/image'
import Link from 'next/link'
import { UserNav } from './user-nav'

interface DashboardHeaderProps {
  className?: string
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  return (
    <header className={`border-b bg-background px-4 py-3 ${className}`}>
      <div className="flex h-12 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="object-contain"
          />
          <span className="text-xl font-bold">RCF App</span>
        </Link>
        <UserNav />
      </div>
    </header>
  )
} 