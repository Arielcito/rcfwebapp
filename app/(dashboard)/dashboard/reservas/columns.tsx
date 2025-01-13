'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'

interface Booking {
  id: string
  canchaId: string
  userId: string
  fechaHora: string
  duracion: number
  precioTotal: string
  estadoPago: string
  metodoPago: string
  fechaReserva: string
  notasAdicionales: string
  pagoId: string | null
}

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'fechaHora',
    header: 'Fecha y Hora',
    cell: ({ row }) => {
      return new Date(row.getValue('fechaHora')).toLocaleDateString('es', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
  },
  {
    accessorKey: 'duracion',
    header: 'Duración',
    cell: ({ row }) => {
      return `${row.getValue('duracion')} minutos`
    },
  },
  {
    accessorKey: 'precioTotal',
    header: 'Precio',
    cell: ({ row }) => {
      return `$${row.getValue('precioTotal')}`
    },
  },
  {
    accessorKey: 'estadoPago',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.getValue('estadoPago') as string
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          estado === 'PENDIENTE' 
            ? 'bg-yellow-100 text-yellow-800'
            : estado === 'PAGADO'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {estado}
        </span>
      )
    },
  },
  {
    accessorKey: 'metodoPago',
    header: 'Método de Pago',
  },
  {
    accessorKey: 'notasAdicionales',
    header: 'Notas',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const booking = row.original

      const handleDelete = async () => {
        try {
          // await bookingService.delete(booking.id)
          toast.success('Reserva eliminada correctamente')
        } catch (error) {
          toast.error('Error al eliminar la reserva')
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
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 