import { Navigation } from '@/components/Navigation'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <Navigation />
      <main className="container mx-auto py-4">
        {children}
      </main>
    </div>
  )
}

