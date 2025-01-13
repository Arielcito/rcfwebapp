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
import { canchaService } from '@/lib/services/api'
import { toast } from 'sonner'
import type { Cancha, CreateCanchaData } from '@/types/api'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EditCanchaDialogProps {
  cancha?: Cancha
  predioId: string
  children: React.ReactNode
}

const tiposSuperficie = [
  'Césped natural',
  'Césped sintético',
  'Cemento',
  'Parquet',
  'Tierra',
]

export function EditCanchaDialog({ cancha, predioId, children }: EditCanchaDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<CreateCanchaData>({
    nombre: cancha?.nombre || '',
    predioId: predioId,
    tipo: cancha?.tipo || null,
    capacidadJugadores: cancha?.capacidadJugadores || null,
    tipoSuperficie: cancha?.tipoSuperficie || null,
    tieneIluminacion: cancha?.tieneIluminacion || false,
    esTechada: cancha?.esTechada || false,
    precioPorHora: cancha?.precioPorHora || '',
    requiereSeña: cancha?.requiereSeña || false,
    montoSeña: cancha?.montoSeña || 0,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (cancha) {
        await canchaService.update(cancha.id, formData)
        toast.success('Cancha actualizada correctamente')
      } else {
        await canchaService.create(formData)
        toast.success('Cancha creada correctamente')
      }
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(cancha ? 'Error al actualizar la cancha' : 'Error al crear la cancha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{cancha ? 'Editar' : 'Nueva'} Cancha</DialogTitle>
          <DialogDescription>
            {cancha ? 'Actualiza los datos de la cancha' : 'Agrega una nueva cancha'}. Haz clic en guardar cuando termines.
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
              <Label htmlFor="capacidadJugadores" className="text-right">
                Capacidad
              </Label>
              <Input
                id="capacidadJugadores"
                type="number"
                value={formData.capacidadJugadores || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, capacidadJugadores: parseInt(e.target.value) || null }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoSuperficie" className="text-right">
                Superficie
              </Label>
              <Select
                value={formData.tipoSuperficie || ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tipoSuperficie: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposSuperficie.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precioPorHora" className="text-right">
                Precio/Hora
              </Label>
              <Input
                id="precioPorHora"
                type="number"
                value={formData.precioPorHora}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, precioPorHora: e.target.value }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Iluminación</Label>
              <div className="col-span-3">
                <Switch
                  checked={formData.tieneIluminacion}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, tieneIluminacion: checked }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Techada</Label>
              <div className="col-span-3">
                <Switch
                  checked={formData.esTechada}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, esTechada: checked }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Requiere Seña</Label>
              <div className="col-span-3">
                <Switch
                  checked={formData.requiereSeña}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, requiereSeña: checked }))
                  }
                />
              </div>
            </div>

            {formData.requiereSeña && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="montoSeña" className="text-right">
                  Monto Seña
                </Label>
                <Input
                  id="montoSeña"
                  type="number"
                  value={formData.montoSeña}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, montoSeña: parseInt(e.target.value) || 0 }))
                  }
                  className="col-span-3"
                />
              </div>
            )}
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