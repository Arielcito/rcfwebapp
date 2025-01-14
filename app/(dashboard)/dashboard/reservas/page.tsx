'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { bookingService } from '@/lib/services/api/bookingService'
import { columns } from './columns'
import { usePredio } from '@/lib/context/PredioContext'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { userService } from '@/lib/services/api'
import type { User } from '@/types/api'

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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookingUser, setBookingUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (selectedBooking) {
        try {
          const user = await userService.getById(selectedBooking.userId)
          setBookingUser(user)
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error)
          toast.error('Error al cargar datos del usuario')
        }
      }
    }
    fetchUser()
  }, [selectedBooking])

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
    <>
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
              <DataTable 
                columns={columns} 
                data={bookings} 
                onRowClick={(booking: Booking) => setSelectedBooking(booking)} 
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={selectedBooking !== null} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Datos del cliente:</div>
                <div className="col-span-3">
                  {bookingUser ? (
                    <div className="space-y-1">
                      <p>{bookingUser.name}</p>
                      <p className="text-sm text-muted-foreground">{bookingUser.email}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Cargando datos del usuario...</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Fecha y Hora:</div>
                <div className="col-span-3">
                  {new Date(selectedBooking.fechaHora).toLocaleDateString('es', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Duración:</div>
                <div className="col-span-3">{selectedBooking.duracion} minutos</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Precio:</div>
                <div className="col-span-3">${selectedBooking.precioTotal}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Estado:</div>
                <div className="col-span-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedBooking.estadoPago === 'PENDIENTE' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedBooking.estadoPago === 'PAGADO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedBooking.estadoPago}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Método de Pago:</div>
                <div className="col-span-3">{selectedBooking.metodoPago || 'No especificado'}</div>
              </div>
              {selectedBooking.notasAdicionales && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-semibold">Notas:</div>
                  <div className="col-span-3">{selectedBooking.notasAdicionales}</div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Fecha de Reserva:</div>
                <div className="col-span-3">
                  {new Date(selectedBooking.fechaReserva).toLocaleDateString('es', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 