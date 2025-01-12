import { Suspense } from 'react'

import { columns } from './columns'
import { userService } from '@/lib/services/api'
import { Loader2 } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'

async function getUsers() {
  try {
    const users = await userService.getAll()
    return users
  } catch (error) {
    return []
  }
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
      </div>
      <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
        <DataTable columns={columns} data={users} />
      </Suspense>
    </div>
  )
} 