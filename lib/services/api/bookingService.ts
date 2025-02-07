import type { Booking } from '@/types/api'
import axiosInstance from '@/lib/axios'

const BASE_URL = '/api/reservas'

interface FrequentClient {
  userId: string
  totalBookings: number
  totalSpent: number
  lastBooking: Booking
}

export const bookingService = {
  getAll: async () => {
    try {
      const { data: bookings } = await axiosInstance.get(`${BASE_URL}/`)

      return bookings.data || []
    } catch (error) {
      console.error('Error al obtener las reservas:', error)
      return []
    }
  },

  getById: async (id: string) => {
    try {
      const { data } = await axiosInstance.get<{ success: boolean; data: Booking }>(`${BASE_URL}/${id}`)
      return data?.data
    } catch (error) {
      throw new Error('Error al obtener la reserva')
    }
  },

  getByOwner: async (ownerId: string) => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Booking[] }>(`${BASE_URL}/owner/${ownerId}`)
      if (response?.data?.success && Array.isArray(response?.data?.data)) {
        return response.data.data
      }
      return []
    } catch (error) {
      return []
    }
  },

  getByDate: async (date: string, ownerId: string) => {
    try {
      const { data } = await axiosInstance.get<{ success: boolean; data: Booking[] }>(`${BASE_URL}/owner/${date}/${ownerId}`)
      return data?.data || []
    } catch (error) {
      return []
    }
  },

  create: async (bookingData: Omit<Booking, 'id'>) => {
    try {
      const { data } = await axiosInstance.post<{ success: boolean; data: Booking }>(`${BASE_URL}`, bookingData)
      return data?.data
    } catch (error) {
      throw new Error('Error al crear la reserva')
    }
  },

  update: async (id: string, bookingData: Partial<Booking>) => {
    try {
      const { data } = await axiosInstance.put<{ success: boolean; data: Booking }>(`${BASE_URL}/${id}`, bookingData)
      return data?.data
    } catch (error) {
      throw new Error('Error al actualizar la reserva')
    }
  },

  checkAvailability: async (canchaId: string, fechaHora: Date, duracion: number) => {
    try {
      const { data } = await axiosInstance.post<{ success: boolean; data: { disponible: boolean } }>(`${BASE_URL}/check`, {
        canchaId,
        fechaHora,
        duracion
      })
      return data?.data?.disponible || false
    } catch (error) {
      throw new Error('Error al verificar disponibilidad')
    }
  },

  getAvailableTimes: async (fecha: string) => {
    try {
      const { data } = await axiosInstance.post<{ success: boolean; data: { reservedTimes: string[] } }>(`${BASE_URL}/available-times`, { fecha })
      return data?.data?.reservedTimes || []
    } catch (error) {
      return []
    }
  },

  getFrequentClients: async (): Promise<FrequentClient[]> => {
    try {
      const bookings = await bookingService.getAll()
      
      // Agrupar reservas por usuario
      const userBookings = bookings.reduce((acc: Record<string, Booking[]>, booking: Booking) => {
        if (!acc[booking.userId]) {
          acc[booking.userId] = []
        }
        acc[booking.userId].push(booking)
        return acc
      }, {})

      // Calcular estadísticas por usuario
      const frequentClients = Object.entries(userBookings).map(([userId, userBookings]): FrequentClient => ({
        userId,
        totalBookings: userBookings.length,
        totalSpent: userBookings.reduce((sum: number, booking: Booking) => sum + Number(booking.precioTotal), 0),
        lastBooking: userBookings.reduce((latest: Booking, booking: Booking) => 
          new Date(booking.fechaHora) > new Date(latest.fechaHora) ? booking : latest
        , userBookings[0]),
      }))

      // Ordenar por cantidad de reservas (descendente)
      return frequentClients.sort((a, b) => b.totalBookings - a.totalBookings)
    } catch (error) {
      console.error('Error al obtener clientes frecuentes:', error)
      return []
    }
  }
} 