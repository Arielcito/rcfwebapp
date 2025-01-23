'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { bookingService } from '@/lib/services/api/bookingService'
import { usePredio } from '@/lib/context/PredioContext'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { userService, canchaService } from '@/lib/services/api'
import type { User, Cancha, Booking } from '@/types/api'
import esLocale from '@fullcalendar/core/locales/es'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    booking: Booking
    cancha: Cancha | null
    user: User | null
  }
}

export default function CalendarioPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const { selectedPredio } = usePredio()
  const [canchas, setCanchas] = useState<Record<string, Cancha>>({})
  const [users, setUsers] = useState<Record<string, User>>({})

  // Cargar datos necesarios
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const [bookingsData, canchasData, usersData] = await Promise.all([
          bookingService.getAll(),
          canchaService.getAll(),
          userService.getAll()
        ])

        // Crear mapas para búsqueda rápida
        const canchasMap = canchasData.reduce((acc, cancha) => {
          acc[cancha.id] = cancha
          return acc
        }, {} as Record<string, Cancha>)

        const usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = user
          return acc
        }, {} as Record<string, User>)

        setCanchas(canchasMap)
        setUsers(usersMap)
        setBookings(bookingsData)

        // Convertir reservas a eventos del calendario
        const calendarEvents = bookingsData.map((booking: Booking) => {
          const startDate = new Date(booking.fechaHora)
          const endDate = new Date(startDate.getTime() + booking.duracion * 60000)
          const cancha = canchasMap[booking.canchaId]
          const user = usersMap[booking.userId]

          let backgroundColor = '#4CAF50' // Verde para pagado
          if (booking.estadoPago === 'PENDIENTE') {
            backgroundColor = '#FFC107' // Amarillo para pendiente
          } else if (booking.estadoPago === 'CANCELADO') {
            backgroundColor = '#F44336' // Rojo para cancelado
          }

          return {
            id: booking.id,
            title: `${cancha?.nombre || 'Cancha'} - ${user?.name || 'Usuario'}`,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            backgroundColor,
            borderColor: backgroundColor,
            textColor: '#ffffff',
            extendedProps: {
              booking,
              cancha: cancha || null,
              user: user || null
            }
          }
        })

        setEvents(calendarEvents)
      } catch (error) {
        console.error('Error al cargar datos:', error)
        toast.error('Error al cargar los datos del calendario')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Card className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale={esLocale}
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            events={events}
            eventClick={(info) => setSelectedEvent(info.event as unknown as CalendarEvent)}
            height="80vh"
            slotDuration="00:30:00"
            allDaySlot={false}
            nowIndicator={true}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            businessHours={{
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
              startTime: '08:00',
              endTime: '22:00',
            }}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            selectable={true}
            selectConstraint="businessHours"
          />
        </Card>
      </div>

      <Dialog open={selectedEvent !== null} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Cancha:</div>
                <div className="col-span-3">
                  {selectedEvent.extendedProps.cancha?.nombre || 'No disponible'}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Cliente:</div>
                <div className="col-span-3">
                  <div className="space-y-1">
                    <p>{selectedEvent.extendedProps.user?.name || 'No disponible'}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.extendedProps.user?.email || 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Horario:</div>
                <div className="col-span-3">
                  {new Date(selectedEvent.start).toLocaleTimeString('es', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {new Date(selectedEvent.end).toLocaleTimeString('es', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Estado:</div>
                <div className="col-span-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedEvent.extendedProps.booking.estadoPago === 'PENDIENTE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedEvent.extendedProps.booking.estadoPago === 'PAGADO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedEvent.extendedProps.booking.estadoPago}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">Precio:</div>
                <div className="col-span-3">
                  ${selectedEvent.extendedProps.booking.precioTotal}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 