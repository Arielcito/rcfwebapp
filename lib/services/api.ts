import axios from '@/lib/axios'
import type {
  User,
  Predio,
  Cancha,
  CreatePredioData,
  UpdatePredioData,
  CreateCanchaData,
  UpdateCanchaData,
  UpdateUserData
} from '@/types/api'

// Users
export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await axios.get('/api/users')
    return data.users
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await axios.get(`/api/users/${id}`)
    return data.user
  },

  update: async (id: string, userData: UpdateUserData): Promise<User> => {
    const { data } = await axios.put(`/api/users/${id}`, userData)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/users/${id}`)
  },

  checkEmail: async (email: string): Promise<boolean> => {
    const { data } = await axios.post('/api/users/check-email', { email })
    return data
  }
}

// Predios
export const predioService = {
  getAll: async (): Promise<Predio[]> => {
    const { data } = await axios.get('/api/predios')
    return data.predios
  },

  getById: async (id: string): Promise<Predio> => {
    const { data } = await axios.get(`/api/predios/${id}`)
    return data.predio
  },

  create: async (predioData: CreatePredioData): Promise<Predio> => {
    const { data } = await axios.post('/api/predios', predioData)
    return data
  },

  update: async (id: string, predioData: UpdatePredioData): Promise<Predio> => {
    const { data } = await axios.put(`/api/predios/${id}`, predioData)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/predios/${id}`)
  }
}

// Canchas
export const canchaService = {
  getAll: async (): Promise<Cancha[]> => {
    const { data } = await axios.get('/api/canchas')
    return data.canchas
  },

  getById: async (id: string): Promise<Cancha> => {
    const { data } = await axios.get(`/api/canchas/${id}`)
    return data.cancha
  },

  getByPredioId: async (predioId: string): Promise<Cancha[]> => {
    const { data } = await axios.get(`/api/canchas/predio/${predioId}`)
    return data.canchas
  },

  create: async (canchaData: CreateCanchaData): Promise<Cancha> => {
    const { data } = await axios.post('/api/canchas', canchaData)
    return data
  },

  update: async (id: string, canchaData: UpdateCanchaData): Promise<Cancha> => {
    const { data } = await axios.put(`/api/canchas/${id}`, canchaData)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/canchas/${id}`)
  }
} 