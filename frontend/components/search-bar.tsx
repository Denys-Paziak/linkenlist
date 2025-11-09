"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, Star } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  selectedBranch?: string
  onBranchChange?: (branch: string) => void
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  selectedAccess?: string
  onAccessChange?: (access: string) => void
  selectedSort?: string
  onSortChange?: (sort: string) => void
  placeholder?: string
  selectedListingType?: string
  onListingTypeChange?: (type: string) => void
  showListingTypeDropdown?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  showFavoritesOnly?: boolean
  onFavoritesToggle?: (show: boolean) => void
}

export function SearchBar({
  value,
  onChange,
  selectedBranch = "",
  onBranchChange,
  selectedCategory = "",
  onCategoryChange,
  selectedAccess = "",
  onAccessChange,
  selectedSort = "",
  onSortChange,
  placeholder = "Search resources...",
  selectedListingType = "",
  onListingTypeChange,
  showListingTypeDropdown = false,
  onKeyDown,
  showFavoritesOnly = false,
  onFavoritesToggle,
}: SearchBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [rightAlignedDropdowns, setRightAlignedDropdowns] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const branchRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const listingTypeRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (activeDropdown) {
      const checkDropdownPosition = () => {
        const refs = {
          branch: branchRef.current,
          category: categoryRef.current,
          sort: sortRef.current,
          listingType: listingTypeRef.current,
        }

        const currentRef = refs[activeDropdown as keyof typeof refs]
        if (currentRef) {
          const rect = currentRef.getBoundingClientRect()
          const viewportWidth = window.innerWidth
          const dropdownWidth = 200 // Approximate dropdown width

          const newRightAligned = new Set(rightAlignedDropdowns)

          if (rect.left + dropdownWidth > viewportWidth - 20) {
            newRightAligned.add(activeDropdown)
          } else {
            newRightAligned.delete(activeDropdown)
          }

          setRightAlignedDropdowns(newRightAligned)
        }
      }

      setTimeout(checkDropdownPosition, 10)
    }
  }, [activeDropdown])

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const branches = ["All", "Army", "Navy", "Air Force", "Marines", "Space Force", "Coast Guard", "DoW-wide"]
  const categories = [
    "All",
    "Pay & Benefits",
    "Medical/TRICARE",
    "Education & Training",
    "Housing/PCS",
    "Travel/Finance",
    "Personnel/Records",
    "Legal",
    "Family Support",
    "Transition/Retirement",
    "VA",
  ]
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "most-used", label: "Most used (clicks last 30 days)" },
    { value: "recently-verified", label: "Recently verified" },
    { value: "alphabetical", label: "Alphabetical" },
    { value: "official-first", label: "Official first (.mil/.gov)" },
  ]

  const listingTypes = ["Buy", "Rent"]

  const applyFilters = () => {
    setActiveDropdown(null)
  }

  const resetFilters = () => {
    if (onBranchChange) onBranchChange("")
    if (onCategoryChange) onCategoryChange("")
    if (onSortChange) onSortChange("")
    onChange("")
    setActiveDropdown(null)
  }

  const hasFilters = onBranchChange && onCategoryChange && onSortChange

  if (hasFilters) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 px-6 py-3">
        <div ref={containerRef} className="space-y-4">
          <div className="flex gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {onFavoritesToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newValue = !showFavoritesOnly
                  onFavoritesToggle(newValue)
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  showFavoritesOnly
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${showFavoritesOnly ? "fill-[#dc2626] text-[#dc2626]" : "text-gray-400"}`}
                />
                Saved
              </button>
            )}

            {/* Branch Filter */}
            <div className="relative" ref={branchRef}>
              <button
                onClick={() => handleDropdownToggle("branch")}
                className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-w-[120px]"
              >
                <span>{selectedBranch || "Branch"}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {activeDropdown === "branch" && (
                <div
                  className={`absolute top-full mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto ${
                    rightAlignedDropdowns.has("branch") ? "right-0" : "left-0"
                  }`}
                >
                  {branches.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => {
                        onBranchChange(branch === "All" ? "" : branch)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg whitespace-nowrap ${
                        selectedBranch === branch || (!selectedBranch && branch === "All")
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => handleDropdownToggle("category")}
                className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-w-[120px]"
              >
                <span>{selectedCategory || "Category"}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {activeDropdown === "category" && (
                <div
                  className={`absolute top-full mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto ${
                    rightAlignedDropdowns.has("category") ? "right-0" : "left-0"
                  }`}
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category === "All" ? "" : category)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg whitespace-nowrap ${
                        selectedCategory === category || (!selectedCategory && category === "All")
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Filter */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => handleDropdownToggle("sort")}
                className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-w-[120px]"
              >
                <span>
                  {selectedSort ? sortOptions.find((option) => option.value === selectedSort)?.label : "Sort"}
                </span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {activeDropdown === "sort" && (
                <div
                  className={`absolute top-full mt-1 min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto ${
                    rightAlignedDropdowns.has("sort") ? "right-0" : "left-0"
                  }`}
                >
                  {sortOptions.slice(1).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value)
                        setActiveDropdown(null)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg whitespace-nowrap ${
                        selectedSort === option.value ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={applyFilters}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showListingTypeDropdown && onListingTypeChange) {
    return (
      <div ref={containerRef} className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
        {/* Listing Type Dropdown */}
        <div className="relative" ref={listingTypeRef}>
          <button
            onClick={() => handleDropdownToggle("listingType")}
            className="flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 text-sm font-medium border-r border-gray-300 min-w-[80px] h-full"
          >
            <span>{selectedListingType || "All"}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
          {activeDropdown === "listingType" && (
            <div
              className={`absolute top-full mt-1 min-w-[100px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
                rightAlignedDropdowns.has("listingType") ? "right-0" : "left-0"
              }`}
            >
              <button
                onClick={() => {
                  onListingTypeChange("")
                  setActiveDropdown(null)
                }}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg whitespace-nowrap ${
                  !selectedListingType ? "bg-primary/10 text-primary" : ""
                }`}
              >
                All
              </button>
              {listingTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    onListingTypeChange(type)
                    setActiveDropdown(null)
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm last:rounded-b-lg whitespace-nowrap ${
                    selectedListingType === type ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full pl-10 pr-4 py-2 border-0 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  )
}
