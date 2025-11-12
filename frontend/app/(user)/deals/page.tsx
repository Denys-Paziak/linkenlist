"use client"

import { useState } from "react"
import { Filter, Star } from "lucide-react"
import { ScrollButtons } from "@/components/scroll-buttons"
import { DealCard } from "@/components/deal-card"
import { DealsFilterBar } from "@/components/deals-filter-bar"
import { DealsMobileFilterDrawer } from "@/components/deals-mobile-filter-drawer"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter } from "next/navigation"
import { mockDeals } from "@/data/mock-deals"

export default function DealsPage() {
  return null
}

 function Deals() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [savedDeals, setSavedDeals] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const itemsPerPage = 20

  const filteredDeals = mockDeals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || deal.category === selectedCategory
    const matchesSaved = !showSavedOnly || savedDeals.includes(deal.id)

    return matchesSearch && matchesCategory && matchesSaved
  })

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDeals = filteredDeals.slice(startIndex, endIndex)

  const handleDealClick = (dealId: string) => {
    router.push(`/deals/${dealId}`)
  }

  const handleSubmitDeal = () => {
    alert(
      "To submit a deal:\n\n1. Click 'Contact Us' in the footer below\n2. Select 'Resource Submission/Update' as the message type\n3. Include deal details in your message\n\nWe'll review and add verified deals to our directory!",
    )
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setShowSavedOnly(false)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const handleSavedToggle = (value: boolean) => {
    setShowSavedOnly(value)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b-2 border-primary py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Military & Veteran Discounts and Benefits
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore verified discounts available to service members, veterans, and their families. From software and
            travel to fitness and education — all in one place.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 py-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Saved Filter Chip for Mobile */}
          <div className="mb-4 lg:hidden flex justify-center gap-3">
            <button
              onClick={() => handleSavedToggle(!showSavedOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                showSavedOnly
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Star className={`w-4 h-4 ${showSavedOnly ? "fill-blue-600 text-blue-600" : "text-gray-400"}`} />
              Saved
            </button>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <DealsMobileFilterDrawer
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onReset={handleResetFilters}
            onSubmitClick={handleSubmitDeal}
          />

          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Filter Sidebar - Smaller width on desktop */}
            <div className="hidden lg:block w-full lg:w-64 lg:min-w-64 mb-6 lg:mb-0">
              <DealsFilterBar
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onSubmitClick={handleSubmitDeal}
                showSavedOnly={showSavedOnly}
                onSavedToggle={handleSavedToggle}
              />
            </div>

            {/* Deals Content - Flexible width */}
            <div className="flex-1 min-w-0">
              {filteredDeals.length > 0 && (
                <div className="mb-4 text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredDeals.length)} of {filteredDeals.length} deals
                </div>
              )}

              {/* Deals Grid - Uses smaller grid without 5% scale */}
              <div className="grid-container-deals">
                {paginatedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} onClick={() => handleDealClick(deal.id)} />
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

              {/* No Results */}
              {filteredDeals.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No deals found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search terms or category selection.</p>
                  <button onClick={handleResetFilters} className="text-primary hover:text-primary/80 font-medium">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ScrollButtons />
    </div>
  )
}
