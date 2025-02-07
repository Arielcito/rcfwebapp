import { api } from './api'
import type { 
  CategoriaMovimiento, 
  MovimientoCaja, 
  MovimientoCajaCreationData, 
  MovimientoCajaUpdateData,
  MovimientoStats 
} from '@/types/api'

class MovimientoService {
  async getCategorias(): Promise<CategoriaMovimiento[]> {
    const { data } = await api.get('/movimientos/categorias')
    return data
  }

  async getMovimientos(predioId: string): Promise<MovimientoCaja[]> {
    const { data } = await api.get(`/movimientos/predio/${predioId}`)
    return data
  }

  async getMovimientoStats(predioId: string, desde?: string, hasta?: string): Promise<MovimientoStats> {
    const params = new URLSearchParams()
    if (desde) params.append('desde', desde)
    if (hasta) params.append('hasta', hasta)
    
    const { data } = await api.get(`/movimientos/predio/${predioId}/stats?${params}`)
    return data
  }

  async create(movimiento: MovimientoCajaCreationData): Promise<MovimientoCaja> {
    const { data } = await api.post('/movimientos', movimiento)
    return data
  }

  async update(id: string, movimiento: MovimientoCajaUpdateData): Promise<MovimientoCaja> {
    const { data } = await api.patch(`/movimientos/${id}`, movimiento)
    return data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/movimientos/${id}`)
  }

  async createCategoria(categoria: Omit<CategoriaMovimiento, 'id' | 'activo' | 'createdAt' | 'updatedAt'>): Promise<CategoriaMovimiento> {
    const { data } = await api.post('/movimientos/categorias', categoria)
    return data
  }

  async updateCategoria(id: string, categoria: Partial<CategoriaMovimiento>): Promise<CategoriaMovimiento> {
    const { data } = await api.patch(`/movimientos/categorias/${id}`, categoria)
    return data
  }

  async deleteCategoria(id: string): Promise<void> {
    await api.delete(`/movimientos/categorias/${id}`)
  }
}

export const movimientoService = new MovimientoService() 