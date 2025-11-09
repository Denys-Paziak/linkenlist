"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ListingModal } from "@/components/listing-modal"
import { PropertyCard } from "@/components/property-card"
import { useUser } from "@/contexts/user-context"
import { useUrlState } from "@/hooks/use-url-state"
import { Home, Edit, Trash2, Eye, Plus, AlertCircle, MoreVertical, Bookmark, Mail, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

// Mock user listings data - formatted to match /realestate page structure
const mockUserListings = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=300",
    price: "$2,100/mo",
    beds: 4,
    baths: 3,
    sqft: "2,200",
    address: "123 Oak Street, Fayetteville, NC 28301",
    description: "Near Fort Liberty (Bragg)",
    lotSize: "0.25 acres",
    hoa: "$150/mo",
    tags: ["Pet Friendly", "Military Friendly", "Parking Included"],
    badges: ["Large Balcony"],
    type: "rent",
    status: "active", // Updated to show Active status
    datePosted: "2024-01-15",
    views: 45,
    inquiries: 8,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    title: "4BR Military Family Home Near Fort Bragg",
    nearestBase: "Fort Liberty (Bragg), NC",
    postedBy: "You",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=300",
    price: "$1,400/mo",
    beds: 2,
    baths: 2,
    sqft: "1,100",
    address: "456 Pine Avenue, Fayetteville, NC 28303",
    description: "Near Fort Liberty (Bragg)",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["Furnished", "Utilities Included"],
    badges: ["New Deck"],
    type: "rent",
    status: "pending", // Updated to show Pending status
    datePosted: "2024-01-10",
    views: 23,
    inquiries: 3,
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    title: "Cozy 2BR Apartment - Military Discount",
    nearestBase: "Fort Liberty (Bragg), NC",
    postedBy: "You",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=300",
    price: "$285,000",
    beds: 3,
    baths: 2.5,
    sqft: "1,800",
    address: "789 Maple Drive, Spring Lake, NC 28390",
    description: "Near Fort Liberty (Bragg)",
    lotSize: "0.15 acres",
    hoa: "$75/mo",
    tags: ["New Construction", "Pool Access"],
    badges: ["New Built"],
    type: "sale",
    status: "rejected", // Updated to show Rejected status
    datePosted: "2023-12-20",
    views: 89,
    inquiries: 15,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    title: "Beautiful 3BR House for Sale",
    nearestBase: "Fort Liberty (Bragg), NC",
    postedBy: "You",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=200&width=300",
    price: "$2,800/mo",
    beds: 5,
    baths: 3,
    sqft: "2,800",
    address: "321 Cedar Lane, Fayetteville, NC 28304",
    description: "Near Fort Liberty (Bragg)",
    lotSize: "0.5 acres",
    hoa: "$0/mo",
    tags: ["Large Family", "Military Friendly", "Garage"],
    badges: ["Pool"],
    type: "rent",
    status: "inactive", // Updated to show Inactive status
    datePosted: "2024-01-20",
    views: 67,
    inquiries: 12,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    title: "Spacious 5BR Military Housing",
    nearestBase: "Fort Liberty (Bragg), NC",
    postedBy: "You",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=200&width=300",
    price: "$1,750/mo",
    beds: 3,
    baths: 2,
    sqft: "1,500",
    address: "567 Elm Street, Fayetteville, NC 28305",
    description: "Near Fort Liberty (Bragg)",
    lotSize: "0.2 acres",
    hoa: "$100/mo",
    tags: ["Pet Friendly", "Military Friendly", "Updated Kitchen"],
    badges: ["New Listing"],
    type: "rent",
    status: "draft",
    datePosted: "2024-01-22",
    views: 0,
    inquiries: 0,
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    title: "Cozy 3BR Home with Updated Features",
    nearestBase: "Fort Liberty (Bragg), NC",
  },
]

// Mock saved listings data - properties the user has bookmarked
const mockSavedListings = [
  {
    id: 101,
    image: "/placeholder.svg?height=200&width=300",
    price: "$650,000",
    beds: 4,
    baths: 3,
    sqft: "2,400",
    address: "1234 Marine Dr, Oceanside, CA 92057",
    description: "Near Camp Pendleton",
    lotSize: "0.25 acres",
    hoa: "$150/mo",
    tags: ["Community Pool", "Walkable", "VA Loan Ready", "Marine Corps"],
    badges: ["3D Walkthrough"],
    type: "sale",
    postedBy: "Real Estate Agent",
    dateSaved: "2024-01-18",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    title: "Beautiful 4BR Near Camp Pendleton",
    nearestBase: "Camp Pendleton, CA",
  },
  {
    id: 102,
    image: "/placeholder.svg?height=200&width=300",
    price: "$1,900/mo",
    beds: 2,
    baths: 2,
    sqft: "1,200",
    address: "5678 Desert View Apt 204, El Paso, TX 79912",
    description: "Near Fort Bliss",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["Pet Friendly", "New Listing", "Parking", "Army"],
    badges: ["Coming Soon"],
    type: "rent",
    postedBy: "Owner",
    dateSaved: "2024-01-16",
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    title: "Modern 2BR Apartment Near Fort Bliss",
    nearestBase: "Fort Bliss, TX",
  },
  {
    id: 103,
    image: "/placeholder.svg?height=200&width=300",
    price: "$485,000",
    beds: 3,
    baths: 2,
    sqft: "1,800",
    address: "9012 Liberty Lane, Norfolk, VA 23502",
    description: "Near Naval Station Norfolk",
    lotSize: "0.15 acres",
    hoa: "$75/mo",
    tags: ["Walkable", "Community Pool", "VA Loan Ready", "Navy"],
    badges: [],
    type: "sale",
    postedBy: "Sample LLC",
    dateSaved: "2024-01-14",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    title: "Charming 3BR Near Naval Station",
    nearestBase: "Naval Station Norfolk, VA",
  },
  {
    id: 104,
    image: "/placeholder.svg?height=200&width=300",
    price: "$2,400/mo",
    beds: 3,
    baths: 2.5,
    sqft: "1,600",
    address: "3456 Base Housing Blvd, Colorado Springs, CO 80906",
    description: "Near Peterson Space Force Base",
    lotSize: "N/A",
    hoa: "$200/mo",
    tags: ["Pet Friendly", "Garage", "Mountain View", "Space Force"],
    badges: [],
    type: "rent",
    postedBy: "Real Estate Agent",
    dateSaved: "2024-01-12",
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    title: "Mountain View 3BR Rental",
    nearestBase: "Peterson Space Force Base, CO",
  },
  {
    id: 105,
    image: "/placeholder.svg?height=200&width=300",
    price: "$890,000",
    beds: 4,
    baths: 3.5,
    sqft: "2,800",
    address: "1122 Navy Pier Dr, San Diego, CA 92101",
    description: "Near Naval Base San Diego",
    lotSize: "0.18 acres",
    hoa: "$250/mo",
    tags: ["Ocean View", "VA Loan Ready", "Walkable", "Navy"],
    badges: ["3D Walkthrough", "Open Sat"],
    type: "sale",
    postedBy: "Real Estate Agent",
    dateSaved: "2024-01-10",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    title: "Luxury Ocean View Home",
    nearestBase: "Naval Base San Diego, CA",
  },
]
export default function Plug() {
  return null 
}
 function MyRealEstatePage() {
  const { user } = useUser()
  const { getParam, setParam, removeParam } = useUrlState()
  const [listings, setListings] = useState(mockUserListings)
  const [savedListings, setSavedListings] = useState(mockSavedListings)
  const [bookmarkedListings, setBookmarkedListings] = useState<number[]>([])
  const [deactivatedListings, setDeactivatedListings] = useState<number[]>([])
  const [expirationModalOpen, setExpirationModalOpen] = useState(false)
  const [selectedListingForExpiration, setSelectedListingForExpiration] = useState<any>(null)

  const [hasUnreadMessages, setHasUnreadMessages] = useState(true) // Mock state - would come from API

  const selectedListingId = getParam("listing")
  const selectedListing = useMemo(() => {
    if (!selectedListingId) return null
    const allListings = [...listings, ...savedListings]
    return allListings.find((listing) => listing.id.toString() === selectedListingId) || null
  }, [selectedListingId, listings, savedListings])

  const handleDeactivateListing = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (
      confirm(
        "The listing will be removed from the For Sale or For Rent listings. Click OK to change it from Active to Inactive status.",
      )
    ) {
      setDeactivatedListings((prev) => [...prev, id])
    }
  }

  const handleDeleteListing = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to permanently delete this listing? This action cannot be undone.")) {
      setListings(listings.filter((listing) => listing.id !== id))
      setDeactivatedListings((prev) => prev.filter((listingId) => listingId !== id))
    }
  }

  const handleReactivateListing = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Reactivate this listing? It will be visible to the public again.")) {
      setDeactivatedListings((prev) => prev.filter((listingId) => listingId !== id))
    }
  }

  const handleEditListing = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.href = `/realestate/newpost?edit=${id}`
  }

  const openPropertyDetails = (listing: any) => {
    setParam("listing", listing.id.toString())
  }

  const closePropertyDetails = () => {
    removeParam("listing")
  }

  const handleViewListing = (listing: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    openPropertyDetails(listing)
  }

  const handleCardClick = (listing: any) => {
    openPropertyDetails(listing)
  }

  const handleRemoveSavedListing = (id: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    if (confirm("Remove this property from your saved listings?")) {
      setSavedListings(savedListings.filter((listing) => listing.id !== id))
    }
  }

  const toggleBookmark = (id: number) => {
    setBookmarkedListings((prev) => (prev.includes(id) ? prev.filter((listingId) => listingId !== id) : [...prev, id]))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleShowExpiration = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedListingForExpiration(listing)
    setExpirationModalOpen(true)
  }

  const handleExtendListing = (days: number, price: number) => {
    alert(`Extending listing for ${days} days for $${price}. Payment integration would go here.`)
    setExpirationModalOpen(false)
  }

  const getExpirationDate = (listing: any) => {
    const posted = new Date(listing.datePosted)
    posted.setDate(posted.getDate() + 30)
    return posted.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getListingPlan = (listing: any) => {
    const plans = ["Core", "Plus", "Premium"]
    return plans[listing.id % 3]
  }

  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
              <p className="text-gray-600 mb-8">You need to be signed in to view your real estate listings.</p>
              <Button onClick={() => (window.location.href = "/signin")}>Sign In</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 py-8">
        {/* Header Section */}
        <div className="px-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Real Estate</h1>
              <p className="text-gray-600">Manage your property listings and saved properties</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/profile/realestate/inbox" className="hidden">
                <Button className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700">
                  <AlertCircle className="h-4 w-4" />
                  Inbox
                  {hasUnreadMessages && (
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                      <Mail className="h-3 w-3 text-white" />
                    </div>
                  )}
                </Button>
              </Link>
              <Link href="/realestate/packages">
                <Button className="flex items-center gap-2 bg-[#002244] hover:bg-[#001122]">
                  <Plus className="h-4 w-4 md:h-8 md:w-8" />
                  Post New Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs for My Listings and Saved Listings */}
        <div className="px-4">
          <Tabs defaultValue="my-listings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="my-listings" className="flex items-center gap-2">
                <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                My Listings ({listings.length})
              </TabsTrigger>
              <TabsTrigger value="saved-listings" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                Saved Listings ({savedListings.length})
              </TabsTrigger>
            </TabsList>

            {/* My Listings Tab */}
            <TabsContent value="my-listings" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-2 md:gap-6">
                <Card>
                  <CardContent className="p-2 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Total Listings</p>
                        <p className="text-lg md:text-2xl font-bold text-[#002244]">{listings.length}</p>
                      </div>
                      <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-2 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Active Listings</p>
                        <p className="text-lg md:text-2xl font-bold text-[#002244]">
                          {listings.filter((l) => l.status === "active").length}
                        </p>
                      </div>
                      <Eye className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hidden">
                  <CardContent className="p-2 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-lg md:text-2xl font-bold text-[#002244]">
                          {listings.reduce((sum, listing) => sum + listing.views, 0)}
                        </p>
                      </div>
                      <Eye className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hidden">
                  <CardContent className="p-2 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Total Inquiries</p>
                        <p className="text-lg md:text-2xl font-bold text-[#002244]">
                          {listings.reduce((sum, listing) => sum + listing.inquiries, 0)}
                        </p>
                      </div>
                      <Link href="/profile/realestate/inbox">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 md:gap-2 bg-transparent text-xs md:text-sm p-1 md:p-2"
                        >
                          <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="hidden md:inline">View Inbox</span>
                          <span className="md:hidden">Inbox</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* My Listings Grid */}
              {listings.length === 0 ? (
                <Card className="text-center">
                  <CardContent className="pt-12 pb-8">
                    <Home className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-gray-900 mb-4">No Listings Yet</h2>
                    <p className="text-gray-600 mb-8">Start by posting your first real estate listing.</p>
                    <Link href="/realestate/packages">
                      <Button className="bg-[#002244] hover:bg-[#001122]">Post Your First Listing</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid-container-profile">
                  {listings.map((listing) => {
                    const isDeactivated = deactivatedListings.includes(listing.id)

                    return (
                      <div key={listing.id} className="relative">
                        <PropertyCard
                          listing={listing}
                          onDetailsClick={() => handleCardClick(listing)}
                          isBookmarked={bookmarkedListings.includes(listing.id)}
                          onBookmarkToggle={() => toggleBookmark(listing.id)}
                          hideInfoButton={true}
                          hideBookmarkButton={true}
                          isDeactivated={isDeactivated}
                          showStatusBadges="all" // Changed from "active-pending-only" to "all" to show all 4 statuses
                        />
                        <div className="absolute top-2 right-2 flex gap-1 z-30">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="w-6 h-6 p-0 bg-white/90 hover:bg-white shadow-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                              <DropdownMenuItem onClick={(e) => handleViewListing(listing, e)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleEditListing(listing.id, e)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Listing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleShowExpiration(listing, e)}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Expiration
                              </DropdownMenuItem>
                              {isDeactivated ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={(e) => handleReactivateListing(listing.id, e)}
                                    className="text-green-600 focus:text-green-600 hover:bg-green-50 focus:bg-green-50"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Reactivate Listing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => handleDeleteListing(listing.id, e)}
                                    className="text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Permanently
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem
                                  onClick={(e) => handleDeactivateListing(listing.id, e)}
                                  className="text-orange-600 focus:text-orange-600 hover:bg-orange-50 focus:bg-orange-50"
                                >
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  {listing.status === "inactive" ? "Permanently Delete" : "Deactivate Listing"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Saved Listings Tab */}
            <TabsContent value="saved-listings" className="space-y-8">
              {/* Saved Listings Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
                <Card>
                  <CardContent className="p-2 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">Total Saved</p>
                        <p className="text-lg md:text-2xl font-bold text-[#002244]">{savedListings.length}</p>
                      </div>
                      <Bookmark className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-2 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">For Sale</p>
                        <p className="text-lg md:text-2xl font-bold text-[#002244]">
                          {savedListings.filter((l) => l.type === "sale").length}
                        </p>
                      </div>
                      <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-2 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600">For Rent</p>
                        <p className="text-lg md:text-2xl font-bold text-[#002244]">
                          {savedListings.filter((l) => l.type === "rent").length}
                        </p>
                      </div>
                      <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Saved Listings Grid */}
              {savedListings.length === 0 ? (
                <Card className="text-center">
                  <CardContent className="pt-12 pb-8">
                    <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-gray-900 mb-4">No Saved Listings</h2>
                    <p className="text-gray-600 mb-8">
                      Browse properties and bookmark the ones you're interested in to see them here.
                    </p>
                    <Link href="/realestate">
                      <Button className="bg-[#002244] hover:bg-[#001122]">Browse Properties</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid-container-profile">
                  {savedListings.map((listing) => (
                    <div key={listing.id} className="relative">
                      <PropertyCard
                        listing={listing}
                        onDetailsClick={() => handleCardClick(listing)}
                        isBookmarked={true}
                        onBookmarkToggle={(e) => handleRemoveSavedListing(listing.id, e)}
                        showStatusBadges="all" // Changed from "active-pending-only" to "all" to show all 4 statuses
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Property Details Modal */}
      <ListingModal listing={selectedListing} isOpen={!!selectedListing} onClose={closePropertyDetails} />

      {/* Expiration Modal */}
      <Dialog open={expirationModalOpen} onOpenChange={setExpirationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Listing Expiration
            </DialogTitle>
          </DialogHeader>

          {selectedListingForExpiration && (
            <div className="space-y-6">
              {/* Current Listing Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedListingForExpiration.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedListingForExpiration.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Plan: {getListingPlan(selectedListingForExpiration)}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    Expires: {getExpirationDate(selectedListingForExpiration)}
                  </span>
                </div>
              </div>

              {/* Extension Options */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Extension Options</h4>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between p-4 h-auto bg-transparent"
                    onClick={() => handleExtendListing(90, 25)}
                  >
                    <span>Extend 90 days</span>
                    <span className="font-semibold text-[#002244]">$25</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between p-4 h-auto bg-transparent"
                    onClick={() => handleExtendListing(180, 44.94)}
                  >
                    <span>Extend 180 days</span>
                    <span className="font-semibold text-[#002244]">$44.94</span>
                  </Button>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setExpirationModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
