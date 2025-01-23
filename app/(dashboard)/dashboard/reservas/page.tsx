'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { bookingService } from '@/lib/services/api/bookingService'
import { columns } from './columns'
import { usePredio } from '@/lib/context/PredioContext'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { userService, canchaService } from '@/lib/services/api'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import type { User, Cancha } from '@/types/api'

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

export default function ReservasPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { selectedPredio } = usePredio()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookingUser, setBookingUser] = useState<User | null>(null)
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [newBooking, setNewBooking] = useState({
    userId: '',
    canchaId: '',
    fechaHora: '',
    duracion: 60,
    precioTotal: '',
    estadoPago: 'PENDIENTE',
    metodoPago: 'EFECTIVO',
    notasAdicionales: ''
  })

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
    const fetchCanchas = async () => {
      try {
        const data = await canchaService.getAll()
        setCanchas(data)
      } catch (error) {
        console.error('Error al cargar canchas:', error)
        toast.error('Error al cargar las canchas disponibles')
      }
    }
    fetchCanchas()
  }, [])

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      setError(null)

      try {
        const [bookingsData, canchasData, usersData] = await Promise.all([
          bookingService.getAll(),
          canchaService.getAll(),
          userService.getAll()
        ])

        // Ordenar reservas por fecha, más recientes primero
        const sortedBookings = bookingsData ? [...bookingsData].sort((a, b) => 
          new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
        ) : []
        setBookings(sortedBookings)

        // Crear mapas para búsqueda rápida
        const canchasMap = (canchasData || []).reduce((acc, cancha) => {
          acc[cancha.id] = cancha
          return acc
        }, {} as Record<string, Cancha>)

        const usersMap = (usersData || []).reduce((acc, user) => {
          acc[user.id] = user
          return acc
        }, {} as Record<string, User>)

        // Convertir reservas a eventos del calendario
        const calendarEvents = (bookingsData || []).map((booking: Booking) => {
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
        console.error('Error al obtener reservas:', error)
        setError('Error al cargar las reservas')
        toast.error('Error al cargar las reservas')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await bookingService.update(bookingId, { estadoPago: newStatus })
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, estadoPago: newStatus }
          : booking
      ))
      toast.success('Estado de reserva actualizado')
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      toast.error('Error al actualizar estado de la reserva')
    }
  }

  const handleEmailSearch = async () => {
    if (!userEmail) {
      toast.error('Por favor ingresa un email')
      return
    }

    try {
      const users = await userService.getAll()
      const user = users.find(u => u.email === userEmail)
      
      if (user) {
        setNewBooking(prev => ({ ...prev, userId: user.id }))
        toast.success(`Usuario encontrado: ${user.name}`)
      } else {
        toast.error('Usuario no encontrado')
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error)
      toast.error('Error al buscar usuario')
    }
  }

  const handleCreateBooking = async () => {
    if (!newBooking.userId) {
      toast.error('Por favor busca un usuario válido')
      return
    }
    if (!newBooking.canchaId) {
      toast.error('Por favor selecciona una cancha')
      return
    }

    try {
      const bookingData = {
        ...newBooking,
        fechaReserva: new Date().toISOString(),
        pagoId: null
      }

      const createdBooking = await bookingService.create(bookingData)
      setBookings([createdBooking, ...bookings])
      setShowNewBooking(false)
      toast.success('Reserva creada exitosamente')
    } catch (error) {
      console.error('Error al crear reserva:', error)
      toast.error('Error al crear la reserva')
    }
  }

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

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Historial de Reservas</h2>
          <Button onClick={() => setShowNewBooking(true)} className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" /> Nueva Reserva
          </Button>
        </div>
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList>
            <TabsTrigger value="table">Vista de Tabla</TabsTrigger>
            <TabsTrigger value="calendar">Vista de Calendario</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
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
          </TabsContent>
          <TabsContent value="calendar">
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
                eventClick={(info) => setSelectedBooking(info.event.extendedProps.booking)}
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
          </TabsContent>
        </Tabs>
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
                  <Select
                    value={selectedBooking.estadoPago}
                    onValueChange={(value) => handleUpdateBookingStatus(selectedBooking.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="PAGADO">Pagado</SelectItem>
                      <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
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

      <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nueva Reserva</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userEmail" className="text-right">
                Email Usuario
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="userEmail"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="usuario@email.com"
                />
                <Button 
                  variant="outline" 
                  onClick={handleEmailSearch}
                  className="shrink-0"
                >
                  Buscar
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cancha" className="text-right">
                Cancha
              </Label>
              <Select
                value={newBooking.canchaId}
                onValueChange={(value) => setNewBooking({...newBooking, canchaId: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar cancha" />
                </SelectTrigger>
                <SelectContent>
                  {canchas.map((cancha) => (
                    <SelectItem key={cancha.id} value={cancha.id}>
                      {cancha.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaHora" className="text-right">
                Fecha y Hora
              </Label>
              <Input
                id="fechaHora"
                type="datetime-local"
                className="col-span-3"
                value={newBooking.fechaHora}
                onChange={(e) => setNewBooking({...newBooking, fechaHora: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracion" className="text-right">
                Duración (min)
              </Label>
              <Input
                id="duracion"
                type="number"
                className="col-span-3"
                value={newBooking.duracion}
                onChange={(e) => setNewBooking({...newBooking, duracion: parseInt(e.target.value)})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precioTotal" className="text-right">
                Precio
              </Label>
              <Input
                id="precioTotal"
                type="number"
                className="col-span-3"
                value={newBooking.precioTotal}
                onChange={(e) => setNewBooking({...newBooking, precioTotal: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metodoPago" className="text-right">
                Método de Pago
              </Label>
              <Select
                value={newBooking.metodoPago}
                onValueChange={(value) => setNewBooking({...newBooking, metodoPago: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                  <SelectItem value="TARJETA">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notas" className="text-right">
                Notas
              </Label>
              <Input
                id="notas"
                className="col-span-3"
                value={newBooking.notasAdicionales}
                onChange={(e) => setNewBooking({...newBooking, notasAdicionales: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewBooking(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBooking}>
              Crear Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 