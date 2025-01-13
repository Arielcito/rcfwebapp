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
    try {
      const { data } = await axios.get('/api/users')
      return data.users
    } catch (error) {
      throw new Error('Error al obtener usuarios')
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const { data } = await axios.get(`/api/users/${id}`)
      return data.user
    } catch (error) {
      throw new Error('Error al obtener usuario por ID')
    }
  },

  update: async (id: string, userData: UpdateUserData): Promise<User> => {
    try {
      const { data } = await axios.put(`/api/users/${id}`, userData)
      return data
    } catch (error) {
      throw new Error('Error al actualizar usuario')
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/users/${id}`)
    } catch (error) {
      throw new Error('Error al eliminar usuario')
    }
  },

  checkEmail: async (email: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('/api/users/check-email', { email })
      return data
    } catch (error) {
      throw new Error('Error al verificar email')
    }
  }
}

// Predios
export const predioService = {
  getAll: async (): Promise<Predio[]> => {
    try {
      const { data } = await axios.get('/api/predios')
      // Si la respuesta es un array directamente
      if (Array.isArray(data)) {
        return data
      }
      // Si la respuesta está dentro de una propiedad 'predios'
      if (data?.predios && Array.isArray(data.predios)) {
        return data.predios
      }
      // Si no hay datos, retornar array vacío
      return []
    } catch (error) {
      return []
    }
  },

  getById: async (id: string): Promise<Predio> => {
    try {
      const { data } = await axios.get(`/api/predios/${id}`)
      return data.predio
    } catch (error) {
      throw new Error('Error al obtener predio por ID')
    }
  },

  create: async (predioData: CreatePredioData): Promise<Predio> => {
    try {
      const { data } = await axios.post('/api/predios', predioData)
      return data
    } catch (error) {
      throw new Error('Error al crear predio')
    }
  },

  update: async (id: string, predioData: UpdatePredioData): Promise<Predio> => {
    try {
      const { data } = await axios.put(`/api/predios/${id}`, predioData)
      return data
    } catch (error) {
      throw new Error('Error al actualizar predio')
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/predios/${id}`)
    } catch (error) {
      throw new Error('Error al eliminar predio')
    }
  }
}

// Canchas
export const canchaService = {
  getAll: async (): Promise<Cancha[]> => {
    try {
      const { data } = await axios.get('/api/canchas')
      console.log('✅ Canchas obtenidas:', data.canchas.length)
      return data.canchas
    } catch (error) {
      console.error('❌ Error al obtener canchas:', error)
      return []
    }
  },

  getById: async (id: string): Promise<Cancha> => {
    try {
      const { data } = await axios.get(`/api/canchas/${id}`)
      return data.cancha
    } catch (error) {
      throw new Error('Error al obtener cancha por ID')
    }
  },

  getByPredioId: async (predioId: string): Promise<Cancha[]> => {
    try {
      const { data } = await axios.get(`/api/canchas/predio/${predioId}`)
      return data.canchas
    } catch (error) {
      throw new Error('Error al obtener canchas por ID de predio')
    }
  },

  create: async (canchaData: CreateCanchaData): Promise<Cancha> => {
    try {
      const { data } = await axios.post('/api/canchas', canchaData)
      return data
    } catch (error) {
      throw new Error('Error al crear cancha')
    }
  },

  update: async (id: string, canchaData: UpdateCanchaData): Promise<Cancha> => {
    try {
      const { data } = await axios.put(`/api/canchas/${id}`, canchaData)
      return data
    } catch (error) {
      throw new Error('Error al actualizar cancha')
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/canchas/${id}`)
    } catch (error) {
      throw new Error('Error al eliminar cancha')
    }
  }
} 