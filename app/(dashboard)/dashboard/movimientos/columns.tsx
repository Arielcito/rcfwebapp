'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowUpCircle, ArrowDownCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { MovimientoCaja } from '@/types/api'
import { MovimientoDialog } from './movimiento-dialog'
import { movimientoService } from '@/lib/services/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export const columns: ColumnDef<MovimientoCaja>[] = [
  {
    accessorKey: 'fechaMovimiento',
    header: 'Fecha',
    cell: ({ row }) => {
      const fecha = format(new Date(row.getValue('fechaMovimiento')), 'PPP', { locale: es })
      return <div className="font-medium">{fecha}</div>
    },
  },
  {
    accessorKey: 'concepto',
    header: 'Concepto',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.tipo === 'INGRESO' ? (
            <ArrowUpCircle className="h-4 w-4 text-success-DEFAULT" />
          ) : (
            <ArrowDownCircle className="h-4 w-4 text-error-DEFAULT" />
          )}
          <span>{row.getValue('concepto')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ row }) => {
      const monto = Number.parseFloat(row.getValue('monto'))
      const formatted = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
      }).format(monto)

      return (
        <div className={`font-medium ${
          row.original.tipo === 'INGRESO' ? 'text-success-DEFAULT' : 'text-error-DEFAULT'
        }`}>
          {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: 'metodoPago',
    header: 'Método de Pago',
    cell: ({ row }) => {
      const metodoPago = row.getValue('metodoPago') as string
      return (
        <div className="font-medium">
          {metodoPago.charAt(0).toUpperCase() + metodoPago.slice(1).toLowerCase()}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const movimiento = row.original
      const router = useRouter()

      const handleDelete = async () => {
        try {
          await movimientoService.delete(movimiento.id)
          toast.success('Movimiento eliminado correctamente')
          router.refresh()
        } catch (error) {
          toast.error('Error al eliminar el movimiento')
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(movimiento.id)}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <MovimientoDialog movimiento={movimiento}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </MovimientoDialog>
            <DropdownMenuItem 
              className="text-error-DEFAULT focus:text-error-DEFAULT"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 