import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface IncomeBreakdownProps {
  selectedYear: string
}

const mockData = [
  { name: 'Reservas de Canchas', value: 850000, color: '#00CC44' },  // Primary green
  { name: 'Venta de Productos', value: 320000, color: '#006622' },   // Dark green
  { name: 'Eventos Especiales', value: 180000, color: '#4DFF95' },   // Light mint
  { name: 'Alquiler de Equipos', value: 90000, color: '#009933' },   // Forest green
  { name: 'Otros Ingresos', value: 45000, color: '#B3FFD1' }        // Pale green
]

export function IncomeBreakdown({ selectedYear }: IncomeBreakdownProps) {
  const total = mockData.reduce((sum, item) => sum + item.value, 0)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={mockData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name} ($${(value / 1000).toFixed(1)}k)`}
        >
          {mockData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
} 