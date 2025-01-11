import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Bienvenido a Futbol Manager
        </h1>
        <p className="mt-3 text-2xl">
          La mejor plataforma para gestionar tus canchas de fútbol
        </p>
        <div className="flex mt-6">
          <Link href="/login">
            <Button>Iniciar sesión</Button>
          </Link>
          <Link href="/register" className="ml-4">
            <Button variant="outline">Registrarse</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

