import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold sm:text-6xl">
        Bienvenido a Futbol Manager
      </h1>
      <p className="text-xl text-muted-foreground">
        La mejor plataforma para gestionar tus canchas de fútbol
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/login">
          <Button size="lg">Iniciar sesión</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" size="lg">Registrarse</Button>
        </Link>
      </div>
    </div>
  )
}

