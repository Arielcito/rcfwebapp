import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getReservations() {
  try {
    const response = await axiosInstance.get('/api/reservations')
    return response.data
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return []
  }
}

async function getMonthlyStats() {
  try {
    const response = await axiosInstance.get('/api/stats/monthly')
    return response.data
  } catch (error) {
    console.error('Error fetching monthly stats:', error)
    return null
  }
}

export default async function Dashboard() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  const [reservations, monthlyStats] = await Promise.all([
    getReservations(),
    getMonthlyStats()
  ])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            {reservations.length > 0 ? (
              <ul>
                {reservations.map((reservation: any) => (
                  <li key={reservation.id}>
                    {reservation.date} - {reservation.fieldName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay reservas recientes</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Datos del Mes Actual</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyStats ? (
              <div>
                <p>Total de reservas: {monthlyStats.totalReservations}</p>
                <p>Ingresos: ${monthlyStats.totalRevenue}</p>
              </div>
            ) : (
              <p>No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

