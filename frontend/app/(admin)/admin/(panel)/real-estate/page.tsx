"use client"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PropertyCard } from "@/components/property-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Star,
  Copy,
  Flag,
  Edit,
  Users,
  Home,
  AlertCircle,
  Shield,
  Calendar,
  ArrowUpDown,
} from "lucide-react"

const mockListings = [
  {
    id: "1",
    title: "Beautiful 3BR Home Near Fort Bragg",
    address: "123 Military Way, Fayetteville, NC 28301",
    price: "$2,400/month",
    rentPrice: "$2,400/mo",
    salePrice: "$285,000",
    type: "Both",
    beds: 3,
    baths: 2,
    sqft: "1,850",
    status: "pending",
    submittedDate: "2024-01-15",
    nearestBase: "Fort Bragg",
    baseDistance: "2.3 miles",
    image: "/placeholder.svg?height=200&width=300",
    images: ["/placeholder.svg?height=200&width=300"],
    postedBy: "John Smith",
    postedById: "user123",
    flaggedReasons: [],
    expiresIn: 45,
    package: "free",
    state: "NC",
    featured: false,
    views: 234,
    messages: 12,
    duplicateWarning: false,
    policyFlags: [],
    yearBuilt: 2018,
    hoaFee: "$150/month",
    tags: ["VA Eligible", "PCS-Ready"],
    badges: [],
    description:
      "Spacious military-friendly home with updated kitchen and large backyard. Perfect for families stationed at Fort Bragg.",
    ownershipConflict: false,
    freeListingUsed: false,
  },
  {
    id: "2",
    title: "Modern 2BR Apartment",
    address: "456 Base Blvd, Norfolk, VA 23511",
    price: "$1,800/month",
    rentPrice: "$1,800/mo",
    salePrice: null,
    type: "Rent",
    beds: 2,
    baths: 1,
    sqft: "1,200",
    status: "reported",
    submittedDate: "2024-01-10",
    nearestBase: "Naval Station Norfolk",
    baseDistance: "1.1 miles",
    image: "/placeholder.svg?height=200&width=300",
    images: ["/placeholder.svg?height=200&width=300"],
    postedBy: "Sarah Johnson",
    postedById: "user456",
    flaggedReasons: ["Duplicate listing", "Incorrect pricing"],
    expiresIn: 12,
    package: "premium",
    state: "VA",
    featured: true,
    views: 456,
    messages: 8,
    duplicateWarning: true,
    policyFlags: ["Missing SCRA clause"],
    yearBuilt: 2020,
    hoaFee: null,
    tags: ["Assumable Loan"],
    badges: ["3D Walkthrough"],
    description: "Modern apartment with premium amenities and military discounts available.",
    ownershipConflict: false,
    freeListingUsed: true,
  },
  {
    id: "3",
    title: "Spacious 4BR Family Home",
    address: "789 Oak Street, San Diego, CA 92101",
    price: "$3,200/month",
    rentPrice: "$3,200/mo",
    salePrice: "$650,000",
    type: "Both",
    beds: 4,
    baths: 3,
    sqft: "2,400",
    status: "expiring",
    submittedDate: "2023-12-20",
    nearestBase: "Naval Base San Diego",
    baseDistance: "3.7 miles",
    image: "/placeholder.svg?height=200&width=300",
    images: ["/placeholder.svg?height=200&width=300"],
    postedBy: "Mike Wilson",
    postedById: "user789",
    flaggedReasons: [],
    expiresIn: 3,
    package: "premium",
    state: "CA",
    featured: false,
    views: 789,
    messages: 25,
    duplicateWarning: false,
    policyFlags: [],
    yearBuilt: 2015,
    hoaFee: "$200/month",
    tags: ["3D Tour", "VA Eligible"],
    badges: ["3D Walkthrough"],
    description: "Beautiful family home in prime location with ocean views and military-friendly neighborhood.",
    ownershipConflict: true,
    freeListingUsed: false,
  },
  {
    id: "4",
    title: "Cozy 2BR Townhouse - Duplicate Address",
    address: "456 Base Blvd, Norfolk, VA 23511",
    price: "$1,750/month",
    rentPrice: "$1,750/mo",
    salePrice: null,
    type: "Rent",
    beds: 2,
    baths: 1.5,
    sqft: "1,100",
    status: "duplicate",
    submittedDate: "2024-01-12",
    nearestBase: "Naval Station Norfolk",
    baseDistance: "1.1 miles",
    image: "/placeholder.svg?height=200&width=300",
    images: ["/placeholder.svg?height=200&width=300"],
    postedBy: "Tom Davis",
    postedById: "user101",
    flaggedReasons: ["Duplicate address"],
    expiresIn: 30,
    package: "free",
    state: "VA",
    featured: false,
    views: 45,
    messages: 2,
    duplicateWarning: true,
    policyFlags: [],
    yearBuilt: 2020,
    hoaFee: null,
    tags: [],
    badges: [],
    description: "Cozy townhouse perfect for military couples.",
    ownershipConflict: false,
    freeListingUsed: true,
  },
]

export default function RealEstatePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectListingId, setRejectListingId] = useState("")
  const [listings, setListings] = useState(mockListings)
  const [successMessage, setSuccessMessage] = useState("")
  const [rejectNotes, setRejectNotes] = useState("")
  const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false)
  const [rejectionComments, setRejectionComments] = useState<{ [userId: string]: string }>({})
  const [showReportedDetailsDialog, setShowReportedDetailsDialog] = useState(false)
  const [selectedReportedListing, setSelectedReportedListing] = useState<any>(null)

  const [filters, setFilters] = useState({
    status: "all",
    package: "all",
    state: "all",
    owner: "",
    dateFrom: "",
    dateTo: "",
    nearestBase: "all",
  })

  const [showPropertyDetail, setShowPropertyDetail] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [adminAction, setAdminAction] = useState("")
  const [adminComment, setAdminComment] = useState("")
  const [showAdminActionDialog, setShowAdminActionDialog] = useState(false)
  const [showExpirationDialog, setShowExpirationDialog] = useState(false)
  const [selectedExpirationListings, setSelectedExpirationListings] = useState<any[]>([])
  const [newExpirationDays, setNewExpirationDays] = useState<{ [key: string]: number }>({})
  const [sortBy, setSortBy] = useState("title") // Added sorting state

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["all", "draft", "pending", "reported", "expiring", "duplicates"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const updateURL = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.replace(`/admin/real-estate?${params.toString()}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        )
      case "reported":
        return (
          <Badge variant="destructive">
            <Flag className="h-3 w-3 mr-1" />
            Reported
          </Badge>
        )
      case "expiring":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        )
      case "duplicate":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            <Copy className="h-3 w-3 mr-1" />
            Duplicate
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-600">
            <Edit className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getFilteredListings = (status: string) => {
    return listings.filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.postedBy.toLowerCase().includes(searchTerm.toLowerCase())

      let matchesStatus = false
      switch (status) {
        case "pending":
          matchesStatus = listing.status === "pending"
          break
        case "reported":
          matchesStatus = listing.status === "reported"
          break
        case "expiring":
          matchesStatus = listing.status === "expiring"
          break
        case "duplicates":
          matchesStatus = listing.status === "duplicate" || listing.duplicateWarning
          break
        case "all":
          matchesStatus = true
          break
        case "draft":
          matchesStatus = listing.status === "draft"
          break
        default:
          matchesStatus = listing.status === status
      }

      const matchesFilters =
        (filters.package === "all" || listing.package === filters.package) &&
        (filters.state === "all" || listing.state === filters.state) &&
        (filters.owner === "" || listing.postedBy.toLowerCase().includes(filters.owner.toLowerCase())) &&
        (filters.nearestBase === "all" || listing.nearestBase === filters.nearestBase)

      return matchesSearch && matchesStatus && matchesFilters
    })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    updateURL(value)
    setSelectedListings([])
  }

  const handleSelectListing = (listingId: string) => {
    setSelectedListings((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId],
    )
  }

  const handleSelectAll = (listings: any[]) => {
    const listingIds = listings.map((l) => l.id)
    setSelectedListings((prev) => (prev.length === listingIds.length ? [] : listingIds))
  }

  const handleBulkAction = (action: string) => {
    if (action === "reject") {
      const selectedListingData = listings.filter((listing) => selectedListings.includes(listing.id))
      const uniqueUsers = Array.from(new Set(selectedListingData.map((listing) => listing.postedById)))
      const initialComments: { [userId: string]: string } = {}
      uniqueUsers.forEach((userId) => {
        initialComments[userId] = ""
      })
      setRejectionComments(initialComments)
      setShowBulkRejectDialog(true)
    } else if (action === "adjust-expiration") {
      const selectedListingData = listings.filter((listing) => selectedListings.includes(listing.id))
      setSelectedExpirationListings(selectedListingData)
      const initialDays: { [key: string]: number } = {}
      selectedListingData.forEach((listing) => {
        initialDays[listing.id] = listing.expiresIn
      })
      setNewExpirationDays(initialDays)
      setSortBy("title") // Reset sort when opening dialog
      setShowExpirationDialog(true)
    } else {
      setListings((prev) =>
        prev.map((listing) => {
          if (selectedListings.includes(listing.id)) {
            switch (action) {
              case "approve":
                return { ...listing, status: "approved" }
              case "feature":
                return { ...listing, featured: !listing.featured }
              default:
                return listing
            }
          }
          return listing
        }),
      )
      setSuccessMessage(`Successfully ${action}d ${selectedListings.length} listing(s)`)
      setSelectedListings([])
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleAction = (listingId: string, action: string) => {
    if (action === "reject") {
      setRejectListingId(listingId)
      setShowRejectDialog(true)
    } else {
      setListings((prev) =>
        prev.map((listing) => {
          if (listing.id === listingId) {
            switch (action) {
              case "approve":
                return { ...listing, status: "approved" }
              case "request-edits":
                return { ...listing, status: "needs-edits" }
              case "feature":
                return { ...listing, featured: !listing.featured }
              case "hide":
                return { ...listing, status: "hidden" }
              case "expire":
                return { ...listing, status: "expired", expiresIn: 0 }
              case "impersonate":
                return { ...listing, status: "impersonated" }
              default:
                return listing
            }
          }
          return listing
        }),
      )
      const actionText = action === "request-edits" ? "requested edits for" : `${action}d`
      setSuccessMessage(`Successfully ${actionText} listing`)
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleReject = () => {
    if (rejectListingId === "bulk") {
      setListings((prev) =>
        prev.map((listing) => {
          if (selectedListings.includes(listing.id)) {
            return {
              ...listing,
              status: "rejected",
              rejectionReason: rejectReason,
              rejectionNotes: rejectNotes,
            }
          }
          return listing
        }),
      )
      setSuccessMessage(`Successfully rejected ${selectedListings.length} listing(s)`)
      setSelectedListings([])
    } else {
      setListings((prev) =>
        prev.map((listing) => {
          if (listing.id === rejectListingId) {
            return {
              ...listing,
              status: "rejected",
              rejectionReason: rejectReason,
              rejectionNotes: rejectNotes,
            }
          }
          return listing
        }),
      )
      setSuccessMessage("Successfully rejected listing")
    }
    setShowRejectDialog(false)
    setRejectReason("")
    setRejectNotes("")
    setRejectListingId("")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleEditListing = (listingId: string) => {
    router.push(`/admin/real-estate/listings/${listingId}`)
  }

  const handlePropertyClick = (property: any) => {
    window.open(`/realestate?listing=${property.id}`, "_blank")
  }

  const handleExpirationUpdate = () => {
    setListings((prev) =>
      prev.map((listing) => {
        if (selectedListings.includes(listing.id)) {
          const newDays = newExpirationDays[listing.id] || listing.expiresIn
          if (newDays === 0 || newDays === null || newDays === undefined) {
            return { ...listing, expiresIn: 0, status: "expired" }
          }
          return { ...listing, expiresIn: newDays }
        }
        return listing
      }),
    )
    setSuccessMessage(`Successfully updated expiration for ${selectedListings.length} listing(s)`)
    setSelectedListings([])
    setShowExpirationDialog(false)
    setSelectedExpirationListings([])
    setNewExpirationDays({})
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const updateExpirationDays = (listingId: string, days: number) => {
    setNewExpirationDays((prev) => ({
      ...prev,
      [listingId]: days,
    }))
  }

  const handleBulkReject = () => {
    const selectedListingData = listings.filter((listing) => selectedListings.includes(listing.id))

    setListings((prev) =>
      prev.map((listing) => {
        if (selectedListings.includes(listing.id)) {
          return {
            ...listing,
            status: "rejected",
            rejectionReason: "Admin rejection",
            rejectionNotes: rejectionComments[listing.postedById] || "",
          }
        }
        return listing
      }),
    )

    setSuccessMessage(`Successfully rejected ${selectedListings.length} listing(s) with comments`)
    setSelectedListings([])
    setShowBulkRejectDialog(false)
    setRejectionComments({})
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const updateRejectionComment = (userId: string, comment: string) => {
    setRejectionComments((prev) => ({
      ...prev,
      [userId]: comment,
    }))
  }

  const handleShowReportedDetails = (listing: any) => {
    setSelectedReportedListing(listing)
    setShowReportedDetailsDialog(true)
  }

  const queueCounts = useMemo(() => {
    return {
      all: listings.length,
      draft: getFilteredListings("draft").length,
      pending: getFilteredListings("pending").length,
      reported: getFilteredListings("reported").length,
      expiring: getFilteredListings("expiring").length,
      duplicates: getFilteredListings("duplicates").length,
    }
  }, [listings, searchTerm, filters])

  const currentListings = useMemo(() => {
    return getFilteredListings(activeTab)
  }, [activeTab, listings, searchTerm, filters])

  const getSortedExpirationListings = () => {
    const sortedListings = [...selectedExpirationListings]

    switch (sortBy) {
      case "id":
        return sortedListings.sort((a, b) => a.id.localeCompare(b.id))
      case "title":
        return sortedListings.sort((a, b) => a.title.localeCompare(b.title))
      case "package":
        return sortedListings.sort((a, b) => {
          if (a.package === "premium" && b.package === "free") return -1
          if (a.package === "free" && b.package === "premium") return 1
          return 0
        })
      case "expiration-asc":
        return sortedListings.sort(
          (a, b) => (newExpirationDays[a.id] || a.expiresIn) - (newExpirationDays[b.id] || b.expiresIn),
        )
      case "expiration-desc":
        return sortedListings.sort(
          (a, b) => (newExpirationDays[b.id] || b.expiresIn) - (newExpirationDays[a.id] || a.expiresIn),
        )
      default:
        return sortedListings
    }
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real Estate Management</h1>
          <p className="text-gray-600">Review and manage property listings across all military bases</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Public Listings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {selectedListings.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">{selectedListings.length} listing(s) selected</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedListings([])}>
                  Clear Selection
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push("/realestate/newpost?edit=1")}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" onClick={() => handleBulkAction("approve")}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction("reject")}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>

                <Button variant="outline" size="sm" onClick={() => handleBulkAction("adjust-expiration")}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Adjust Expiration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            All ({queueCounts.all})
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Draft ({queueCounts.draft})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({queueCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="reported" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Reported ({queueCounts.reported})
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Expiring ({queueCounts.expiring})
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Duplicates ({queueCounts.duplicates})
          </TabsTrigger>
        </TabsList>

        {["all", "draft", "pending", "reported", "expiring", "duplicates"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {currentListings.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Checkbox
                  checked={selectedListings.length === currentListings.length}
                  onCheckedChange={() => handleSelectAll(currentListings)}
                />
                <Label>Select All ({currentListings.length} listings)</Label>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentListings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <div className="absolute top-3 left-3 z-20">
                    <Checkbox
                      checked={selectedListings.includes(listing.id)}
                      onCheckedChange={() => handleSelectListing(listing.id)}
                      className="bg-white/95 border-2 shadow-sm"
                    />
                  </div>

                  <div className="absolute top-3 left-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog>
                      <DialogContent align="end">
                        <DropdownMenuItem onClick={() => handleEditListing(listing.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Listing
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(listing.id, "approve")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(listing.id, "reject")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject with Reason
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(listing.id, "request-edits")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Request Edits
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(listing.id, "feature")}>
                          <Star className="h-4 w-4 mr-2" />
                          {listing.featured ? "Unfeature" : "Feature"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(listing.id, "expire")}>
                          <Clock className="h-4 w-4 mr-2" />
                          Expire Now
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(listing.id, "impersonate")}>
                          <Users className="h-4 w-4 mr-2" />
                          Impersonate Owner
                        </DropdownMenuItem>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <PropertyCard
                    listing={{
                      ...listing,
                      beds: listing.beds,
                      baths: listing.baths,
                      sqft: listing.sqft,
                      address: listing.address,
                      price:
                        listing.type === "Both"
                          ? `${listing.salePrice} | ${listing.rentPrice}`
                          : listing.type === "Sale"
                            ? listing.salePrice
                            : listing.rentPrice,
                    }}
                    onDetailsClick={() => handlePropertyClick(listing)}
                    isBookmarked={false}
                    onBookmarkToggle={() => {}}
                    showStatusBadges="all"
                  />

                  <div className="absolute bottom-2 right-2 z-30">
                    <button
                      onClick={() => handleShowReportedDetails(listing)}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border cursor-pointer hover:bg-white transition-colors"
                    >
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {currentListings.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-8 text-gray-500">
                    <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No listings found for this category</p>
                    <p className="text-sm">Try adjusting your filters or search terms</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={showExpirationDialog} onOpenChange={setShowExpirationDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adjust Listing Expiration</DialogTitle>
            <DialogDescription>
              Update the expiration dates for the selected listings. Changes will be applied immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 pb-4 border-b">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Label htmlFor="sort-select" className="text-sm font-medium">
              Sort by:
            </Label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-[200px]"
            >
              <option value="title">Title (A-Z)</option>
              <option value="id">Listing ID</option>
              <option value="package">Package Type</option>
              <option value="expiration-asc">Expiration (Low to High)</option>
              <option value="expiration-desc">Expiration (High to Low)</option>
            </select>
          </div>

          <div className="space-y-4">
            {getSortedExpirationListings().map((listing) => {
              const currentDate = new Date()
              const expirationDate = new Date(
                currentDate.getTime() + (newExpirationDays[listing.id] || listing.expiresIn) * 24 * 60 * 60 * 1000,
              )

              return (
                <div key={listing.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{listing.title}</h4>
                      <p className="text-xs text-gray-500">{listing.address}</p>
                    </div>
                    <Badge variant={listing.package === "premium" ? "default" : "secondary"}>{listing.package}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Listing ID</Label>
                      <p className="font-mono">{listing.id}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Package Type</Label>
                      <p className="capitalize">{listing.package}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`days-${listing.id}`} className="text-xs font-medium text-gray-600">
                        Days Until Expiration
                      </Label>
                      <Input
                        id={`days-${listing.id}`}
                        type="number"
                        min="0"
                        max="365"
                        value={newExpirationDays[listing.id] || listing.expiresIn}
                        onChange={(e) => updateExpirationDays(listing.id, Number.parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Expiration Date</Label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">
                        {expirationDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpirationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExpirationUpdate}>Update Expiration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkRejectDialog} onOpenChange={setShowBulkRejectDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reject Selected Listings</DialogTitle>
            <DialogDescription>
              Add comments for each user whose listings will be rejected. These messages will be sent to the users along
              with the rejection notification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {Object.keys(rejectionComments).map((userId) => {
              const userListings = listings.filter(
                (listing) => selectedListings.includes(listing.id) && listing.postedById === userId,
              )
              const userName = userListings[0]?.postedBy || userId

              return (
                <div key={userId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{userName}</h4>
                      <p className="text-sm text-gray-500">
                        {userListings.length} listing{userListings.length > 1 ? "s" : ""} selected
                      </p>
                    </div>
                    <Badge variant="outline">{userListings.length}</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`comment-${userId}`} className="text-sm font-medium">
                      Rejection Message for {userName}
                    </Label>
                    <textarea
                      id={`comment-${userId}`}
                      placeholder="Enter your message to the user explaining the rejection..."
                      value={rejectionComments[userId]}
                      onChange={(e) => updateRejectionComment(userId, e.target.value)}
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="text-xs text-gray-500">
                    <p className="font-medium">Affected listings:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {userListings.map((listing) => (
                        <li key={listing.id}>{listing.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject All with Comments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReportedDetailsDialog} onOpenChange={setShowReportedDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing Details & Reports</DialogTitle>
            <DialogDescription>
              Detailed information about this listing including any reports or flags.
            </DialogDescription>
          </DialogHeader>

          {selectedReportedListing && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-lg">{selectedReportedListing.title}</h4>
                <p className="text-sm text-gray-600">{selectedReportedListing.address}</p>
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedReportedListing.status)}
                  <span className="text-sm text-gray-500">{selectedReportedListing.views} views</span>
                  <span className="text-sm text-gray-500">{selectedReportedListing.messages} messages</span>
                </div>
              </div>

              {/* Listing Details */}
              <div className="border rounded-lg p-4 space-y-3">
                <h5 className="font-medium">Listing Information</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Posted by:</span>
                    <p>{selectedReportedListing.postedBy}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Package:</span>
                    <p className="capitalize">{selectedReportedListing.package}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Submitted:</span>
                    <p>{selectedReportedListing.submittedDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Expires in:</span>
                    <p>{selectedReportedListing.expiresIn} days</p>
                  </div>
                </div>
              </div>

              {/* Flags and Warnings */}
              {(selectedReportedListing.freeListingUsed ||
                selectedReportedListing.ownershipConflict ||
                selectedReportedListing.duplicateWarning ||
                selectedReportedListing.flaggedReasons.length > 0) && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h5 className="font-medium text-red-600">Flags & Warnings</h5>
                  <div className="space-y-2">
                    {selectedReportedListing.freeListingUsed && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Free listing quota already used</span>
                      </div>
                    )}
                    {selectedReportedListing.ownershipConflict && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Ownership conflict detected</span>
                      </div>
                    )}
                    {selectedReportedListing.duplicateWarning && (
                      <div className="flex items-center gap-2">
                        <Copy className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Potential duplicate listing</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reported Issues */}
              {selectedReportedListing.flaggedReasons.length > 0 && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h5 className="font-medium text-red-600">Reported Issues</h5>
                  <div className="space-y-2">
                    {selectedReportedListing.flaggedReasons.map((reason: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policy Flags */}
              {selectedReportedListing.policyFlags && selectedReportedListing.policyFlags.length > 0 && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h5 className="font-medium text-orange-600">Policy Violations</h5>
                  <div className="space-y-2">
                    {selectedReportedListing.policyFlags.map((flag: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags and Badges */}
              {(selectedReportedListing.tags.length > 0 || selectedReportedListing.badges.length > 0) && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h5 className="font-medium">Tags & Badges</h5>
                  <div className="space-y-2">
                    {selectedReportedListing.tags.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Tags:</span>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {selectedReportedListing.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedReportedListing.badges.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Badges:</span>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {selectedReportedListing.badges.map((badge: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportedDetailsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => handleEditListing(selectedReportedListing?.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
