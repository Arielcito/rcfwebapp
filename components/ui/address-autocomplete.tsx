'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from './input'
import { Label } from './label'

interface AddressAutocompleteProps {
  onSelect: (address: {
    direccion: string
    ciudad: string
    provincia: string
    latitud: number
    longitud: number
  }) => void
  defaultValue?: string
  label?: string
  className?: string
}

export function AddressAutocomplete({ onSelect, defaultValue = '', label, className }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(defaultValue)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!inputRef.current) return

    const options = {
      componentRestrictions: { country: 'AR' },
      fields: ['address_components', 'geometry', 'formatted_address'],
    }

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    )

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      
      if (!place?.address_components) return

      let direccion = place.formatted_address || ''
      let ciudad = ''
      let provincia = ''
      let latitud = place.geometry?.location?.lat() || 0
      let longitud = place.geometry?.location?.lng() || 0

      // Extraer ciudad y provincia de los componentes de la dirección
      place.address_components.forEach((component) => {
        const types = component.types

        if (types.includes('locality')) {
          ciudad = component.long_name
        }
        
        if (types.includes('administrative_area_level_1')) {
          provincia = component.long_name
        }
      })

      setValue(direccion)
      onSelect({
        direccion,
        ciudad,
        provincia,
        latitud,
        longitud
      })
    })

    return () => {
      if (google.maps.event) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current!)
      }
    }
  }, [onSelect])

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="direccion" className="text-right">
        {label || 'Dirección'}
      </Label>
      <Input
        ref={inputRef}
        type="text"
        id="direccion"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`col-span-3 ${className}`}
        placeholder="Buscar dirección..."
      />
    </div>
  )
} 