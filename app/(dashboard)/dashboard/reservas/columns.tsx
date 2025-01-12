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

// TODO: Create booking type
interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  canchaId: string
  userId: string
  status: string
  price: number
  userName: string
  canchaName: string
}

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleDateString()
    },
  },
  {
    accessorKey: 'startTime',
    header: 'Hora Inicio',
  },
  {
    accessorKey: 'endTime',
    header: 'Hora Fin',
  },
  {
    accessorKey: 'userName',
    header: 'Usuario',
  },
  {
    accessorKey: 'canchaName',
    header: 'Cancha',
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    },
  },
  {
    accessorKey: 'price',
    header: 'Precio',
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      return `$${price}`
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const booking = row.original

      const handleDelete = async () => {
        try {
          // TODO: Implement booking deletion
          toast.success('Reserva cancelada correctamente')
          // TODO: Refresh data
        } catch (error) {
          toast.error('Error al cancelar la reserva')
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
              Cancelar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 