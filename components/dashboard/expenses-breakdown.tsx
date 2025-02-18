import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ExpensesBreakdownProps {
  selectedYear: string
}

const mockData = [
  { name: 'Servicios (Luz/Agua)', value: 280000, color: '#003366' },  // Navy blue
  { name: 'Mantenimiento', value: 220000, color: '#4D94FF' },         // Sky blue
  { name: 'Empleados', value: 450000, color: '#001122' },             // Dark navy
  { name: 'Proveedores', value: 180000, color: '#0066CC' },           // Royal blue
  { name: 'Impuestos', value: 120000, color: '#B3D1FF' },            // Light blue
  { name: 'Marketing', value: 90000, color: '#002D5C' }               // Deep blue
]

export function ExpensesBreakdown({ selectedYear }: ExpensesBreakdownProps) {
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