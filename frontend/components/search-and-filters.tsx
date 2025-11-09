"use client"

import { useState, useEffect, useCallback } from "react"
import { LayoutGrid, Map, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AutocompleteSearchBar } from "@/components/autocomplete-search-bar"
import { PropertyFilterBar } from "@/components/property-filter-bar"
import { RealEstateMobileFilterDrawer } from "@/components/realestate-mobile-filter-drawer"
import { useUrlState } from "@/hooks/use-url-state"

interface Suggestion {
  id: string
  label: string
  type: "city" | "zip" | "address" | "base"
  lat: number
  lng: number
  bbox?: [number, number, number, number]
}

interface SearchAndFiltersProps {
  onFiltersChange: (filters: any) => void
  viewMode: "grid" | "map"
  onViewModeChange: (mode: "grid" | "map") => void
  mapPropertyCount: number
}

export function SearchAndFilters({
  onFiltersChange,
  viewMode,
  onViewModeChange,
  mapPropertyCount,
}: SearchAndFiltersProps) {
  const { getParam, setParam, setParams } = useUrlState()
  const [draftSearchQuery, setDraftSearchQuery] = useState("")
  const [selectedListingType, setSelectedListingType] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      const urlQuery = getParam("q")
      const urlType = getParam("type")

      setDraftSearchQuery(urlQuery)
      setSelectedListingType(urlType === "sale" ? "Buy" : urlType === "rent" ? "Rent" : "")
      setIsInitialized(true)
    }
  }, [isInitialized, getParam])

  const handleSearchChange = (value: string) => {
    setDraftSearchQuery(value)
    // Don't update URL while typing
  }

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    // Update URL immediately when suggestion is selected
    const params: Record<string, string> = {
      q: suggestion.label,
      q_type: suggestion.type,
    }

    if (suggestion.lat && suggestion.lng) {
      params.lat = suggestion.lat.toString()
      params.lng = suggestion.lng.toString()
    }

    if (suggestion.bbox) {
      params.bbox = suggestion.bbox.join(",")
    }

    setParams(params, false) // Use push for selection
    triggerFiltersChange()
  }

  const handleSearchSubmit = () => {
    // Update URL when search button is clicked or Enter is pressed
    setParam("q", draftSearchQuery, false) // Use push for submit
    triggerFiltersChange()
  }

  const handleListingTypeChange = (type: string) => {
    setSelectedListingType(type)
    const urlType = type === "Buy" ? "sale" : type === "Rent" ? "rent" : ""
    setParam("type", urlType, true) // Use replace for filters
    triggerFiltersChange()
  }

  const handleFiltersChange = (filters: any) => {
    const urlParams: Record<string, string> = {}

    if (filters.forSale) {
      if (filters.forSale === "For Sale") {
        urlParams.type = "sale"
      } else if (filters.forSale === "For Rent") {
        urlParams.type = "rent"
      } else if (filters.forSale === "Inactive") {
        urlParams.type = "inactive"
      }
    }

    // Map filter values to URL params
    if (filters.bedrooms && filters.bedrooms !== "Any") {
      urlParams.beds = filters.bedrooms.replace("+", "")
    }
    if (filters.bathrooms && filters.bathrooms !== "Any") {
      urlParams.baths = filters.bathrooms.replace("+", "")
    }
    if (filters.priceMin) {
      urlParams.price_min = filters.priceMin
    }
    if (filters.priceMax) {
      urlParams.price_max = filters.priceMax
    }
    if (filters.sortBy && filters.sortBy !== "recommended") {
      urlParams.sort = filters.sortBy
    }

    setParams(urlParams, true) // Use replace for filters
    triggerFiltersChange()
  }

  const triggerFiltersChange = useCallback(() => {
    const params = {
      q: getParam("q"),
      q_type: getParam("q_type"),
      lat: getParam("lat"),
      lng: getParam("lng"),
      bbox: getParam("bbox"),
      beds: getParam("beds"),
      baths: getParam("baths"),
      price_min: getParam("price_min"),
      price_max: getParam("price_max"),
      type: getParam("type"),
      sort: getParam("sort"),
    }
    onFiltersChange(params)
  }, [getParam, onFiltersChange])

  return (
    <>
      {/* Fixed Filter Bar */}
      <div className="sticky top-[56px] z-[999] bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="w-full px-3 py-2 md:px-4 md:py-3">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="flex items-center gap-2">
              {/* Search Bar with magnifying glass icon */}
              <div className="relative flex-1">
                <AutocompleteSearchBar
                  value={draftSearchQuery}
                  onChange={handleSearchChange}
                  onSelect={handleSuggestionSelect}
                  onSubmit={handleSearchSubmit}
                  placeholder="Search by base, ZIP, or city"
                  className="flex-1 pr-10"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#003366] text-white rounded-lg hover:bg-[#003366]/90 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <AutocompleteSearchBar
                  value={draftSearchQuery}
                  onChange={handleSearchChange}
                  onSelect={handleSuggestionSelect}
                  onSubmit={handleSearchSubmit}
                  placeholder="Search by base, ZIP, or city"
                  className="w-80"
                />
                <Button
                  onClick={handleSearchSubmit}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium"
                >
                  Search
                </Button>
              </div>

              <PropertyFilterBar onFiltersChange={handleFiltersChange} />
            </div>

            <div className="hidden xl:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewModeChange("map")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  viewMode === "map"
                    ? "bg-white border-gray-300 text-gray-700 shadow-sm"
                    : "bg-transparent border-transparent text-gray-600 hover:bg-white hover:text-gray-700"
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white border-gray-300 text-gray-700 shadow-sm"
                    : "bg-transparent border-transparent text-gray-600 hover:bg-white hover:text-gray-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Map Toggle Button for Mobile */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <Button
          onClick={() => onViewModeChange(viewMode === "map" ? "grid" : "map")}
          className="flex items-center gap-2 px-6 py-3 bg-[#002244] hover:bg-[#002244]/90 text-white rounded-lg shadow-lg border-0 text-sm font-medium"
        >
          {viewMode === "map" ? (
            <>
              <LayoutGrid className="w-4 h-4" />
              List
              {mapPropertyCount > 0 && (
                <span className="bg-white text-[#002244] text-xs font-bold px-2 py-1 rounded-full ml-1">
                  {mapPropertyCount}
                </span>
              )}
            </>
          ) : (
            <>
              <Map className="w-4 h-4" />
              Map
            </>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      <RealEstateMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        onFiltersChange={handleFiltersChange}
      />
    </>
  )
}
