import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Reservation = {
  id: string
  date: string
  fieldName: string
}

type ReservationListProps = {
  reservations: Reservation[]
}

export function ReservationList({ reservations }: ReservationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        {reservations.length > 0 ? (
          <ul className="space-y-2">
            {reservations.map((reservation) => (
              <li key={reservation.id} className="flex justify-between items-center">
                <span>{reservation.fieldName}</span>
                <span className="text-gray-500">{reservation.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay reservas recientes</p>
        )}
      </CardContent>
    </Card>
  )
}

