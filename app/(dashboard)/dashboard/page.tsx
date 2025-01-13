'use client'

import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, CalendarDays, Loader2 } from 'lucide-react'
import { Overview } from '@/components/dashboard/overview'
import { RecentBookings } from '@/components/dashboard/recent-bookings'
import { usePredio } from '@/lib/context/PredioContext'
import { bookingService } from '@/lib/services/api/bookingService'
import { canchaService } from '@/lib/services/api'
import type { Booking, Cancha } from '@/types/api'

export default function DashboardPage() {
  const { selectedPredio, predios, loading } = usePredio()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (selectedPredio?.id) {
        setLoadingBookings(true)
        try {
          const [bookingsData, canchasData] = await Promise.all([
            bookingService.getByOwner(selectedPredio.id),
            canchaService.getByPredioId(selectedPredio.id)
          ])
          setBookings(bookingsData || [])
          setCanchas(canchasData || [])
        } catch (error) {
          console.error('Error al obtener datos:', error)
          setBookings([])
          setCanchas([])
        } finally {
          setLoadingBookings(false)
        }
      }
    }

    fetchData()
  }, [selectedPredio?.id])

  if (loading || loadingBookings) {
    return <Loader2 className="h-8 w-8 animate-spin" />
  }

  const totalBookings = bookings.length
  const totalIncome = bookings.reduce((acc, booking) => acc + (booking.price || 0), 0)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {selectedPredio ? selectedPredio.nombre : 'Selecciona un predio'}
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reservas Totales
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
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
            <div className="text-2xl font-bold">${totalIncome}</div>
            <p className="text-xs text-muted-foreground">
              +0% desde el último mes
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
            <div className="text-2xl font-bold">{canchas.length}</div>
            <p className="text-xs text-muted-foreground">
              En {predios?.length} predios
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
              <RecentBookings bookings={bookings} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 