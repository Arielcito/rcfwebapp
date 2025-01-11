'use client'

export function RecentBookings() {
  // TODO: Replace with real data from booking service
  const bookings = [
    {
      id: '1',
      date: new Date().toLocaleDateString(),
      time: '18:00',
      userName: 'John Doe',
      canchaName: 'Cancha 1'
    }
  ]

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{booking.userName}</p>
            <p className="text-sm text-muted-foreground">{booking.canchaName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{booking.date}</p>
            <p className="text-sm text-muted-foreground">{booking.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 