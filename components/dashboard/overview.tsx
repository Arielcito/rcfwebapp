'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useEffect, useState } from 'react'
import { bookingService } from '@/lib/services/api/bookingService'
import type { Booking } from '@/types/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function Overview() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingService.getAll()
        setBookings(data)
      } catch (error) {
        console.error('Error al cargar reservas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [])

  const processBookingData = () => {
    const monthCounts = new Array(12).fill(0)
    
    bookings.forEach(booking => {
      const date = new Date(booking.fechaHora)
      const month = date.getMonth()
      monthCounts[month]++
    })

    return monthCounts
  }

  const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Reservas',
        data: processBookingData(),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  }

  if (isLoading) {
    return <div>Cargando datos...</div>
  }

  return <Bar data={data} />
} 