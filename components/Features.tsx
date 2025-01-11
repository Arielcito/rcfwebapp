import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    title: "Gestión de Reservas",
    description: "Administra fácilmente las reservas de tus canchas de fútbol."
  },
  {
    title: "Estadísticas en Tiempo Real",
    description: "Obtén información valiosa sobre el rendimiento de tus canchas."
  },
  {
    title: "Facturación Integrada",
    description: "Genera facturas automáticamente para cada reserva."
  }
]

export function Features() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {features.map((feature, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

