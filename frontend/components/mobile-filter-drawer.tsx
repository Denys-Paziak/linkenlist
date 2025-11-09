"use client"

import { useState, useEffect } from "react"
import { X, Filter, Search, Plus } from "lucide-react"
import { CustomDropdown } from "@/components/custom-dropdown"
import { Button } from "@/components/ui/button"

interface MobileFilterDrawerProps {
  selectedCategory: string
  selectedFormat: string
  sortBy: string
  verifiedOnly: boolean
  onCategoryChange: (value: string) => void
  onFormatChange: (value: string) => void
  onSortChange: (value: string) => void
  onVerifiedChange: (checked: boolean) => void
  onReset: () => void
  categories: string[]
  formats: string[]
  sortOptions: string[]
}

export function MobileFilterDrawer({
  selectedCategory,
  selectedFormat,
  sortBy,
  verifiedOnly,
  onCategoryChange,
  onFormatChange,
  onSortChange,
  onVerifiedChange,
  onReset,
  categories,
  formats,
  sortOptions,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Filter Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          {/* Drawer Content */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <CustomDropdown
                  options={categories}
                  value={selectedCategory}
                  onChange={onCategoryChange}
                  placeholder="All Categories"
                  displayLabels={{
                    All: "All Categories",
                    "Health & Wellness": "Health & Wellness",
                    "Military Discounts": "Military Discounts",
                    "PCS / VA / Family": "PCS / VA / Family",
                  }}
                />

                <CustomDropdown
                  options={formats}
                  value={selectedFormat}
                  onChange={onFormatChange}
                  placeholder="All Formats"
                  displayLabels={{
                    All: "All Formats",
                    Article: "Article",
                    Video: "Video",
                    Tool: "Tool",
                    Guide: "Guide",
                  }}
                />

                <CustomDropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={onSortChange}
                  placeholder="Newest First"
                  displayLabels={{
                    Newest: "Newest First",
                    "Most Viewed": "Most Viewed",
                    "Editor Picks": "Editor Picks",
                  }}
                />
              </div>

              {/* Verified Only Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verified-mobile"
                  checked={verifiedOnly}
                  onChange={(e) => onVerifiedChange(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="verified-mobile" className="ml-2 text-sm text-gray-700">
                  Verified only
                </label>
              </div>

              {/* Apply and Reset Filters Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                >
                  Apply
                </button>

                <button
                  onClick={() => {
                    onReset()
                    setIsOpen(false)
                  }}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                >
                  Reset
                </button>
              </div>

              {/* Submit Resource Button */}
              <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Submit Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
