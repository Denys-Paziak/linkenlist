"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { mockResources, categories, formats, sortOptions } from "@/data/mock-resources-data"
import { CustomDropdown } from "@/components/custom-dropdown"
import { EnhancedResourceCard } from "@/components/enhanced-resource-card"
import { ResourcesMobileFilterDrawer } from "@/components/resources-mobile-filter-drawer"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight, Search, Plus, Star, Filter } from "lucide-react"

export default function ResourcesPage() {
  return null
}

function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedFormat, setSelectedFormat] = useState("All")
  const [sortBy, setSortBy] = useState("Newest")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [resourcesPerPage] = useState(20)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Featured resources with enhanced data
  const featuredResources = useMemo(() => {
    return mockResources
      .filter((resource) => resource.isFeatured)
      .slice(0, 8)
      .map((resource) => ({
        ...resource,
        likes: Math.floor(Math.random() * 100) + 10,
      }))
  }, [])

  // Filtered and sorted resources
  const filteredResources = useMemo(() => {
    const filtered = mockResources
      .map((resource) => ({
        ...resource,
        likes: Math.floor(Math.random() * 100) + 10,
      }))
      .filter((resource) => {
        if (selectedCategory !== "All" && resource.category !== selectedCategory) return false
        if (selectedFormat !== "All" && resource.format !== selectedFormat) return false
        if (verifiedOnly && !resource.isVerified) return false
        if (showSavedOnly) {
          const savedResourceIds = [1, 3, 5, 7, 9] // Mock saved resource IDs
          if (!savedResourceIds.includes(resource.id)) return false
        }
        return true
      })

    // Sort resources
    switch (sortBy) {
      case "Most Viewed":
        filtered.sort((a, b) => b.views - a.views)
        break
      case "Newest":
      default:
        filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        break
    }

    return filtered
  }, [selectedCategory, selectedFormat, sortBy, verifiedOnly, showSavedOnly])

  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage)
  const startIndex = (currentPage - 1) * resourcesPerPage
  const endIndex = startIndex + resourcesPerPage
  const currentResources = filteredResources.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedFormat, sortBy, verifiedOnly, showSavedOnly])

  useEffect(() => {
    if (scrollContainerRef.current) {
      handleScroll()
    }
  }, [featuredResources])

  const handleReset = () => {
    setSelectedCategory("All")
    setSelectedFormat("All")
    setSortBy("Newest")
    setVerifiedOnly(false)
    setShowSavedOnly(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <main className="flex-1">
        {/* Featured Resources Carousel */}
        <section className="bg-gradient-to-br from-primary to-primary/90 text-white py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Featured Resources</h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Popular guides and tools recommended for military personnel and families.
              </p>
            </div>

            {/* Scrollable Carousel with External Navigation */}
            <div className="relative">
              {/* Left Scroll Button - Outside carousel - Hidden on mobile */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute -left-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-md transition-all duration-200 hidden md:block ${
                  canScrollLeft
                    ? "text-gray-600 hover:bg-white/80 hover:shadow-lg"
                    : "text-gray-300 cursor-not-allowed opacity-30"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Right Scroll Button - Outside carousel - Hidden on mobile */}
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute -right-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-md transition-all duration-200 hidden md:block ${
                  canScrollRight
                    ? "text-gray-600 hover:bg-white/80 hover:shadow-lg"
                    : "text-gray-300 cursor-not-allowed opacity-30"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Carousel Container */}
              <div className="mx-2 md:mx-10">
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {featuredResources.map((resource) => (
                    <div key={resource.id} className="flex-shrink-0 w-72 snap-start">
                      <EnhancedResourceCard resource={resource} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto px-4">
            {/* Mobile Filter Tags - Show active filters */}
            <div className="lg:hidden mb-6 flex justify-center gap-3">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  showSavedOnly
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Star className={`h-4 w-4 ${showSavedOnly ? "fill-current" : ""}`} />
                Saved
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Filters Sidebar - Updated to match links page color scheme */}
              <div className="hidden lg:block lg:w-80">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Search & Filter</h3>

                  <div className="space-y-3">
                    {/* Search Bar - Updated styling to match links page */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search resources..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Category Filter */}
                    <div>
                      <CustomDropdown
                        options={categories}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        placeholder="All Categories"
                        displayLabels={{
                          All: "All Categories",
                          "Health & Wellness": "Health & Wellness",
                          "Military Discounts": "Military Discounts",
                          "PCS / VA / Family": "PCS / VA / Family",
                        }}
                      />
                    </div>

                    {/* Format Filter */}
                    <div>
                      <CustomDropdown
                        options={formats}
                        value={selectedFormat}
                        onChange={setSelectedFormat}
                        placeholder="All Formats"
                        displayLabels={{
                          All: "All Formats",
                          Article: "Article",
                          Video: "Video",
                          Tool: "Tool",
                          Guide: "Guide",
                        }}
                      />
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <CustomDropdown
                        options={sortOptions}
                        value={sortBy}
                        onChange={setSortBy}
                        placeholder="Newest First"
                        displayLabels={{
                          Newest: "Newest First",
                          "Most Viewed": "Most Viewed",
                        }}
                      />
                    </div>

                    {/* Verified Only Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="verified"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
                        Verified only
                      </label>
                    </div>

                    {/* Saved Filter Button */}
                    <button
                      onClick={() => setShowSavedOnly(!showSavedOnly)}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        showSavedOnly
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-[#dc2626] text-[#dc2626]" : "text-gray-400"}`}
                      />
                      {showSavedOnly ? "Showing Saved" : "Show Saved Only"}
                    </button>

                    {/* Filter Buttons Row */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200">
                        Apply Filters
                      </button>

                      <button
                        onClick={handleReset}
                        className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                      >
                        Reset Filters
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

              {/* Main Content */}
              <div className="flex-1">
                {filteredResources.length > 0 && (
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredResources.length)} of{" "}
                    {filteredResources.length} resources
                  </div>
                )}

                {/* Resources Grid - Updated to use same scaling logic as links page */}
                <div className="grid-container-resources">
                  {currentResources.map((resource) => (
                    <EnhancedResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) handlePageChange(currentPage - 1)
                            }}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {currentPage > 3 && (
                          <>
                            <PaginationItem>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handlePageChange(1)
                                }}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {currentPage > 4 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                          </>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            return page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2)
                          })
                          .map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handlePageChange(page)
                                }}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handlePageChange(totalPages)
                                }}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages) handlePageChange(currentPage + 1)
                            }}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}

                {currentResources.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                    <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search terms or filter selection.</p>
                    <button onClick={handleReset} className="text-primary hover:text-primary/80 font-medium">
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>


      {/* Mobile Filter Drawer Component */}
      <ResourcesMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
        sortBy={sortBy}
        onSortChange={setSortBy}
        verifiedOnly={verifiedOnly}
        onVerifiedChange={setVerifiedOnly}
      />
    </div>
  )
}
