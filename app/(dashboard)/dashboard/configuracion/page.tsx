import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { predioColumns } from './predios-columns'
import { canchaColumns } from './canchas-columns'
import { predioService, canchaService } from '@/lib/services/api'

async function getPredios() {
  try {
    console.log('🏢 Obteniendo predios...')
    const predios = await predioService.getAll()
    console.log('✅ Predios obtenidos:', predios.length)
    return predios
  } catch (error) {
    console.error('❌ Error al obtener predios:', error.message)
    return []
  }
}

async function getCanchas() {
  try {
    console.log('⚽ Obteniendo canchas...')
    const canchas = await canchaService.getAll()
    console.log('✅ Canchas obtenidas:', canchas.length)
    return canchas
  } catch (error) {
    console.error('❌ Error al obtener canchas:', error.message)
    return []
  }
}

export default async function SettingsPage() {
  const [predios, canchas] = await Promise.all([getPredios(), getCanchas()])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
      </div>

      <Tabs defaultValue="predios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predios">Predios</TabsTrigger>
          <TabsTrigger value="canchas">Canchas</TabsTrigger>
        </TabsList>
        <TabsContent value="predios" className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium">Predios</h3>
              <p className="text-sm text-muted-foreground">
                Gestiona los predios disponibles
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Predio
            </Button>
          </div>
          <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
            <DataTable columns={predioColumns} data={predios} />
          </Suspense>
        </TabsContent>
        <TabsContent value="canchas" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  )
} 