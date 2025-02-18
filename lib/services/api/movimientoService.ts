import type { 
  CategoriaMovimiento, 
  MovimientoCaja, 
  MovimientoCajaCreationData, 
  MovimientoCajaUpdateData,
  MovimientoStats 
} from '@/types/api'

// Datos de ejemplo para categorías
const categoriasDemo: CategoriaMovimiento[] = [
  {
    id: '1',
    nombre: 'Alquiler de Cancha',
    tipo: 'INGRESO',
    descripcion: 'Ingresos por alquiler de canchas',
    activo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Venta de Bebidas',
    tipo: 'INGRESO',
    descripcion: 'Ingresos por venta de bebidas',
    activo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    nombre: 'Mantenimiento',
    tipo: 'EGRESO',
    descripcion: 'Gastos de mantenimiento',
    activo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    nombre: 'Servicios',
    tipo: 'EGRESO',
    descripcion: 'Pago de servicios (luz, agua, etc)',
    activo: true,
    createdAt: new Date().toISOString(),
  }
]

// Datos de ejemplo para movimientos
let movimientosDemo: MovimientoCaja[] = [
  {
    id: '1',
    predioId: '1',
    categoriaId: '1',
    concepto: 'Alquiler Cancha 1',
    monto: 5000,
    tipo: 'INGRESO',
    metodoPago: 'EFECTIVO',
    fechaMovimiento: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    predioId: '1',
    categoriaId: '3',
    concepto: 'Mantenimiento Césped',
    monto: 2500,
    tipo: 'EGRESO',
    metodoPago: 'TRANSFERENCIA',
    fechaMovimiento: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

class MovimientoService {
  async getCategorias(): Promise<CategoriaMovimiento[]> {
    return categoriasDemo
  }

  async getMovimientos(predioId: string): Promise<MovimientoCaja[]> {
    return movimientosDemo.filter(m => m.predioId === predioId)
  }

  async getMovimientoStats(predioId: string): Promise<MovimientoStats> {
    const movimientosPredio = movimientosDemo.filter(m => m.predioId === predioId)
    
    const totalIngresos = movimientosPredio
      .filter(m => m.tipo === 'INGRESO')
      .reduce((sum, m) => sum + m.monto, 0)
    
    const totalEgresos = movimientosPredio
      .filter(m => m.tipo === 'EGRESO')
      .reduce((sum, m) => sum + m.monto, 0)

    const movimientosPorCategoria = categoriasDemo.map(cat => ({
      categoriaId: cat.id,
      categoriaNombre: cat.nombre,
      total: movimientosPredio
        .filter(m => m.categoriaId === cat.id)
        .reduce((sum, m) => sum + m.monto, 0),
      cantidad: movimientosPredio.filter(m => m.categoriaId === cat.id).length
    }))

    const metodosUnicos = Array.from(new Set(movimientosPredio.map(m => m.metodoPago)))
    const movimientosPorMetodoPago = metodosUnicos.map(metodo => ({
      metodoPago: metodo,
      total: movimientosPredio
        .filter(m => m.metodoPago === metodo)
        .reduce((sum, m) => sum + m.monto, 0),
      cantidad: movimientosPredio.filter(m => m.metodoPago === metodo).length
    }))

    return {
      totalIngresos,
      totalEgresos,
      balance: totalIngresos - totalEgresos,
      movimientosPorCategoria,
      movimientosPorMetodoPago
    }
  }

  async create(movimiento: MovimientoCajaCreationData): Promise<MovimientoCaja> {
    const newMovimiento: MovimientoCaja = {
      id: (movimientosDemo.length + 1).toString(),
      ...movimiento,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    movimientosDemo.push(newMovimiento)
    return newMovimiento
  }

  async update(id: string, movimiento: MovimientoCajaUpdateData): Promise<MovimientoCaja> {
    const index = movimientosDemo.findIndex(m => m.id === id)
    if (index === -1) throw new Error('Movimiento no encontrado')

    movimientosDemo[index] = {
      ...movimientosDemo[index],
      ...movimiento,
      updatedAt: new Date().toISOString()
    }

    return movimientosDemo[index]
  }

  async delete(id: string): Promise<void> {
    movimientosDemo = movimientosDemo.filter(m => m.id !== id)
  }

  async createCategoria(categoria: Omit<CategoriaMovimiento, 'id' | 'activo' | 'createdAt' | 'updatedAt'>): Promise<CategoriaMovimiento> {
    const newCategoria: CategoriaMovimiento = {
      id: (categoriasDemo.length + 1).toString(),
      ...categoria,
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    categoriasDemo.push(newCategoria)
    return newCategoria
  }

  async updateCategoria(id: string, categoria: Partial<CategoriaMovimiento>): Promise<CategoriaMovimiento> {
    const index = categoriasDemo.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Categoría no encontrada')

    categoriasDemo[index] = {
      ...categoriasDemo[index],
      ...categoria,
      updatedAt: new Date().toISOString()
    }

    return categoriasDemo[index]
  }

  async deleteCategoria(id: string): Promise<void> {
    const index = categoriasDemo.findIndex(c => c.id === id)
    if (index !== -1) {
      categoriasDemo[index].activo = false
    }
  }
}

export const movimientoService = new MovimientoService() 