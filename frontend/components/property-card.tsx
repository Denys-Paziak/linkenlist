"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, Info, Bed, Bath, Square, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface PropertyCardProps {
  listing: {
    id: number
    image: string
    images?: string[] // Added optional images array
    price: string
    rentPrice?: string // Added optional rent price
    salePrice?: string // Added optional sale price
    beds: number
    baths: number
    sqft: string
    address: string
    description: string
    badges: string[]
    status?: string // Added optional status property
    postedBy: string
    savedDate?: string // Added optional savedDate string
  }
  onDetailsClick: () => void
  isBookmarked?: boolean
  onBookmarkToggle?: () => void
  hideInfoButton?: boolean
  hideBookmarkButton?: boolean // Added prop to conditionally hide bookmark button
  isDeactivated?: boolean
  showStatusBadges?: "all" | "inactive-only" | "active-pending-only" | "none" // Added prop to control which status badges to show
  isAdminContext?: boolean
  onAdminAction?: (action: string, listingId: number) => void
}

export function PropertyCard({
  listing,
  onDetailsClick,
  isBookmarked = false,
  onBookmarkToggle,
  hideInfoButton = false,
  hideBookmarkButton = false, // Added hideBookmarkButton prop with default false
  isDeactivated = false,
  showStatusBadges = "all", // Added showStatusBadges prop with default 'all'
  isAdminContext = false,
  onAdminAction,
}: PropertyCardProps) {
  const images = listing.images || [listing.image]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookmarkMessage, setShowBookmarkMessage] = useState(false)
  const [showAdminDetailModal, setShowAdminDetailModal] = useState(false)
  //const { user } = useUser()

  useEffect(() => {
    if (showBookmarkMessage) {
      const timer = setTimeout(() => {
        setShowBookmarkMessage(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showBookmarkMessage])

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const renderPrice = () => {
    if (listing.salePrice && listing.rentPrice) {
      return (
        <>
          {listing.salePrice}
          <span className="text-gray-600 text-xs mx-2.5 my-1.5 py-0">|</span>
          {listing.rentPrice}
        </>
      )
    }

    // Show individual prices when only one exists
    if (listing.salePrice) {
      return listing.salePrice
    }

    if (listing.rentPrice) {
      return listing.rentPrice
    }

    // Fallback to generic price field if it exists
    return listing.price || "Price not available"
  }

  const shouldShowStatusBadge = () => {
    if (!listing.status || showStatusBadges === "none") return false

    if (showStatusBadges === "all") return true

    if (showStatusBadges === "inactive-only") {
      return listing.status === "inactive"
    }

    if (showStatusBadges === "active-pending-only") {
      return listing.status === "active" || listing.status === "pending"
    }

    return false
  }

  const handleAdminAction = (action: string) => {
    onAdminAction?.(action, listing.id)
    setShowAdminDetailModal(false)
  }

  const handleCardClick = () => {
    if (isAdminContext) {
      setShowAdminDetailModal(true)
    } else {
      onDetailsClick()
    }
  }

  return (
    <>
      <div
        className="card group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Container with fixed aspect ratio */}
        <div className="card-media-container p-2 pb-1 relative">
          <div className="card-media w-full bg-secondary rounded-md border border-gray-200 overflow-hidden relative">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={listing.address}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />

            {shouldShowStatusBadge() && (
              <div className="absolute bottom-2 left-2 z-10">
                <Badge
                  className={`text-white text-[10px] px-1.5 py-0.5 ${
                    listing.status === "active"
                      ? "bg-green-500"
                      : listing.status === "pending"
                        ? "bg-yellow-500"
                        : listing.status === "rejected"
                          ? "bg-red-500"
                          : listing.status === "draft"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                  }`}
                >
                  {listing.status === "active"
                    ? "Active"
                    : listing.status === "pending"
                      ? "Pending"
                      : listing.status === "rejected"
                        ? "Rejected"
                        : listing.status === "draft"
                          ? "Draft"
                          : "Inactive"}
                </Badge>
              </div>
            )}

            {images.length > 1 && (
              <>
                {/* Left Arrow - Enhanced visibility */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 p-0 bg-black/30 hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 border-0 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </Button>

                {/* Right Arrow - Enhanced visibility */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 p-0 bg-black/30 hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 border-0 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </Button>

                {/* Image Dots - Always visible with better contrast */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 border border-white/30 ${
                        index === currentImageIndex ? "bg-white shadow-sm" : "bg-white/60 hover:bg-white/80"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(index)
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="px-2 pb-2">
          {/* Price - updated to handle dual pricing */}
          <h3 className="card-price mb-1 font-bold text-[#002244] text-left text-lg leading-7">{renderPrice()}</h3>

          {/* Property Details - single line with proper spacing */}
          <div className="card-meta flex items-center text-xs text-gray-900 mb-1 whitespace-nowrap">
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Bed className="w-3 h-3" />
              <span>{listing.beds} bds</span>
            </div>
            <span className="mx-1">•</span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Bath className="w-3 h-3" />
              <span>{listing.baths} ba</span>
            </div>
            <span className="mx-1">•</span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Square className="w-3 h-3" />
              <span>{listing.sqft} sqft</span>
            </div>
          </div>

          {/* Address - clamped to one line */}
          <p className="card-title text-xs text-gray-900 font-medium text-left">{listing.address}</p>
        </div>

        {/* Red Badge - Top Left */}
        {listing.badges.length > 0 && (
          <div className="absolute top-2 left-2 z-10 px-[3px]">
            <Badge className="bg-[#dc2626] text-white text-[10px] px-1 py-0.5">{listing.badges[0]}</Badge>
          </div>
        )}

        {/* Action Icons - Top Right */}
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {!hideBookmarkButton && (
            <Button
              size="sm"
              variant="secondary"
              className="w-5 h-5 p-0 bg-white/90 hover:bg-gray-100 relative"
              onClick={(e) => {
                e.stopPropagation()
                // if (user && !isBookmarked) {
                //   setShowBookmarkMessage(true)
                // }
                onBookmarkToggle?.()
              }}
            >
              <Bookmark className={`w-2.5 h-2.5 ${isBookmarked ? "fill-[#dc2626] text-[#dc2626]" : ""}`} />
              {showBookmarkMessage && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-[9999] px-3 py-2 bg-black text-white text-xs rounded-lg shadow-lg whitespace-nowrap animate-in fade-in-0 slide-in-from-top-2 duration-200">
                  {/* {user ? "Saved" : "Please log in to save this."} */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45 translate-y-1"></div>
                </div>
              )}
            </Button>
          )}
          {!hideInfoButton && (
            <Button
              size="sm"
              variant="secondary"
              className="w-5 h-5 p-0 bg-white/90 hover:bg-gray-100 group/tooltip relative"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Info className="w-2.5 h-2.5" />
              <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                By {listing.postedBy}
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Admin Detailed Preview Modal */}
      {isAdminContext && showAdminDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            {/* Header with close button */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Property Details - Admin View</h2>
              <button onClick={() => setShowAdminDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            {/* Property detail content matching /realestate?listing=1 layout */}
            <div className="p-6">
              {/* Image Gallery */}
              <div className="grid grid-cols-3 gap-4 h-96 mb-6">
                <div className="col-span-2">
                  <img
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={listing.address}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="grid grid-rows-2 gap-4">
                  {images.slice(1, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={img || "/placeholder.svg"}
                      alt={`${listing.address} ${idx + 2}`}
                      className="w-full h-full object-cover rounded-lg cursor-pointer"
                      onClick={() => setCurrentImageIndex(idx + 1)}
                    />
                  ))}
                </div>
              </div>

              {/* Property badges */}
              <div className="flex gap-2 mb-4">
                <Badge className="bg-blue-600 text-white">FOR SALE</Badge>
                {listing.rentPrice && <Badge className="bg-green-600 text-white">FOR RENT</Badge>}
              </div>

              {/* Price and details */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{renderPrice()}</h1>
                <div className="flex items-center gap-4 text-lg mb-2">
                  <span>{listing.beds} beds</span>
                  <span>{listing.baths} baths</span>
                  <span>{listing.sqft} sqft</span>
                </div>
                <p className="text-gray-600">{listing.address}</p>
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-3 gap-8">
                {/* Main content */}
                <div className="col-span-2 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Description</h3>
                    <p className="text-gray-700">{listing.description}</p>
                  </div>

                  {/* Special Features */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Special Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.badges.map((badge, idx) => (
                        <Badge key={idx} variant="secondary">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Property Facts */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Property Facts</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Property Type:</span>
                        <span className="ml-2">Single Family Residence</span>
                      </div>
                      <div>
                        <span className="font-medium">Year Built:</span>
                        <span className="ml-2">2018</span>
                      </div>
                      <div>
                        <span className="font-medium">Lot Size:</span>
                        <span className="ml-2">0.25 acres</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Admin Actions */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Admin Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAdminAction("approve")}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAdminAction("reject")}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject with Comment
                      </button>
                      <button
                        onClick={() => handleAdminAction("deactivate")}
                        className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleAdminAction("adjust-time")}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Adjust Listing Time
                      </button>
                      <button
                        onClick={() => handleAdminAction("delete")}
                        className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Listed By */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Listed By</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {listing.postedBy.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{listing.postedBy}</p>
                        <p className="text-sm text-gray-600">eXp Realty, LLC</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Listing ID: mbo1523970</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
