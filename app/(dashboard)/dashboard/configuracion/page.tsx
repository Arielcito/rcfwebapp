'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Settings } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { canchaColumns } from './canchas-columns'
import { canchaService } from '@/lib/services/api'
import { useSession } from 'next-auth/react'
import { EditProfileDialog } from '@/components/dashboard/edit-profile-dialog'
import { EditPredioDialog } from '@/components/dashboard/edit-predio-dialog'
import { EditCanchaDialog } from '@/components/dashboard/edit-cancha-dialog'
import { usePredio } from '@/lib/context/PredioContext'
import { useState, useEffect } from 'react'
import type { Cancha } from '@/types/api'
import { Spinner } from '@/components/ui/spinner'

export default function SettingsPage() {
  const { data: session } = useSession()
  const { selectedPredio, loading: loadingPredio, predios } = usePredio()
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [loadingCanchas, setLoadingCanchas] = useState(true)

  useEffect(() => {
    const fetchCanchas = async () => {
      if (selectedPredio?.id) {
        try {
          const allCanchas = await canchaService.getAll()
          const filteredCanchas = allCanchas.filter(
            (cancha) => cancha.predioId === selectedPredio.id
          )
          setCanchas(filteredCanchas)
        } catch (error) {
          console.error('❌ Error al obtener canchas:', error)
        } finally {
          setLoadingCanchas(false)
        }
      } else {
        console.log('⚠️ No hay predio seleccionado')
        setLoadingCanchas(false)
      }
    }

    fetchCanchas()
  }, [selectedPredio?.id])

  if (!session?.user) {
    console.log('❌ No hay sesión de usuario activa')
    return null
  }

  if (loadingPredio || loadingCanchas) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" variant="primary" />
      </div>
    )
  }

  if (!selectedPredio) {
    console.log('❌ No hay predio seleccionado. Predios disponibles:', predios)
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        </div>
        <p className="text-muted-foreground">No se encontró información del predio</p>
      </div>
    )
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Datos del Predio</CardTitle>
            <EditPredioDialog predio={selectedPredio}>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </EditPredioDialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Nombre: {selectedPredio.nombre}</p>
              <p className="text-sm font-medium">Dirección: {selectedPredio.direccion}</p>
              <p className="text-sm font-medium">Ciudad: {selectedPredio.ciudad}</p>
              <p className="text-sm font-medium">Provincia: {selectedPredio.provincia}</p>
              <p className="text-sm font-medium">Teléfono: {selectedPredio.telefono}</p>
              <p className="text-sm font-medium">Email: {selectedPredio.email}</p>
              <p className="text-sm font-medium">
                Horario: {new Date(selectedPredio.horarioApertura).toLocaleTimeString()} - {new Date(selectedPredio.horarioCierre).toLocaleTimeString()}
              </p>
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
          <EditCanchaDialog predioId={selectedPredio.id}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Cancha
            </Button>
          </EditCanchaDialog>
        </div>
        <Suspense fallback={<Spinner size="sm" variant="primary" />}>
          <DataTable columns={canchaColumns} data={canchas} />
        </Suspense>
      </div>
    </div>
  )
} 