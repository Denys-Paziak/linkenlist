"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PropertyCard } from "@/components/property-card"
import {
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  DollarSign,
  AlertTriangle,
  ImageIcon,
  MessageSquare,
  CheckCircle,
  XCircle,
  TrendingUp,
  Mail,
  Bell,
  FileText,
  Shield,
  MoreVertical,
  Calendar,
} from "lucide-react"

const mockListings = [
  {
    id: 1,
    title: "Modern 3BR Apartment",
    address: "123 Oak Street, Norfolk, VA 23502",
    price: "$2,400/mo",
    beds: 3,
    baths: 2,
    sqft: "1,200",
    status: "active",
    user: "john.doe@email.com",
    datePosted: "2024-01-15",
    expires: "2024-04-15",
    views: 245,
    inquiries: 12,
    flagged: false,
    featured: true,
    image: "/modern-apartment-living.png",
    type: "rent",
    badges: ["Active"],
    description: "Near Naval Station Norfolk",
    lotSize: "N/A",
    hoa: "$150/mo",
    tags: ["Pet Friendly", "Military Friendly", "Parking Included"],
    images: ["/modern-apartment-living.png"],
    nearestBase: "Naval Station Norfolk, VA",
    postedBy: "john.doe@email.com",
  },
  {
    id: 2,
    title: "Cozy 2BR House",
    address: "456 Pine Avenue, Virginia Beach, VA 23451",
    price: "$1,800/mo",
    beds: 2,
    baths: 2,
    sqft: "1,100",
    status: "pending",
    user: "jane.smith@email.com",
    datePosted: "2024-01-20",
    expires: "2024-04-20",
    views: 89,
    inquiries: 3,
    flagged: true,
    featured: false,
    image: "/cozy-house.png",
    type: "rent",
    badges: ["Under Review"],
    description: "Near Naval Station Norfolk",
    lotSize: "0.15 acres",
    hoa: "$0/mo",
    tags: ["Furnished", "Utilities Included"],
    images: ["/cozy-house.png"],
    nearestBase: "Naval Station Norfolk, VA",
    postedBy: "jane.smith@email.com",
  },
  {
    id: 3,
    title: "Luxury Condo Downtown",
    address: "789 Maple Drive, Richmond, VA 23220",
    price: "$3,200/mo",
    beds: 2,
    baths: 2.5,
    sqft: "1,800",
    status: "expired",
    user: "mike.wilson@email.com",
    datePosted: "2023-12-01",
    expires: "2024-03-01",
    views: 567,
    inquiries: 28,
    flagged: false,
    featured: false,
    image: "/luxury-condo-interior.png",
    type: "rent",
    badges: ["Expired"],
    description: "Near Naval Station Norfolk",
    lotSize: "N/A",
    hoa: "$200/mo",
    tags: ["Ocean View", "Walkable"],
    images: ["/luxury-condo-interior.png"],
    nearestBase: "Naval Station Norfolk, VA",
    postedBy: "mike.wilson@email.com",
  },
  {
    id: 4,
    title: "Family Home for Sale",
    address: "321 Cedar Lane, Chesapeake, VA 23320",
    price: "$485,000",
    beds: 4,
    baths: 3,
    sqft: "2,800",
    status: "active",
    user: "sarah.johnson@email.com",
    datePosted: "2024-01-18",
    expires: "2024-04-18",
    views: 156,
    inquiries: 18,
    flagged: false,
    featured: true,
    image: "/cozy-family-house.png",
    type: "sale",
    badges: ["Featured"],
    description: "Near Naval Station Norfolk",
    lotSize: "0.5 acres",
    hoa: "$0/mo",
    tags: ["Large Family", "Military Friendly", "Garage"],
    images: ["/cozy-family-house.png"],
    nearestBase: "Naval Station Norfolk, VA",
    postedBy: "sarah.johnson@email.com",
  },
]

export function RealEstateAdmin() {
  const [selectedTab, setSelectedTab] = useState("listings")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedListings, setSelectedListings] = useState<number[]>([])

  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [templateContent, setTemplateContent] = useState({
    "Listing Approved": {
      subject: "Your Listing Has Been Approved",
      content:
        "Congratulations! Your property listing has been approved and is now live on LinkEnlist. You can view and manage your listing from your dashboard.",
    },
    "Listing Rejected": {
      subject: "Listing Review Required",
      content:
        "We need to discuss some aspects of your listing before it can go live. Please review our guidelines and make the necessary adjustments.",
    },
    "Expiration Warning": {
      subject: "Your Listing Will Expire Soon",
      content:
        "Your property listing will expire in 7 days. To keep your listing active, please renew it before the expiration date.",
    },
    "Compliance Issue": {
      subject: "Compliance Review Required",
      content:
        "Your listing has been flagged for a compliance review. Please ensure all information meets our fair housing guidelines.",
    },
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      archived: "bg-gray-100 text-gray-800",
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on listings:`, selectedListings)
    // Implementation for bulk actions
  }

  const handleTemplateEdit = (templateName: string) => {
    setEditingTemplate(templateName)
  }

  const handleTemplateSave = () => {
    console.log(`Saving template: ${editingTemplate}`)
    setEditingTemplate(null)
  }

  const updateTemplateContent = (field: "subject" | "content", value: string) => {
    if (editingTemplate) {
      setTemplateContent((prev) => ({
        ...prev,
        [editingTemplate]: {
          ...prev[editingTemplate as keyof typeof prev],
          [field]: value,
        },
      }))
    }
  }

  const handleViewDetails = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Viewing details for listing:", listing.id)
    // Implementation for viewing listing details
  }

  const handleEditListing = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Editing listing:", listing.id)
    // Implementation for editing listing
  }

  const handleExpiration = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Managing expiration for listing:", listing.id)
    // Implementation for expiration management
  }

  const handleDeactivateListing = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to deactivate "${listing.title}"?`)) {
      console.log("Deactivating listing:", listing.id)
      // Implementation for deactivating listing
    }
  }

  const handleApproveListing = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Approving listing:", listing.id)
    // Implementation for approving listing
  }

  const handleRejectListing = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Rejecting listing:", listing.id)
    // Implementation for rejecting listing
  }

  const handleFeatureListing = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Featuring listing:", listing.id)
    // Implementation for featuring listing
  }

  const handleCardClick = (listing: any) => {
    console.log("Opening property details for:", listing.id)
    // Implementation for opening property details modal
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real Estate Management</h1>
          <p className="text-gray-600">Manage property listings, pricing, and compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="expiration">Expiration</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        {/* Listing Management Tab */}
        <TabsContent value="listings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Listing Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search listings by title, location, or user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Bulk Actions */}
              {selectedListings.length > 0 && (
                <div className="flex gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">{selectedListings.length} listing(s) selected</span>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("reject")}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("feature")}>
                    <Star className="h-4 w-4 mr-1" />
                    Feature
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </div>
              )}

              <div className="grid-container-profile">
                {mockListings.map((listing) => (
                  <div key={listing.id} className="relative">
                    <PropertyCard
                      listing={listing}
                      onDetailsClick={() => handleCardClick(listing)}
                      isBookmarked={false}
                      onBookmarkToggle={() => {}}
                      hideInfoButton={true}
                      hideBookmarkButton={true}
                      showStatusBadges="all"
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
                          <DropdownMenuItem onClick={(e) => handleViewDetails(listing, e)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleEditListing(listing, e)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Listing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleExpiration(listing, e)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Expiration
                          </DropdownMenuItem>
                          {listing.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={(e) => handleApproveListing(listing, e)}
                                className="text-green-600 focus:text-green-600 hover:bg-green-50 focus:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Listing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => handleRejectListing(listing, e)}
                                className="text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Listing
                              </DropdownMenuItem>
                            </>
                          )}
                          {!listing.featured && (
                            <DropdownMenuItem onClick={(e) => handleFeatureListing(listing, e)}>
                              <Star className="h-4 w-4 mr-2" />
                              Feature Listing
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={(e) => handleDeactivateListing(listing, e)}
                            className="text-orange-600 focus:text-orange-600 hover:bg-orange-50 focus:bg-orange-50"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Deactivate Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiration & Extension Controls Tab */}
        <TabsContent value="expiration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Clock className="h-5 w-5" />
                  Expiring in 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-gray-600">Listings need attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-5 w-5" />
                  Expiring in 14 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-sm text-gray-600">Listings to monitor</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Clock className="h-5 w-5" />
                  Expiring in 30 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-sm text-gray-600">Upcoming expirations</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Extension Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Extension Period</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Auto-Extension Rules</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-extend" />
                    <Label htmlFor="auto-extend">Enable for premium users</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing & Monetization Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-sm text-green-600">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Base Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,200</div>
                <p className="text-sm text-gray-600">164 listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Featured Upgrades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,850</div>
                <p className="text-sm text-gray-600">57 upgrades</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Extensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,400</div>
                <p className="text-sm text-gray-600">28 extensions</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Tiers Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Base Listing Fee</Label>
                  <Input type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label>Featured Upgrade</Label>
                  <Input type="number" defaultValue="25" />
                </div>
                <div className="space-y-2">
                  <Label>Extension Fee (30 days)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
              </div>
              <Button>Update Pricing</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderation & Compliance Tab */}
        <TabsContent value="moderation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Flagged Listings Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-sm text-gray-600">Require immediate review</p>
                <Button className="mt-2" size="sm">
                  Review Queue
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fair Housing Scan</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Flag Suspicious Content</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Image Content Filter</span>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Listing ID</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-25 14:30</TableCell>
                    <TableCell>Listing Approved</TableCell>
                    <TableCell>admin@linkenlist.com</TableCell>
                    <TableCell>12345</TableCell>
                    <TableCell>Manual review completed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-25 13:15</TableCell>
                    <TableCell>Content Edited</TableCell>
                    <TableCell>john.doe@email.com</TableCell>
                    <TableCell>12344</TableCell>
                    <TableCell>Updated property description</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media & Assets Tab */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Moderation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-sm text-gray-600">Total Images</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">23</div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">5</div>
                  <p className="text-sm text-gray-600">Flagged</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1,206</div>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
              <Button>Review Pending Images</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bulk Image Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Compress All Images
                </Button>
                <Button variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Thumbnails
                </Button>
                <Button variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Watermarks
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics & Insights Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,678</div>
                <p className="text-sm text-green-600">+12% this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-sm text-green-600">+8% this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.7%</div>
                <p className="text-sm text-red-600">-0.3% this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-sm text-blue-600">+5 this week</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Top Performing Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead>Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Luxury Condo Downtown</TableCell>
                    <TableCell>567</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>4.9%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Modern 3BR Apartment</TableCell>
                    <TableCell>245</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>4.9%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication & Automation Tab */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Automated Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Expiration Reminders</div>
                    <div className="text-sm text-gray-600">Send 7 days before expiration</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Welcome Messages</div>
                    <div className="text-sm text-gray-600">Send to new listing creators</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Performance Reports</div>
                    <div className="text-sm text-gray-600">Weekly listing performance summary</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Message Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleTemplateEdit("Listing Approved")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Listing Approved
                </Button>
                <Button variant="outline" onClick={() => handleTemplateEdit("Listing Rejected")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Listing Rejected
                </Button>
                <Button variant="outline" onClick={() => handleTemplateEdit("Expiration Warning")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Expiration Warning
                </Button>
                <Button variant="outline" onClick={() => handleTemplateEdit("Compliance Issue")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Compliance Issue
                </Button>
              </div>

              <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Template: {editingTemplate}</DialogTitle>
                  </DialogHeader>
                  {editingTemplate && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input
                          value={templateContent[editingTemplate as keyof typeof templateContent]?.subject || ""}
                          onChange={(e) => updateTemplateContent("subject", e.target.value)}
                          placeholder="Email subject line"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message Content</Label>
                        <Textarea
                          value={templateContent[editingTemplate as keyof typeof templateContent]?.content || ""}
                          onChange={(e) => updateTemplateContent("content", e.target.value)}
                          placeholder="Enter message content..."
                          className="min-h-32"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleTemplateSave}>Save Template</Button>
                        <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create New Template</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Message Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Template Name</Label>
                      <Input placeholder="Enter template name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input placeholder="Email subject line" />
                    </div>
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea placeholder="Enter message content..." className="min-h-32" />
                    </div>
                    <div className="flex gap-2">
                      <Button>Save Template</Button>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
