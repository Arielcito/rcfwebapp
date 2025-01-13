'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
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

interface RecentBookingsProps {
  bookings: Booking[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
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
        }
      }
    }
    fetchUser()
  }, [selectedBooking])

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
        No hay reservas recientes
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {bookings
          .sort((a, b) => new Date(b.fechaReserva).getTime() - new Date(a.fechaReserva).getTime())
          .slice(0, 5)
          .map((booking) => (
          <button 
            type="button"
            key={booking.id} 
            className="flex items-center w-full hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors"
            onClick={() => setSelectedBooking(booking)}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {booking.fechaHora.slice(11, 16)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                Reserva para {new Date(booking.fechaHora).toLocaleDateString('es', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.duracion} minutos - ${booking.precioTotal}
              </p>
            </div>
            <div className="ml-auto font-medium">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                booking.estadoPago === 'PENDIENTE' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : booking.estadoPago === 'PAGADO'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.estadoPago}
              </span>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={selectedBooking !== null} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Usuario:</div>
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