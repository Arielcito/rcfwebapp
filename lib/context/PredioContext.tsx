'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { predioService } from '@/lib/services/api'
import type { Predio } from '@/types/api'
import { useSession } from 'next-auth/react'

interface PredioContextType {
  predios: Predio[]
  selectedPredio: Predio | null
  loading: boolean
  error: string | null
  selectPredio: (predio: Predio) => void
  refreshPredios: () => Promise<void>
}

const PredioContext = createContext<PredioContextType | undefined>(undefined)

export function PredioProvider({ children }: { children: React.ReactNode }) {
  const [predios, setPredios] = useState<Predio[]>([])
  const [selectedPredio, setSelectedPredio] = useState<Predio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    async function fetchPredios() {
      try {
        setLoading(true)
        setError(null)
        const data = await predioService.getAll()
        if (Array.isArray(data)) {
          setPredios(data)
          // Si hay predios y no hay uno seleccionado, seleccionar el primero
          if (data.length > 0 && !selectedPredio) {
            console.log("user", user?.id)

            setSelectedPredio(data.filter((predio) => predio.usuario_id === user?.id)[0])
          }
        } else {
          setError('Error al obtener los predios')
          setPredios([])
        }
      } catch (error) {
        setError('Error al cargar los predios')
        setPredios([])
      } finally {
        setLoading(false)
      }
    }

    fetchPredios()
  }, [selectedPredio])

  const selectPredio = (predio: Predio) => {
    setSelectedPredio(predio)
  }

  const refreshPredios = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await predioService.getAll()
      if (Array.isArray(data)) {
        setPredios(data)
      } else {
        setError('Error al obtener los predios')
        setPredios([])
      }
    } catch (error) {
      setError('Error al cargar los predios')
      setPredios([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <PredioContext.Provider
      value={{
        predios,
        selectedPredio,
        loading,
        error,
        selectPredio,
        refreshPredios
      }}
    >
      {children}
    </PredioContext.Provider>
  )
}

export function usePredio() {
  const context = useContext(PredioContext)
  if (context === undefined) {
    throw new Error('usePredio debe ser usado dentro de un PredioProvider')
  }
  return context
} 