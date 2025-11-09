"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Filter, ChevronDown, Plus, Star } from "lucide-react"

interface DealsFilterBarProps {
  searchTerm: string
  selectedCategory: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSubmitClick: () => void
  showSavedOnly?: boolean
  onSavedToggle?: (show: boolean) => void
}

export function DealsFilterBar({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onSubmitClick,
  showSavedOnly = false,
  onSavedToggle,
}: DealsFilterBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "software", label: "Software" },
    { value: "finance", label: "Finance" },
    { value: "military", label: "Military" },
    { value: "housing", label: "Housing" },
    { value: "travel", label: "Travel" },
    { value: "education", label: "Education" },
    { value: "health", label: "Health" },
    { value: "retail", label: "Retail" },
  ]

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const handleResetFilters = () => {
    onSearchChange("")
    onCategoryChange("all")
    if (onSavedToggle) onSavedToggle(false)
  }

  const handleApplyFilters = () => {
    // Filters are applied in real-time, so this is mainly for mobile UX
    console.log("Filters applied")
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>

        {onSavedToggle && (
          <button
            onClick={() => onSavedToggle(!showSavedOnly)}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
              showSavedOnly
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-[#dc2626] text-[#dc2626]" : "text-gray-400"}`} />
            Saved
          </button>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => handleDropdownToggle("category")}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-700">
                {categories.find((cat) => cat.value === selectedCategory)?.label || "All Categories"}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                activeDropdown === "category" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeDropdown === "category" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    onCategoryChange(category.value)
                    setActiveDropdown(null)
                  }}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedCategory === category.value ? "bg-primary/10 text-primary" : "text-gray-700"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          >
            Apply
          </button>

          <button
            onClick={handleResetFilters}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          >
            Reset
          </button>
        </div>

        {/* Submit Deal Button */}
        <button
          onClick={onSubmitClick}
          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit a Deal
        </button>
      </div>
    </div>
  )
}
