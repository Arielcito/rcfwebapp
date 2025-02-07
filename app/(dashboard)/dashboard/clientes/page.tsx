'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { bookingService } from '@/lib/services/api/bookingService'
import { userService } from '@/lib/services/api'
import { Loader2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import * as XLSX from 'xlsx'

interface FrequentClient {
  userId: string
  totalBookings: number
  totalSpent: number
  lastBooking: any
  userData?: {
    name: string
    email: string
    telefono: string
  }
}

export default function ClientesPage() {
  const [clients, setClients] = useState<FrequentClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const frequentClients = await bookingService.getFrequentClients()
        
        // Obtener información de usuario para cada cliente
        const clientsWithUserData = await Promise.all(
          frequentClients.map(async (client) => {
            try {
              const userData = await userService.getById(client.userId)
              return {
                ...client,
                userData: {
                  name: userData.name,
                  email: userData.email,
                  telefono: userData.telefono
                }
              }
            } catch (error) {
              console.error(`Error al obtener datos del usuario ${client.userId}:`, error)
              return client
            }
          })
        )

        setClients(clientsWithUserData)
      } catch (error) {
        console.error('Error al cargar clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleExportToExcel = () => {
    const data = clients.map(client => ({
      'Nombre': client.userData?.name || 'N/A',
      'Email': client.userData?.email || 'N/A',
      'Teléfono': client.userData?.telefono || 'N/A',
      'Total Reservas': client.totalBookings,
      'Total Gastado': `$${client.totalSpent.toFixed(2)}`,
      'Última Reserva': format(new Date(client.lastBooking.fechaHora), 'dd/MM/yyyy HH:mm', { locale: es })
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes Frecuentes')
    XLSX.writeFile(wb, 'clientes-frecuentes.xlsx')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clientes Frecuentes</h2>
        <Button onClick={handleExportToExcel} className="bg-primary hover:bg-primary-dark">
          <Download className="mr-2 h-4 w-4" /> Exportar a Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Total Reservas</TableHead>
                <TableHead className="text-right">Total Gastado</TableHead>
                <TableHead>Última Reserva</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.userId}>
                  <TableCell className="font-medium">{client.userData?.name || 'N/A'}</TableCell>
                  <TableCell>{client.userData?.email || 'N/A'}</TableCell>
                  <TableCell>{client.userData?.telefono || 'N/A'}</TableCell>
                  <TableCell className="text-right">{client.totalBookings}</TableCell>
                  <TableCell className="text-right">${client.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    {format(new Date(client.lastBooking.fechaHora), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 