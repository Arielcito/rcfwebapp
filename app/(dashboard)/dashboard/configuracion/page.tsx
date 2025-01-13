import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Settings } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { canchaColumns } from './canchas-columns'
import { canchaService } from '@/lib/services/api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { EditProfileDialog } from '@/components/dashboard/edit-profile-dialog'

async function getCanchas() {
  try {
    console.log('⚽ Obteniendo canchas...')
    const session = await getServerSession(authOptions)
    const canchas = await canchaService.getAll()
    const filteredCanchas = canchas.filter(cancha => cancha.predioId === session?.user?.predioId)
    console.log('✅ Canchas obtenidas:', filteredCanchas.length)
    return filteredCanchas
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error al obtener canchas:', error.message)
    } else {
      console.error('❌ Error desconocido al obtener canchas')
    }
    return []
  }
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const canchas = await getCanchas()

  if (!session?.user) {
    return null
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil</CardTitle>
            <EditProfileDialog user={session.user}>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </EditProfileDialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Nombre: {session.user.name}</p>
              <p className="text-sm font-medium">Email: {session.user.email}</p>
              <p className="text-sm font-medium">Rol: {session.user.role}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium">Canchas</h3>
            <p className="text-sm text-muted-foreground">
              Gestiona las canchas disponibles
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Cancha
          </Button>
        </div>
        <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
          <DataTable columns={canchaColumns} data={canchas} />
        </Suspense>
      </div>
    </div>
  )
} 