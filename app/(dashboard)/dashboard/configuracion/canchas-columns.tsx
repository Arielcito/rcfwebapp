'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { Cancha } from '@/types/api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { canchaService } from '@/lib/services/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { EditCanchaDialog } from '@/components/dashboard/edit-cancha-dialog'

export const canchaColumns: ColumnDef<Cancha>[] = [
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'tipoSuperficie',
    header: 'Superficie',
    cell: ({ row }) => {
      const superficie = row.getValue('tipoSuperficie') as string | null
      return superficie || 'No especificada'
    }
  },
  {
    accessorKey: 'capacidadJugadores',
    header: 'Capacidad',
    cell: ({ row }) => {
      const capacidad = row.getValue('capacidadJugadores') as number | null
      return capacidad ? `${capacidad} jugadores` : 'No especificada'
    }
  },
  {
    accessorKey: 'precioPorHora',
    header: 'Precio/Hora',
    cell: ({ row }) => {
      const precio = row.getValue('precioPorHora') as string
      return `$${precio}`
    }
  },
  {
    accessorKey: 'caracteristicas',
    header: 'Características',
    cell: ({ row }) => {
      const cancha = row.original
      const caracteristicas = []

      if (cancha.tieneIluminacion) caracteristicas.push('Iluminada')
      if (cancha.esTechada) caracteristicas.push('Techada')
      if (cancha.requiereSeña) caracteristicas.push('Requiere seña')

      return (
        <div className="flex flex-wrap gap-1">
          {caracteristicas.map((caract) => (
            <Badge key={caract} variant="outline" className="text-xs">
              {caract}
            </Badge>
          ))}
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter()
      const cancha = row.original

      const handleDelete = async () => {
        try {
          await canchaService.delete(cancha.id)
          toast.success('Cancha eliminada correctamente')
          router.refresh()
        } catch (error) {
          toast.error('Error al eliminar la cancha')
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
            <EditCanchaDialog cancha={cancha} predioId={cancha.predioId}>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </EditCanchaDialog>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
] 