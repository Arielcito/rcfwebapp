'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Loader2, Plus } from 'lucide-react'
import { usePredio } from '@/lib/context/PredioContext'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { MovimientoDialog } from './movimiento-dialog'
import type { MovimientoCaja, MovimientoStats } from '@/types/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { movimientoService } from '@/lib/services/api/movimientoService'

export default function MovimientosPage() {
  const { selectedPredio } = usePredio()
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([])
  const [stats, setStats] = useState<MovimientoStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPredio?.id) return
      
      setLoading(true)
      try {
        const [movimientosData, statsData] = await Promise.all([
          movimientoService.getMovimientos(selectedPredio.id),
          movimientoService.getMovimientoStats(selectedPredio.id)
        ])
        
        setMovimientos(movimientosData)
        setStats(statsData)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedPredio?.id])

  if (loading || !selectedPredio) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary-100 to-secondary-100">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary-200 opacity-25"></div>
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 relative z-10" />
        </div>
        <p className="mt-4 text-secondary-600 animate-pulse">Cargando información...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-secondary-800">
          Movimientos de Caja
        </h2>
        <MovimientoDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Movimiento
          </Button>
        </MovimientoDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-700">
              Balance Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-900">
              ${stats?.balance.toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-primary-600">
              Balance actual
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-700">
              Total Ingresos
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-success-DEFAULT" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-900">
              ${stats?.totalIngresos.toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-success-dark">
              Total de ingresos
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-700">
              Total Egresos
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-error-DEFAULT" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-900">
              ${stats?.totalEgresos.toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-error-dark">
              Total de egresos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={movimientos} />
        </CardContent>
      </Card>
    </div>
  )
} 