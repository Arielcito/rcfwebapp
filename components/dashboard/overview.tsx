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
import type { Booking } from '@/types/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface OverviewProps {
  selectedYear: string
  bookings: Booking[]
}

export function Overview({ selectedYear, bookings }: OverviewProps) {
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
        label: `Reservas ${selectedYear}`,
        data: processBookingData(),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  }

  return <Bar data={data} />
} 