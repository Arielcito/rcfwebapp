'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { bookingService } from '@/lib/services/api/bookingService'
import { columns } from './columns'
import { usePredio } from '@/lib/context/PredioContext'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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

export default function ReservasPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { selectedPredio } = usePredio()

  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedPredio?.id) {
        setError('Por favor selecciona un predio')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await bookingService.getAll()
        setBookings(data || [])
      } catch (error) {
        console.error('Error al obtener reservas:', error)
        setError('Error al cargar las reservas')
        toast.error('Error al cargar las reservas')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [selectedPredio?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  if (!selectedPredio) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Por favor selecciona un predio para ver las reservas
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Historial de Reservas</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todas las Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay reservas para mostrar
            </div>
          ) : (
            <DataTable columns={columns} data={bookings} />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 