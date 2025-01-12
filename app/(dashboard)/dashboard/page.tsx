import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, CalendarDays, Loader2 } from 'lucide-react'
import { Overview } from '@/components/dashboard/overview'
import { RecentBookings } from '@/components/dashboard/recent-bookings'
import { userService, predioService, canchaService } from '@/lib/services/api'

async function getStats() {
  try {
    console.log('📊 Obteniendo estadísticas...')
    const [users, predios, canchas] = await Promise.all([
      userService.getAll().catch((e) => {
        console.error('Error al obtener usuarios:', e.message)
        return []
      }),
      predioService.getAll().catch((e) => {
        console.error('Error al obtener predios:', e.message)
        return []
      }),
      canchaService.getAll().catch((e) => {
        console.error('Error al obtener canchas:', e.message)
        return []
      }),
    ])

    console.log('📈 Estadísticas obtenidas:', {
      usuarios: users?.length || 0,
      predios: predios?.length || 0,
      canchas: canchas?.length || 0
    })

    return {
      users: users?.length || 0,
      predios: predios?.length || 0,
      canchas: canchas?.length || 0,
    }
  } catch (error) {
    console.error('Error general al obtener estadísticas:', error)
    return {
      users: 0,
      predios: 0,
      canchas: 0,
    }
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reservas Totales
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% desde el último mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">
              +0% desde el último mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Canchas Activas
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.canchas}</div>
            <p className="text-xs text-muted-foreground">
              En {stats.predios} predios
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
              <Overview />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
              <RecentBookings />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 