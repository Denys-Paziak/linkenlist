"use client"

import { useEffect, useRef } from "react"
import { MapPin, Building, Hash, Shield } from "lucide-react"

interface Suggestion {
  id: string
  label: string
  type: "city" | "zip" | "address" | "base"
  lat: number
  lng: number
  bbox?: [number, number, number, number]
}

interface SuggestionListProps {
  suggestions: Suggestion[]
  selectedIndex: number
  onSelect: (suggestion: Suggestion) => void
  onMouseEnter: (index: number) => void
}

const typeIcons = {
  city: MapPin,
  zip: Hash,
  address: Building,
  base: Shield,
}

export function SuggestionList({ suggestions, selectedIndex, onSelect, onMouseEnter }: SuggestionListProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div
      ref={listRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 mt-1"
    >
      {suggestions.map((suggestion, index) => {
        const Icon = typeIcons[suggestion.type]
        const isSelected = selectedIndex === index
        return (
          <button
            key={suggestion.id}
            data-index={index}
            className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0 ${
              isSelected ? "bg-[#003366]/10 border-r-2 border-r-[#003366]" : "hover:bg-gray-50"
            }`}
            onClick={() => onSelect(suggestion)}
            onMouseEnter={() => onMouseEnter(index)}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-[#003366]" : "text-gray-500"}`} />
            <span className={`text-sm ${isSelected ? "text-[#003366] font-medium" : "text-gray-900"}`}>
              {suggestion.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
