'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, CalendarDays, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Overview } from '@/components/dashboard/overview'
import { RecentBookings } from '@/components/dashboard/recent-bookings'
import { usePredio } from '@/lib/context/PredioContext'
import { bookingService } from '@/lib/services/api/bookingService'
import { canchaService } from '@/lib/services/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Cancha } from '@/types/api'

interface Booking {
  id: string
  canchaId: string
  userId: string
  fechaHora: string
  duracion: number
  precioTotal: string
  estadoPago: string
  metodoPago: string
  fechaReserva: string
  notasAdicionales: string
  pagoId: string | null
}

export default function DashboardPage() {
  const { selectedPredio, predios, loading, selectPredio } = usePredio()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [hasSelectedInitialPredio, setHasSelectedInitialPredio] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const years = Array.from(
    { length: 5 },
    (_, i) => (new Date().getFullYear() - 2 + i).toString()
  )

  // Efecto para la selección inicial del predio
  useEffect(() => {
    console.log('Estado actual:', {
      loading,
      prediosLength: predios?.length,
      selectedPredio: selectedPredio?.id,
      hasSelectedInitialPredio
    })

    if (!loading && predios?.length > 0 && !selectedPredio && !hasSelectedInitialPredio) {
      console.log('Seleccionando predio inicial:', predios[0])
      setHasSelectedInitialPredio(true)
      selectPredio(predios[0])
    }
  }, [loading, predios, selectedPredio, hasSelectedInitialPredio])

  // Efecto para cargar datos
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPredio?.id) {
        console.log('No hay predio seleccionado, saltando fetchData')
        return
      }

      console.log('Iniciando fetchData para predio:', selectedPredio.id)
      setLoadingBookings(true)
      
      try {
        const [bookingsData, canchasData] = await Promise.all([
          bookingService.getAll(),
          canchaService.getAll()
        ])

        console.log('Datos obtenidos:', {
          bookingsCount: bookingsData?.length,
          canchasCount: canchasData?.length
        })

        setBookings(bookingsData || [])
        setCanchas(canchasData.filter((cancha) => cancha.predioId === selectedPredio.id) || [])
      } catch (error) {
        console.error('Error al obtener datos:', error)
        setBookings([])
        setCanchas([])
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchData()
  }, [selectedPredio?.id])

  // Efecto para filtrar bookings por año
  useEffect(() => {
    const filtered = bookings.filter(booking => {
      const bookingYear = new Date(booking.fechaHora).getFullYear().toString()
      return bookingYear === selectedYear
    })
    setFilteredBookings(filtered)
  }, [bookings, selectedYear])

  // Mostrar pantalla de carga mientras se obtienen los datos iniciales
  if (loading || loadingBookings || !selectedPredio) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary-100 to-secondary-100">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary-200 opacity-25"></div>
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 relative z-10" />
        </div>
        <p className="mt-4 text-secondary-600 animate-pulse">Cargando información...</p>
      </div>
    )
  }

  const totalBookings = filteredBookings?.length || 0

  const totalIncome = filteredBookings?.reduce((acc, booking) => {
    const precio = Number.parseFloat(booking.precioTotal) || 0
    return acc + precio
  }, 0) || 0

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-secondary-800 animate-fade-in">
          {selectedPredio.nombre}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const currentYear = parseInt(selectedYear)
              const minYear = new Date().getFullYear() - 2
              if (currentYear > minYear) {
                setSelectedYear((currentYear - 1).toString())
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const currentYear = parseInt(selectedYear)
              const maxYear = new Date().getFullYear() + 2
              if (currentYear < maxYear) {
                setSelectedYear((currentYear + 1).toString())
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-700">
              Reservas Totales
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-900">{totalBookings}</div>
            <p className="text-xs text-primary-600">
              En {selectedYear}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-700">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success-DEFAULT" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-900">
              ${totalIncome.toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-success-dark">
              En {selectedYear}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-700">
              Canchas Activas
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-info-DEFAULT" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-900">{canchas.length}</div>
            <p className="text-xs text-info-dark">
              En {predios?.length || 0} predios
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-secondary-800">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            }>
              <Overview selectedYear={selectedYear} bookings={filteredBookings} />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-secondary-800">Reservas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            }>
              <RecentBookings bookings={filteredBookings} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 