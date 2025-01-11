import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type MonthlyStatsProps = {
  totalReservations: number
  totalRevenue: number
}

export function MonthlyStats({ totalReservations, totalRevenue }: MonthlyStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Mes Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Total de reservas: {totalReservations}</p>
          <p>Ingresos: ${totalRevenue.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

