import { User } from '@/types/api'
import { api } from './api'

interface RegisterUserData {
  name: string
  email: string
  password: string
  role: string
  telefono: string
}

export const userService = {
  getAll: async () => {
    const response = await api.get<User[]>('/api/users')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<User>(`/api/users/${id}`)
    return response.data
  },

  register: async (userData: RegisterUserData) => {
    const response = await api.post<User>('/api/users', userData)
    return response.data
  },

  update: async (id: string, userData: Partial<User>) => {
    const response = await api.put<User>(`/api/users/${id}`, userData)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/api/users/${id}`)
  },

  checkEmail: async (email: string) => {
    const response = await api.get<{ exists: boolean }>(`/api/users/check-email/${email}`)
    return response.data
  }
} 