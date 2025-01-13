import type { Booking } from '@/types/api'
import axiosInstance from '@/lib/axios'

const BASE_URL = '/reservas'

export const bookingService = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get<Booking[]>(`${BASE_URL}/user/bookings`)
      return data || []
    } catch (error) {
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
  }
} 