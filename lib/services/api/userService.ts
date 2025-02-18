import type { User } from '@/types/api'
import axiosInstance from '@/lib/axios'
interface RegisterUserData {
  name: string
  email: string
  password: string
  role: string
  telefono: string
}

export const userService = {
  getAll: async () => {
    const response = await axiosInstance.get<User[]>('/api/users')
    return response.data
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<User>(`/api/users/${id}`)
    return response.data
  },

  register: async (userData: RegisterUserData) => {
    const response = await axiosInstance.post<User>('/api/users', userData)
    return response.data
  },

  update: async (id: string, userData: Partial<User>) => {
    const response = await axiosInstance.put<User>(`/api/users/${id}`, userData)
    return response.data
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/api/users/${id}`)
  },

  checkEmail: async (email: string) => {
    const response = await axiosInstance.get<{ exists: boolean }>(`/api/users/check-email/${email}`)
    return response.data
  }
} 