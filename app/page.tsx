import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center mt-16">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="RCF Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold">
            Bienvenido a RCF
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
    </>
  )
}

