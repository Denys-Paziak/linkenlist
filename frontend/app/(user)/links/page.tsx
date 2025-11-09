"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { ResourceCard } from "@/components/resource-card"
import { SubmitLinkModal } from "@/components/submit-link-modal"
import { ScrollButtons } from "@/components/scroll-buttons"
import { LinksMobileFilterDrawer } from "@/components/links-mobile-filter-drawer"
import { mockResources } from "@/data/mock-resources"
import { useUser } from "@/contexts/user-context"
import { Star, Filter } from "lucide-react"

export default function LinksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedAccess, setSelectedAccess] = useState("")
  const [selectedSort, setSelectedSort] = useState("")
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { user } = useUser()
  const searchParams = useSearchParams()

  useEffect(() => {
    const favoritesParam = searchParams.get("favorites")
    setShowFavoritesOnly(favoritesParam === "true")
  }, [searchParams])

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedBranch("")
    setSelectedCategory("")
    setSelectedAccess("")
    setSelectedSort("")
  }

  const filteredResources = mockResources.filter((resource) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchLower) ||
      resource.description.toLowerCase().includes(searchLower) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchLower))

    const matchesBranch = selectedBranch === "" || resource.tags.some((tag) => tag === selectedBranch)

    const matchesCategory =
      selectedCategory === "" ||
      resource.tags.some((tag) => tag === selectedCategory) ||
      resource.category === selectedCategory

    const matchesAccess =
      selectedAccess === "" ||
      resource.tags.some((tag) => tag === selectedAccess) ||
      resource.accessType === selectedAccess

    const matchesFavorites = !showFavoritesOnly || user.favorites.includes(resource.id)

    return matchesSearch && matchesBranch && matchesCategory && matchesAccess && matchesFavorites
  })

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (selectedSort) {
      case "most-used":
        return (b.clicks || 0) - (a.clicks || 0)
      case "recently-verified":
        return new Date(b.lastVerified || 0).getTime() - new Date(a.lastVerified || 0).getTime()
      case "alphabetical":
        return a.title.localeCompare(b.title)
      case "official-first":
        const aIsOfficial = a.url.includes(".mil") || a.url.includes(".gov")
        const bIsOfficial = b.url.includes(".mil") || b.url.includes(".gov")
        if (aIsOfficial && !bIsOfficial) return -1
        if (!aIsOfficial && bIsOfficial) return 1
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return (
    <div className="flex flex-col min-h-screen">

      <div className="bg-white border-b-2 border-primary py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find direct links to your military websites. Faster.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            LinkEnlist is independently operated and is not affiliated with the DoD.
          </p>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1120px] mx-auto mb-6">
            <div className="lg:hidden mb-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  const newValue = !showFavoritesOnly
                  setShowFavoritesOnly(newValue)
                  if (newValue) {
                    window.history.pushState({}, "", "/links?favorites=true")
                  } else {
                    window.history.pushState({}, "", "/links")
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                  showFavoritesOnly
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                <Star className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Saved
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 text-sm font-medium min-h-[44px] touch-manipulation"
                style={{ touchAction: "manipulation" }}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="hidden lg:block">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedAccess={selectedAccess}
                onAccessChange={setSelectedAccess}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                placeholder="Search 400+ official DoD websites"
                showFavoritesOnly={showFavoritesOnly}
                onFavoritesToggle={(value) => {
                  setShowFavoritesOnly(value)
                  if (value) {
                    window.history.pushState({}, "", "/links?favorites=true")
                  } else {
                    window.history.pushState({}, "", "/links")
                  }
                }}
              />
            </div>
          </div>

          {showFavoritesOnly && (
            <div className="mb-6 px-2">
              <div className="bg-secondary border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent fill-accent" />
                  <span className="font-bold text-foreground">Showing your favorite resources</span>
                </div>
                <button
                  onClick={() => {
                    setShowFavoritesOnly(false)
                    window.history.pushState({}, "", "/links")
                  }}
                  className="text-primary hover:text-primary/70 font-medium text-sm"
                >
                  Show All
                </button>
              </div>
            </div>
          )}

          {(searchQuery ||
            selectedBranch ||
            selectedCategory ||
            selectedAccess ||
            selectedSort ||
            showFavoritesOnly) && (
            <div className="mb-4 px-2">
              <p className="text-sm text-muted-foreground">
                {sortedResources.length} result{sortedResources.length !== 1 ? "s" : ""} found
                {selectedBranch && ` for ${selectedBranch}`}
                {selectedCategory && ` in ${selectedCategory}`}
                {selectedAccess && ` with ${selectedAccess} access`}
                {searchQuery && ` matching "${searchQuery}"`}
                {showFavoritesOnly && ` in your favorites`}
              </p>
            </div>
          )}

          <div className="grid-container-links">
            {sortedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          {sortedResources.length === 0 &&
            (searchQuery ||
              selectedBranch ||
              selectedCategory ||
              selectedAccess ||
              selectedSort ||
              showFavoritesOnly) && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-base">
                  {showFavoritesOnly ? "No favorite resources found" : "No resources found"}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {showFavoritesOnly
                    ? "Start adding resources to your favorites by clicking the star icon on any card."
                    : "Try adjusting your search terms or filters."}
                </p>
              </div>
            )}
        </div>
      </main>

      <ScrollButtons />

      <SubmitLinkModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} />
      <LinksMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedAccess={selectedAccess}
        onAccessChange={setSelectedAccess}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />
    </div>
  )
}
