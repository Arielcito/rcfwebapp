import type { Booking } from '@/types/api'
import axiosInstance from '@/lib/axios'

const BASE_URL = '/bookings'

export const bookingService = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get<Booking[]>(BASE_URL)
      return data
    } catch (error) {
      throw new Error('Error al obtener las reservas')
    }
  },

  getByDate: async (date: string) => {
    try {
      const { data } = await axiosInstance.get<Booking[]>(`${BASE_URL}/date/${date}`)
      return data
    } catch (error) {
      throw new Error('Error al obtener las reservas por fecha')
    }
  },

  create: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data } = await axiosInstance.post<Booking>(BASE_URL, booking)
      return data
    } catch (error) {
      throw new Error('Error al crear la reserva')
    }
  },

  update: async (id: string, booking: Partial<Booking>) => {
    try {
      const { data } = await axiosInstance.put<Booking>(`${BASE_URL}/${id}`, booking)
      return data
    } catch (error) {
      throw new Error('Error al actualizar la reserva')
    }
  },

  delete: async (id: string) => {
    try {
      await axiosInstance.delete(`${BASE_URL}/${id}`)
    } catch (error) {
      throw new Error('Error al eliminar la reserva')
    }
  }
} 