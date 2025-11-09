"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { SuggestionList } from "@/components/suggestion-list"

interface Suggestion {
  id: string
  label: string
  type: "city" | "zip" | "address" | "base"
  lat: number
  lng: number
  bbox?: [number, number, number, number]
}

interface AutocompleteSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: Suggestion) => void
  onSubmit: () => void
  placeholder?: string
  className?: string
}

export function AutocompleteSearchBar({
  value,
  onChange,
  onSelect,
  onSubmit,
  placeholder = "Search by base, ZIP, or city",
  className = "",
}: AutocompleteSearchBarProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebouncedValue(value, 250)

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/geo/suggest?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSuggestions(data)
      setIsOpen(data.length > 0)
      setSelectedIndex(-1)
    } catch (error) {
      console.error("Failed to fetch suggestions:", error)
      setSuggestions([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced fetch
  useEffect(() => {
    fetchSuggestions(debouncedQuery)
  }, [debouncedQuery, fetchSuggestions])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter") {
        onSubmit()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        } else {
          onSubmit()
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle suggestion selection
  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.label)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect(suggestion)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true)
    }
  }

  // Handle blur (with delay to allow clicks)
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
      setSelectedIndex(-1)
    }, 150)
  }

  // Clear input
  const handleClear = () => {
    onChange("")
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 hidden md:block" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full md:pl-10 pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          {value && !isLoading && (
            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 transition-colors" type="button">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <SuggestionList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onMouseEnter={setSelectedIndex}
        />
      )}
    </div>
  )
}
