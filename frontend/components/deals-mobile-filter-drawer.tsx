"use client"

import { useEffect } from "react"
import { X, Search, Plus } from "lucide-react"

interface DealsMobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  searchTerm: string
  selectedCategory: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onReset: () => void
  onSubmitClick: () => void
}

export function DealsMobileFilterDrawer({
  isOpen,
  onClose,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onReset,
  onSubmitClick,
}: DealsMobileFilterDrawerProps) {
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Search Bar */}
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Apply and Reset Filters Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
            >
              Apply Filters
            </button>

            <button
              onClick={() => {
                onReset()
                onClose()
              }}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>

          {/* Submit Deal Button */}
          <button
            onClick={() => {
              onSubmitClick()
              onClose()
            }}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Submit Deal
          </button>
        </div>
      </div>
    </div>
  )
}
