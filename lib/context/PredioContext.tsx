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
  const [hasInitialized, setHasInitialized] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    if (!user?.id || hasInitialized) return

    async function fetchPredios() {
      try {
        setLoading(true)
        setError(null)
        const data = await predioService.getAll()
        
        if (Array.isArray(data)) {
          setPredios(data)
          if (data.length > 0) {
            const prediosUsuario = data.filter((predio) => predio.usuario_id === user?.id)
            if (prediosUsuario.length > 0) {
              setSelectedPredio(prediosUsuario[0])
            }
          }
        } else {
          setError('Error al obtener los predios')
          setPredios([])
        }
      } catch (error) {
        console.error('Error en fetchPredios:', error)
        setError('Error al cargar los predios')
        setPredios([])
      } finally {
        setLoading(false)
        setHasInitialized(true)
      }
    }

    fetchPredios()
  }, [user?.id, hasInitialized])

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
      console.error('Error en refreshPredios:', error)
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