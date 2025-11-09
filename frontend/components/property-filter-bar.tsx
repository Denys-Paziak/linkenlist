"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PropertyFilterBarProps {
  onFiltersChange?: (filters: any) => void
}

export function PropertyFilterBar({ onFiltersChange }: PropertyFilterBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    forSale: "For Sale",
    priceMin: "",
    priceMax: "",
    priceType: "list-price",
    bedrooms: "Any",
    bathrooms: "Any",
    bedroomsExact: false,
    bathroomsExact: false,
    homeTypes: {
      singleFamily: true,
      townhouse: true,
      condo: true,
      multifamily: true,
      manufactured: true,
      apartment: true,
      lotLand: true,
      other: true,
    },
    sortBy: "recommended",
    assumableLoan: false,
    sqftMin: "",
    sqftMax: "",
    yearBuiltMin: "",
    yearBuiltMax: "",
    petFriendly: false,
    fireplace: false,
    garage: false,
    noHOA: false,
    keywords: "",
  })
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const formatPrice = (price: string) => {
    if (!price) return ""
    const num = Number.parseInt(price)
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${num / 1000}K`
    return `$${num.toLocaleString()}`
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    checkActiveFilters(filters)
  }, [])

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const checkActiveFilters = (currentFilters: any) => {
    const hasFilters =
      currentFilters.forSale !== "For Sale" ||
      currentFilters.priceMin !== "" ||
      currentFilters.priceMax !== "" ||
      currentFilters.bedrooms !== "Any" ||
      currentFilters.bathrooms !== "Any" ||
      currentFilters.bedroomsExact ||
      currentFilters.bathroomsExact ||
      !Object.values(currentFilters.homeTypes).every(Boolean) ||
      currentFilters.sortBy !== "recommended" ||
      currentFilters.assumableLoan ||
      currentFilters.sqftMin !== "" ||
      currentFilters.sqftMax !== "" ||
      currentFilters.yearBuiltMin !== "" ||
      currentFilters.yearBuiltMax !== "" ||
      currentFilters.petFriendly ||
      currentFilters.fireplace ||
      currentFilters.garage ||
      currentFilters.noHOA ||
      currentFilters.keywords !== ""

    setHasActiveFilters(hasFilters)
    return hasFilters
  }

  const clearAllFilters = () => {
    const defaultFilters = {
      forSale: "For Sale",
      priceMin: "",
      priceMax: "",
      priceType: "list-price",
      bedrooms: "Any",
      bathrooms: "Any",
      bedroomsExact: false,
      bathroomsExact: false,
      homeTypes: {
        singleFamily: true,
        townhouse: true,
        condo: true,
        multifamily: true,
        manufactured: true,
        apartment: true,
        lotLand: true,
        other: true,
      },
      sortBy: "recommended",
      assumableLoan: false,
      sqftMin: "",
      sqftMax: "",
      yearBuiltMin: "",
      yearBuiltMax: "",
      petFriendly: false,
      fireplace: false,
      garage: false,
      noHOA: false,
      keywords: "",
    }
    setFilters(defaultFilters)
    setHasActiveFilters(false)
    onFiltersChange?.(defaultFilters)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    checkActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleHomeTypeChange = (type: string, checked: boolean) => {
    const newHomeTypes = { ...filters.homeTypes, [type]: checked }
    const newFilters = { ...filters, homeTypes: newHomeTypes }
    setFilters(newFilters)
    checkActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const toggleAllHomeTypes = () => {
    const allSelected = Object.values(filters.homeTypes).every(Boolean)
    const newHomeTypes = Object.keys(filters.homeTypes).reduce((acc, key) => {
      acc[key] = !allSelected
      return acc
    }, {} as any)
    const newFilters = { ...filters, homeTypes: newHomeTypes }
    setFilters(newFilters)
    checkActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const applyFilters = () => {
    setActiveDropdown(null)
    onFiltersChange?.(filters)
  }

  const isFilterActive = (filterKey: string) => {
    switch (filterKey) {
      case "forSale":
        return filters.forSale !== "For Sale"
      case "price":
        return filters.priceMin !== "" || filters.priceMax !== ""
      case "bedsBaths":
        return (
          filters.bedrooms !== "Any" || filters.bathrooms !== "Any" || filters.bedroomsExact || filters.bathroomsExact
        )
      case "homeType":
        return !Object.values(filters.homeTypes).every(Boolean)
      case "sort":
        return filters.sortBy !== "recommended"
      case "more":
        return (
          filters.assumableLoan ||
          filters.sqftMin !== "" ||
          filters.sqftMax !== "" ||
          filters.yearBuiltMin !== "" ||
          filters.yearBuiltMax !== "" ||
          filters.petFriendly ||
          filters.fireplace ||
          filters.garage ||
          filters.noHOA ||
          filters.keywords !== "" ||
          filters.sortBy !== "recommended"
        )
      default:
        return false
    }
  }

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 w-full">
        {/* Always visible core filters */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* For Sale - always visible */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleDropdown("forSale")}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              activeDropdown === "forSale"
                ? "border-slate-600 bg-slate-100 text-slate-800"
                : isFilterActive("forSale")
                  ? "border-slate-500 bg-slate-50 text-slate-800"
                  : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <span className="truncate">{filters.forSale}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform flex-shrink-0 ${activeDropdown === "forSale" ? "rotate-180" : ""}`}
            />
          </Button>

          {/* Price - visible on larger screens only */}
          <div className="hidden lg:block flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDropdown("price")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
                activeDropdown === "price"
                  ? "border-slate-600 bg-slate-100 text-slate-800"
                  : isFilterActive("price")
                    ? "border-slate-500 bg-slate-50 text-slate-800"
                    : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">Price</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${activeDropdown === "price" ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {/* Beds & Baths - visible on extra large screens only */}
          <div className="hidden xl:block flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDropdown("bedsBaths")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
                activeDropdown === "bedsBaths"
                  ? "border-slate-600 bg-slate-100 text-slate-800"
                  : isFilterActive("bedsBaths")
                    ? "border-slate-500 bg-slate-50 text-slate-800"
                    : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">Beds & Baths</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${activeDropdown === "bedsBaths" ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {/* Home Type - visible on 2xl+ screens */}
          <div className="hidden 2xl:block flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDropdown("homeType")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
                activeDropdown === "homeType"
                  ? "border-slate-600 bg-slate-100 text-slate-800"
                  : isFilterActive("homeType")
                    ? "border-slate-500 bg-slate-50 text-slate-800"
                    : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">Property Types</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${activeDropdown === "homeType" ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {/* Sort - visible on 3xl+ screens */}
          <div className="hidden 3xl:block flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDropdown("sort")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
                activeDropdown === "sort"
                  ? "border-slate-600 bg-slate-100 text-slate-800"
                  : isFilterActive("sort")
                    ? "border-slate-500 bg-slate-50 text-slate-800"
                    : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">Sort</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${activeDropdown === "sort" ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* More button - always visible, right-aligned */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleDropdown("more")}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
              activeDropdown === "more"
                ? "border-slate-600 bg-slate-100 text-slate-800"
                : isFilterActive("more") ||
                    isFilterActive("price") ||
                    isFilterActive("bedsBaths") ||
                    isFilterActive("homeType") ||
                    isFilterActive("sort")
                  ? "border-slate-500 bg-slate-50 text-slate-800"
                  : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <span className="truncate">More</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform flex-shrink-0 ${activeDropdown === "more" ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Dropdown Panels */}
      {activeDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-40 max-h-96 overflow-y-auto">
          {/* For Sale Dropdown */}
          {activeDropdown === "forSale" && (
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                {["For Sale", "For Rent", "Inactive"].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="forSale"
                      value={option}
                      checked={filters.forSale === option}
                      onChange={(e) => handleFilterChange("forSale", e.target.value)}
                      className="w-4 h-4 text-slate-600"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
              <Button onClick={applyFilters} className="w-full bg-slate-700 hover:bg-slate-800 text-white">
                Apply
              </Button>
            </div>
          )}

          {/* Price Dropdown */}
          {activeDropdown === "price" && (
            <div className="p-4 space-y-4">
              <Tabs value={filters.priceType} onValueChange={(value) => handleFilterChange("priceType", value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list-price">List Price</TabsTrigger>
                  <TabsTrigger value="monthly-payment">Monthly Payment</TabsTrigger>
                </TabsList>
                <TabsContent value="list-price" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Min Price</Label>
                      <Input
                        type="text"
                        placeholder="No Min"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Max Price</Label>
                      <Input
                        type="text"
                        placeholder="No Max"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="monthly-payment" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Min Payment</Label>
                      <Input placeholder="$0" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Max Payment</Label>
                      <Input placeholder="No Max" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <Button onClick={applyFilters} className="w-full bg-slate-700 hover:bg-slate-800 text-white">
                Apply
              </Button>
            </div>
          )}

          {/* Beds & Baths Dropdown */}
          {activeDropdown === "bedsBaths" && (
            <div className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Bedrooms</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Any", "1+", "2+", "3+", "4+", "5+"].map((option) => (
                    <Button
                      key={option}
                      variant={filters.bedrooms === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange("bedrooms", option)}
                      className="px-3 py-1 text-sm"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bedrooms-exact"
                    checked={filters.bedroomsExact}
                    onCheckedChange={(checked) => handleFilterChange("bedroomsExact", checked)}
                  />
                  <Label htmlFor="bedrooms-exact" className="text-sm">
                    Use exact match
                  </Label>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Bathrooms</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Any", "1+", "1.5+", "2+", "3+", "4+"].map((option) => (
                    <Button
                      key={option}
                      variant={filters.bathrooms === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange("bathrooms", option)}
                      className="px-3 py-1 text-sm"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bathrooms-exact"
                    checked={filters.bathroomsExact}
                    onCheckedChange={(checked) => handleFilterChange("bathroomsExact", checked)}
                  />
                  <Label htmlFor="bathrooms-exact" className="text-sm">
                    Use exact match
                  </Label>
                </div>
              </div>

              <Button onClick={applyFilters} className="w-full bg-slate-700 hover:bg-slate-800 text-white">
                Apply
              </Button>
            </div>
          )}

          {/* Home Type Dropdown */}
          {activeDropdown === "homeType" && (
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Property Types</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAllHomeTypes}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {Object.values(filters.homeTypes).every(Boolean) ? "Deselect All" : "Select All"}
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { key: "singleFamily", label: "Single Family" },
                  { key: "townhouse", label: "Townhouse" },
                  { key: "condo", label: "Condo" },
                  { key: "multifamily", label: "Multi-family" },
                  { key: "manufactured", label: "Manufactured" },
                  { key: "apartment", label: "Apartment" },
                  { key: "lotLand", label: "Lot/Land" },
                  { key: "other", label: "Other" },
                ].map((type) => (
                  <div key={type.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.key}
                      checked={filters.homeTypes[type.key as keyof typeof filters.homeTypes]}
                      onCheckedChange={(checked) => handleHomeTypeChange(type.key, checked as boolean)}
                    />
                    <Label htmlFor={type.key} className="text-sm font-medium">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>

              <Button onClick={applyFilters} className="w-full bg-slate-700 hover:bg-slate-800 text-white">
                Apply
              </Button>
            </div>
          )}

          {/* Sort Dropdown */}
          {activeDropdown === "sort" && (
            <div className="p-4 space-y-3">
              {[
                { value: "recommended", label: "Recommended" },
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
                { value: "newest", label: "Newest Listings" },
                { value: "oldest", label: "Oldest Listings" },
                { value: "relevant", label: "Most Relevant" },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="w-4 h-4 text-slate-600"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
              <Button onClick={applyFilters} className="w-full bg-slate-700 hover:bg-slate-800 text-white">
                Apply
              </Button>
            </div>
          )}

          {/* More Dropdown */}
          {activeDropdown === "more" && (
            <div className="p-4 space-y-4">
              {/* Price section - shown on smaller screens */}
              <div className="lg:hidden">
                <Label className="text-sm font-medium mb-3 block">Price</Label>
                <Tabs value={filters.priceType} onValueChange={(value) => handleFilterChange("priceType", value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list-price">List Price</TabsTrigger>
                    <TabsTrigger value="monthly-payment">Monthly Payment</TabsTrigger>
                  </TabsList>
                  <TabsContent value="list-price" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Min Price</Label>
                        <Input
                          type="text"
                          placeholder="No Min"
                          value={filters.priceMin}
                          onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Max Price</Label>
                        <Input
                          type="text"
                          placeholder="No Max"
                          value={filters.priceMax}
                          onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="monthly-payment" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Min Payment</Label>
                        <Input placeholder="$0" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Max Payment</Label>
                        <Input placeholder="No Max" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Beds & Baths section - shown on smaller screens */}
              <div className="xl:hidden">
                <Label className="text-sm font-medium mb-3 block">Beds & Baths</Label>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Bedrooms</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["Any", "1+", "2+", "3+", "4+", "5+"].map((option) => (
                        <Button
                          key={option}
                          variant={filters.bedrooms === option ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFilterChange("bedrooms", option)}
                          className="px-3 py-1 text-sm"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bedrooms-exact-more"
                        checked={filters.bedroomsExact}
                        onCheckedChange={(checked) => handleFilterChange("bedroomsExact", checked)}
                      />
                      <Label htmlFor="bedrooms-exact-more" className="text-sm">
                        Use exact match
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Bathrooms</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["Any", "1+", "1.5+", "2+", "3+", "4+"].map((option) => (
                        <Button
                          key={option}
                          variant={filters.bathrooms === option ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFilterChange("bathrooms", option)}
                          className="px-3 py-1 text-sm"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bathrooms-exact-more"
                        checked={filters.bathroomsExact}
                        onCheckedChange={(checked) => handleFilterChange("bathroomsExact", checked)}
                      />
                      <Label htmlFor="bathrooms-exact-more" className="text-sm">
                        Use exact match
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Home Type section - shown on smaller screens */}
              <div className="2xl:hidden">
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-sm font-medium">Property Types</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAllHomeTypes}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    {Object.values(filters.homeTypes).every(Boolean) ? "Deselect All" : "Select All"}
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "singleFamily", label: "Single Family" },
                    { key: "townhouse", label: "Townhouse" },
                    { key: "condo", label: "Condo" },
                    { key: "multifamily", label: "Multi-family" },
                    { key: "manufactured", label: "Manufactured" },
                    { key: "apartment", label: "Apartment" },
                    { key: "lotLand", label: "Lot/Land" },
                    { key: "other", label: "Other" },
                  ].map((type) => (
                    <div key={type.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${type.key}-more`}
                        checked={filters.homeTypes[type.key as keyof typeof filters.homeTypes]}
                        onCheckedChange={(checked) => handleHomeTypeChange(type.key, checked as boolean)}
                      />
                      <Label htmlFor={`${type.key}-more`} className="text-sm font-medium">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort section - shown on smaller screens */}
              <div className="3xl:hidden">
                <Label className="text-sm font-medium mb-3 block">Sort By</Label>
                <div className="space-y-2">
                  {[
                    { value: "recommended", label: "Recommended" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "newest", label: "Newest Listings" },
                    { value: "oldest", label: "Oldest Listings" },
                    { value: "relevant", label: "Most Relevant" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                        className="w-4 h-4 text-slate-600"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Keywords</Label>
                  <Input
                    placeholder="Search keywords..."
                    value={filters.keywords || ""}
                    onChange={(e) => handleFilterChange("keywords", e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Square Footage</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min sqft"
                      value={filters.sqftMin}
                      onChange={(e) => handleFilterChange("sqftMin", e.target.value)}
                    />
                    <Input
                      placeholder="Max sqft"
                      value={filters.sqftMax}
                      onChange={(e) => handleFilterChange("sqftMax", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Year Built</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min year"
                      value={filters.yearBuiltMin}
                      onChange={(e) => handleFilterChange("yearBuiltMin", e.target.value)}
                    />
                    <Input
                      placeholder="Max year"
                      value={filters.yearBuiltMax}
                      onChange={(e) => handleFilterChange("yearBuiltMax", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="assumable-loan"
                      checked={filters.assumableLoan}
                      onCheckedChange={(checked) => handleFilterChange("assumableLoan", checked)}
                    />
                    <Label htmlFor="assumable-loan" className="text-sm font-medium">
                      Assumable loan
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pet-friendly"
                      checked={filters.petFriendly}
                      onCheckedChange={(checked) => handleFilterChange("petFriendly", checked)}
                    />
                    <Label htmlFor="pet-friendly" className="text-sm font-medium">
                      Pet Friendly
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fireplace"
                      checked={filters.fireplace}
                      onCheckedChange={(checked) => handleFilterChange("fireplace", checked)}
                    />
                    <Label htmlFor="fireplace" className="text-sm font-medium">
                      Fireplace
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="garage"
                      checked={filters.garage}
                      onCheckedChange={(checked) => handleFilterChange("garage", checked)}
                    />
                    <Label htmlFor="garage" className="text-sm font-medium">
                      Garage
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-hoa"
                      checked={filters.noHOA}
                      onCheckedChange={(checked) => handleFilterChange("noHOA", checked)}
                    />
                    <Label htmlFor="no-hoa" className="text-sm font-medium">
                      No HOA
                    </Label>
                  </div>
                </div>
              </div>

              {/* Button row with Apply and Reset buttons */}
              <div className="flex gap-2">
                <Button onClick={applyFilters} className="flex-1 bg-slate-700 hover:bg-slate-800 text-white">
                  Apply
                </Button>
                <Button onClick={clearAllFilters} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Reset all filters
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
