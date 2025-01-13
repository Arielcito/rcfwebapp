'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { Predio } from '@/types/api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { predioService } from '@/lib/services/api'
import { toast } from 'sonner'

export const predioColumns: ColumnDef<Predio>[] = [
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'direccion',
    header: 'Dirección',
  },
  {
    accessorKey: 'fechaRegistro',
    header: 'Fecha de Registro',
    cell: ({ row }) => {
      return new Date(row.getValue('fechaRegistro')).toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const predio = row.original

      const handleDelete = async () => {
        try {
          await predioService.delete(predio.id)
          toast.success('Predio eliminado correctamente')
          // TODO: Refresh data
        } catch (error) {
          toast.error('Error al eliminar el predio')
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