'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { movimientoService } from '@/lib/services/api'
import { toast } from 'sonner'
import type { MovimientoCaja, CategoriaMovimiento } from '@/types/api'
import { useRouter } from 'next/navigation'
import { usePredio } from '@/lib/context/PredioContext'
import { format } from 'date-fns'

interface MovimientoDialogProps {
  movimiento?: MovimientoCaja
  children: React.ReactNode
}

const METODOS_PAGO = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'DEBITO', label: 'Débito' },
  { value: 'CREDITO', label: 'Crédito' },
  { value: 'MERCADOPAGO', label: 'Mercado Pago' },
  { value: 'OTRO', label: 'Otro' },
]

export function MovimientoDialog({ movimiento, children }: MovimientoDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categorias, setCategorias] = useState<CategoriaMovimiento[]>([])
  const router = useRouter()
  const { selectedPredio } = usePredio()

  const [formData, setFormData] = useState({
    predioId: selectedPredio?.id || '',
    categoriaId: movimiento?.categoriaId || '',
    concepto: movimiento?.concepto || '',
    monto: movimiento?.monto?.toString() || '',
    tipo: movimiento?.tipo || 'INGRESO',
    metodoPago: movimiento?.metodoPago || 'EFECTIVO',
    fechaMovimiento: movimiento?.fechaMovimiento 
      ? format(new Date(movimiento.fechaMovimiento), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
    notasAdicionales: movimiento?.notasAdicionales || '',
  })

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await movimientoService.getCategorias()
        setCategorias(data)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
        toast.error('Error al cargar las categorías')
      }
    }

    if (open) {
      fetchCategorias()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (movimiento) {
        await movimientoService.update(movimiento.id, {
          ...formData,
          monto: Number(formData.monto),
        })
        toast.success('Movimiento actualizado correctamente')
      } else {
        await movimientoService.create({
          ...formData,
          monto: Number(formData.monto),
        })
        toast.success('Movimiento creado correctamente')
      }
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(movimiento 
        ? 'Error al actualizar el movimiento' 
        : 'Error al crear el movimiento'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {movimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}
          </DialogTitle>
          <DialogDescription>
            {movimiento 
              ? 'Modifica los datos del movimiento. Haz clic en guardar cuando termines.'
              : 'Ingresa los datos del nuevo movimiento. Haz clic en guardar cuando termines.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INGRESO">Ingreso</SelectItem>
                  <SelectItem value="EGRESO">Egreso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoriaId" className="text-right">
                Categoría
              </Label>
              <Select
                value={formData.categoriaId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoriaId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona la categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias
                    .filter((cat) => cat.tipo === formData.tipo)
                    .map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="concepto" className="text-right">
                Concepto
              </Label>
              <Input
                id="concepto"
                value={formData.concepto}
                onChange={(e) => setFormData((prev) => ({ ...prev, concepto: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monto" className="text-right">
                Monto
              </Label>
              <Input
                id="monto"
                type="number"
                value={formData.monto}
                onChange={(e) => setFormData((prev) => ({ ...prev, monto: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metodoPago" className="text-right">
                Método de Pago
              </Label>
              <Select
                value={formData.metodoPago}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, metodoPago: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona el método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {METODOS_PAGO.map((metodo) => (
                    <SelectItem key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaMovimiento" className="text-right">
                Fecha
              </Label>
              <Input
                id="fechaMovimiento"
                type="date"
                value={formData.fechaMovimiento}
                onChange={(e) => setFormData((prev) => ({ ...prev, fechaMovimiento: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notasAdicionales" className="text-right">
                Notas
              </Label>
              <Input
                id="notasAdicionales"
                value={formData.notasAdicionales}
                onChange={(e) => setFormData((prev) => ({ ...prev, notasAdicionales: e.target.value }))}
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