'use client'

import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Settings, CalendarDays } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { canchaColumns } from './canchas-columns'
import { canchaService } from '@/lib/services/api'
import { useSession } from 'next-auth/react'
import { EditProfileDialog } from '@/components/dashboard/edit-profile-dialog'
import { EditPredioDialog } from '@/components/dashboard/edit-predio-dialog'
import { EditCanchaDialog } from '@/components/dashboard/edit-cancha-dialog'
import { usePredio } from '@/lib/context/PredioContext'
import type { Cancha } from '@/types/api'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const { data: session } = useSession()
  const { selectedPredio, loading: loadingPredio, predios, selectPredio } = usePredio()
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [loadingCanchas, setLoadingCanchas] = useState(true)
  const [hasSelectedInitialPredio, setHasSelectedInitialPredio] = useState(false)

  // Efecto para la selección inicial del predio
  useEffect(() => {
    if (!loadingPredio && predios?.length > 0 && !selectedPredio && !hasSelectedInitialPredio) {
      setHasSelectedInitialPredio(true)
      selectPredio(predios[0])
    }
  }, [loadingPredio, predios, selectedPredio, hasSelectedInitialPredio])

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
        setLoadingCanchas(false)
      }
    }

    fetchCanchas()
  }, [selectedPredio?.id])

  if (!session?.user) {
    return null
  }

  if (loadingPredio || loadingCanchas) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary-100 to-secondary-100">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary-200 opacity-25"></div>
          <Spinner size="lg" className="relative z-10 text-primary-600" />
        </div>
        <p className="mt-4 text-secondary-600 animate-pulse">Cargando configuración...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-secondary-800 animate-fade-in">
            Configuración
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tu perfil, predio y canchas desde aquí
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium">Perfil de Usuario</CardTitle>
              <p className="text-sm text-muted-foreground">
                Gestiona tu información personal
              </p>
            </div>
            <EditProfileDialog user={session.user}>
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                <Settings className="h-4 w-4" />
              </Button>
            </EditProfileDialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              <div className="pt-2">
                <Badge variant="outline" className="bg-primary/5">
                  {session.user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedPredio && (
          <>
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium">Datos del Predio</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Información del establecimiento
                  </p>
                </div>
                <EditPredioDialog predio={selectedPredio}>
                  <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                    <Settings className="h-4 w-4" />
                  </Button>
                </EditPredioDialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Nombre</p>
                      <p className="text-sm font-medium">{selectedPredio.nombre}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Teléfono</p>
                      <p className="text-sm font-medium">{selectedPredio.telefono}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Dirección</p>
                      <p className="text-sm font-medium">{selectedPredio.direccion}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ciudad</p>
                      <p className="text-sm font-medium">{selectedPredio.ciudad}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Provincia</p>
                      <p className="text-sm font-medium">{selectedPredio.provincia}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground pt-2">Horario de Atención</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {new Date(selectedPredio.horarioApertura).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className="text-muted-foreground">hasta</span>
                      <p className="text-sm font-medium">
                        {new Date(selectedPredio.horarioCierre).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium">Canchas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Gestiona las canchas disponibles en tu predio
                    </p>
                  </div>
                  <EditCanchaDialog predioId={selectedPredio.id}>
                    <Button className="hover:scale-105 transition-transform">
                      <Plus className="mr-2 h-4 w-4" /> Nueva Cancha
                    </Button>
                  </EditCanchaDialog>
                </div>
              </CardHeader>
              <CardContent>
                {canchas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-primary/10 p-3 mb-4">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No hay canchas registradas</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-2">
                      Comienza agregando las canchas de tu predio para poder gestionarlas y recibir reservas.
                    </p>
                    <EditCanchaDialog predioId={selectedPredio.id}>
                      <Button className="mt-4 hover:scale-105 transition-transform">
                        <Plus className="mr-2 h-4 w-4" /> Agregar Primera Cancha
                      </Button>
                    </EditCanchaDialog>
                  </div>
                ) : (
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-8">
                      <Spinner size="lg" className="text-primary" />
                    </div>
                  }>
                    <div className="rounded-md border">
                      <DataTable columns={canchaColumns} data={canchas} />
                    </div>
                  </Suspense>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
} 