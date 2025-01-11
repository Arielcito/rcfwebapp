import Link from 'next/link'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Futbol Manager
          </Link>
          <div className="space-x-4">
            <Link href="/login" className="text-blue-600 hover:underline">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-blue-600 hover:underline">
              Registrarse
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          © 2023 Futbol Manager. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

