'use client'

import type { Booking } from '@/types/api'

interface RecentBookingsProps {
  bookings: Booking[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="space-y-4">
      {bookings.length > 0 ? (
        bookings.map(booking => (
          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{booking.userName}</p>
              <p className="text-sm text-muted-foreground">{booking.place?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{new Date(booking.appointmentDate).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">{booking.appointmentTime}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No hay reservas recientes</p>
      )}
    </div>
  )
} 