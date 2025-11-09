"use client"

import { useState, useEffect } from "react"
import { X, Search, ChevronDown, Plus } from "lucide-react"

interface ResourcesMobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedFormat: string
  onFormatChange: (format: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  verifiedOnly: boolean
  onVerifiedChange: (verified: boolean) => void
}

export function ResourcesMobileFilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedFormat,
  onFormatChange,
  sortBy,
  onSortChange,
  verifiedOnly,
  onVerifiedChange,
}: ResourcesMobileFilterDrawerProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const categories = ["All", "Health & Wellness", "Military Discounts", "PCS / VA / Family"]
  const formats = ["All", "Article", "Video", "Tool", "Guide"]
  const sortOptions = [
    { value: "Newest", label: "Newest First" },
    { value: "Most Viewed", label: "Most Viewed" },
  ]

  const applyFilters = () => {
    setActiveDropdown(null)
    onClose()
  }

  const resetFilters = () => {
    onCategoryChange("All")
    onFormatChange("All")
    onSortChange("Newest")
    onVerifiedChange(false)
    setActiveDropdown(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Search & Filter</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "category" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedCategory === category ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {category === "All" ? "All Categories" : category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Format Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "format" ? null : "format")}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{selectedFormat === "All" ? "All Formats" : selectedFormat}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "format" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {formats.map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        onFormatChange(format)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedFormat === format ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {format === "All" ? "All Formats" : format}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "sort" ? null : "sort")}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "sort" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        sortBy === option.value ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Only Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Verified Only</span>
              <button
                onClick={() => onVerifiedChange(!verifiedOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  verifiedOnly ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    verifiedOnly ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 border-t space-y-3">
            <div className="flex gap-3">
              <button
                onClick={applyFilters}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-sm"
              >
                Reset Filters
              </button>
            </div>
            <button
              onClick={() => {
                /* Submit resource functionality */
              }}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Submit Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
