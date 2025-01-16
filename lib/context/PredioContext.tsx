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
    console.log('[PredioContext] Iniciando fetchPredios')
    console.log('[PredioContext] Usuario actual:', user?.id)
    
    async function fetchPredios() {
      try {
        setLoading(true)
        setError(null)
        const data = await predioService.getAll()
        console.log('[PredioContext] Predios obtenidos:', data)
        
        if (Array.isArray(data)) {
          setPredios(data)
          if (data.length > 0 && !selectedPredio) {
            const prediosUsuario = data.filter((predio) => predio.usuario_id === user?.id)
            console.log('[PredioContext] Predios filtrados por usuario:', prediosUsuario)
            setSelectedPredio(prediosUsuario[0])
          }
        } else {
          console.error('[PredioContext] Error: datos recibidos no son un array')
          setError('Error al obtener los predios')
          setPredios([])
        }
      } catch (error) {
        console.error('[PredioContext] Error en fetchPredios:', error)
        setError('Error al cargar los predios')
        setPredios([])
      } finally {
        setLoading(false)
        console.log('[PredioContext] Estado final:', { loading: false, prediosCount: predios.length, selectedPredio })
      }
    }

    fetchPredios()
  }, [selectedPredio, user?.id])

  const selectPredio = (predio: Predio) => {
    console.log('[PredioContext] Seleccionando predio:', predio)
    setSelectedPredio(predio)
  }

  const refreshPredios = async () => {
    console.log('[PredioContext] Iniciando refreshPredios')
    setLoading(true)
    setError(null)
    try {
      const data = await predioService.getAll()
      console.log('[PredioContext] Datos actualizados:', data)
      if (Array.isArray(data)) {
        setPredios(data)
      } else {
        console.error('[PredioContext] Error: datos actualizados no son un array')
        setError('Error al obtener los predios')
        setPredios([])
      }
    } catch (error) {
      console.error('[PredioContext] Error en refreshPredios:', error)
      setError('Error al cargar los predios')
      setPredios([])
    } finally {
      setLoading(false)
      console.log('[PredioContext] Refresh completado')
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