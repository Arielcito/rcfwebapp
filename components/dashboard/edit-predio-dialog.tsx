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
import { Separator } from '@/components/ui/separator'
import { AddressAutocomplete } from '@/components/ui/address-autocomplete'

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
    cbu: predio.cbu || '',
    banco: predio.banco || '',
    titularCuenta: predio.titularCuenta || '',
    tipoCuenta: predio.tipoCuenta || '',
    numeroCuenta: predio.numeroCuenta || '',
    latitud: predio.latitud,
    longitud: predio.longitud,
  })

  const handleAddressSelect = (address: {
    direccion: string
    ciudad: string
    provincia: string
    latitud: number
    longitud: number
  }) => {
    setFormData(prev => ({
      ...prev,
      direccion: address.direccion,
      ciudad: address.ciudad,
      provincia: address.provincia,
      latitud: address.latitud,
      longitud: address.longitud,
    }))
  }

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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Predio</DialogTitle>
          <DialogDescription>
            Actualiza los datos de tu predio. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4 px-2">
            <div className="grid grid-cols-2 gap-6">
              {/* Información General */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2 text-primary">Información General</h4>
                <div className="space-y-4">
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
                  <AddressAutocomplete
                    defaultValue={formData.direccion}
                    onSelect={handleAddressSelect}
                  />
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
                </div>
              </div>

              {/* Información Bancaria */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2 text-primary">Información Bancaria</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cbu" className="text-right">CBU</Label>
                    <Input
                      id="cbu"
                      value={formData.cbu}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, cbu: e.target.value }))
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="banco" className="text-right">Banco</Label>
                    <Input
                      id="banco"
                      value={formData.banco}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, banco: e.target.value }))
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="titularCuenta" className="text-right">Titular</Label>
                    <Input
                      id="titularCuenta"
                      value={formData.titularCuenta}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, titularCuenta: e.target.value }))
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tipoCuenta" className="text-right">Tipo de Cuenta</Label>
                    <Input
                      id="tipoCuenta"
                      value={formData.tipoCuenta}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, tipoCuenta: e.target.value }))
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="numeroCuenta" className="text-right">Número de Cuenta</Label>
                    <Input
                      id="numeroCuenta"
                      value={formData.numeroCuenta}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, numeroCuenta: e.target.value }))
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-medium mb-2 text-primary">Horarios de Atención</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="horarioApertura" className="text-right">
                    Apertura
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
                    Cierre
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
            </div>
          </div>
          <DialogFooter className="px-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 