import { Suspense } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

// TODO: Create booking service and types
const mockBookings = [
  {
    id: '1',
    date: new Date().toISOString(),
    startTime: '18:00',
    endTime: '19:00',
    canchaId: '1',
    userId: '1',
    status: 'CONFIRMED',
    price: 1000,
    userName: 'John Doe',
    canchaName: 'Cancha 1'
  }
]

export default async function BookingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reservas</h2>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </Card>
            <Card className="col-span-3">
              <div className="p-4">
                <h3 className="text-lg font-medium">Reservas del día</h3>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Selecciona un día para ver las reservas
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="list">
          <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
            <DataTable columns={columns} data={mockBookings} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
} 