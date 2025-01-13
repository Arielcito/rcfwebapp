'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { predioService } from '@/lib/services/api'
import { toast } from 'sonner'
import type { Predio } from '@/types/api'
import { useRouter } from 'next/navigation'

interface EditPredioDialogProps {
  predio: Predio
  children: React.ReactNode
}

export function EditPredioDialog({ predio, children }: EditPredioDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre: predio.nombre,
    direccion: predio.direccion,
    ciudad: predio.ciudad,
    provincia: predio.provincia,
    codigoPostal: predio.codigoPostal || '',
    telefono: predio.telefono,
    email: predio.email || '',
    horarioApertura: predio.horarioApertura,
    horarioCierre: predio.horarioCierre,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      await predioService.update(predio.id, formData)
      toast.success('Predio actualizado correctamente')
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error('Error al actualizar el predio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Predio</DialogTitle>
          <DialogDescription>
            Actualiza los datos de tu predio. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nombre: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">
                Dirección
              </Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, direccion: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ciudad" className="text-right">
                Ciudad
              </Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ciudad: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provincia" className="text-right">
                Provincia
              </Label>
              <Input
                id="provincia"
                value={formData.provincia}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, provincia: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigoPostal" className="text-right">
                Código Postal
              </Label>
              <Input
                id="codigoPostal"
                value={formData.codigoPostal}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, codigoPostal: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, telefono: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="horarioApertura" className="text-right">
                Horario Apertura
              </Label>
              <Input
                id="horarioApertura"
                type="time"
                value={formData.horarioApertura}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, horarioApertura: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="horarioCierre" className="text-right">
                Horario Cierre
              </Label>
              <Input
                id="horarioCierre"
                type="time"
                value={formData.horarioCierre}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, horarioCierre: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 