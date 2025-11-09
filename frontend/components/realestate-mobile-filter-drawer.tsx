"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"

interface RealEstateMobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: any) => void
}

export function RealEstateMobileFilterDrawer({ isOpen, onClose, onFiltersChange }: RealEstateMobileFilterDrawerProps) {
  const [selectedListingType, setSelectedListingType] = useState("For Sale")
  const [selectedBedrooms, setSelectedBedrooms] = useState("")
  const [selectedBathrooms, setSelectedBathrooms] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [selectedSort, setSelectedSort] = useState("")
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [sqftMin, setSqftMin] = useState("")
  const [sqftMax, setSqftMax] = useState("")
  const [yearBuiltMin, setYearBuiltMin] = useState("")
  const [yearBuiltMax, setYearBuiltMax] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
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

  const listingTypes = ["For Sale", "For Rent", "Inactive"]
  const bedroomOptions = ["Any", "1+", "2+", "3+", "4+", "5+"]
  const bathroomOptions = ["Any", "1+", "2+", "3+", "4+"]
  const propertyTypes = ["House", "Condo", "Townhouse", "Apartment", "Mobile Home", "Land"]
  const popularTags = ["Assumable loan", "Pet Friendly", "Fireplace", "Garage", "No HOA"]
  const sortOptions = [
    { value: "", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
    { value: "beds", label: "Most Bedrooms" },
  ]

  const handleApplyFilters = () => {
    const filters = {
      forSale: selectedListingType,
      bedrooms: selectedBedrooms,
      bathrooms: selectedBathrooms,
      priceMin,
      priceMax,
      propertyTypes: selectedPropertyTypes,
      sqftMin,
      sqftMax,
      yearBuiltMin,
      yearBuiltMax,
      tags: selectedTags,
      sortBy: selectedSort,
    }
    onFiltersChange(filters)
    setActiveDropdown(null)
    onClose()
  }

  const handleResetFilters = () => {
    setSelectedListingType("For Sale")
    setSelectedBedrooms("")
    setSelectedBathrooms("")
    setPriceMin("")
    setPriceMax("")
    setSelectedPropertyTypes([])
    setSqftMin("")
    setSqftMax("")
    setYearBuiltMin("")
    setYearBuiltMax("")
    setSelectedTags([])
    setSelectedSort("")
    onFiltersChange({})
    setActiveDropdown(null)
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handlePropertyTypeToggle = (type: string) => {
    setSelectedPropertyTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

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
            {/* Listing Type Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "type" ? null : "type")}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{selectedListingType}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "type" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {listingTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedListingType(type)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedListingType === type ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type {selectedPropertyTypes.length > 0 && `(${selectedPropertyTypes.length})`}
              </label>
              <div className="space-y-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handlePropertyTypeToggle(type)}
                    className={`w-full text-left px-3 py-2 border rounded-lg text-sm transition-colors ${
                      selectedPropertyTypes.includes(type)
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "bedrooms" ? null : "bedrooms")}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{selectedBedrooms || "Bedrooms"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "bedrooms" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {bedroomOptions.map((beds) => (
                    <button
                      key={beds}
                      onClick={() => {
                        setSelectedBedrooms(beds === "Any" ? "" : beds)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedBedrooms === beds || (!selectedBedrooms && beds === "Any")
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {beds}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bathrooms Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "bathrooms" ? null : "bathrooms")}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{selectedBathrooms || "Bathrooms"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "bathrooms" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {bathroomOptions.map((baths) => (
                    <button
                      key={baths}
                      onClick={() => {
                        setSelectedBathrooms(baths === "Any" ? "" : baths)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedBathrooms === baths || (!selectedBathrooms && baths === "Any")
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {baths}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Min Price"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <input
                  type="text"
                  placeholder="Max Price"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Square Footage Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Min Sqft"
                  value={sqftMin}
                  onChange={(e) => setSqftMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <input
                  type="text"
                  placeholder="Max Sqft"
                  value={sqftMax}
                  onChange={(e) => setSqftMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Year Built Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Min Year"
                  value={yearBuiltMin}
                  onChange={(e) => setYearBuiltMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <input
                  type="text"
                  placeholder="Max Year"
                  value={yearBuiltMax}
                  onChange={(e) => setYearBuiltMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Popular Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Popular Features</label>
              <div className="space-y-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`w-full text-left px-3 py-2 border rounded-lg text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "sort" ? null : "sort")}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{sortOptions.find((opt) => opt.value === selectedSort)?.label || "Sort"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "sort" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedSort(option.value)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedSort === option.value ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 border-t space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
