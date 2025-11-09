"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  ImageIcon,
  Star,
  Clock,
  MapPin,
  Home,
  History,
  Shield,
  SearchIcon,
} from "lucide-react"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"

interface ListingData {
  id: string
  title: string
  description: string
  price: string
  beds: number
  baths: number
  sqft: string
  address: string
  city: string
  state: string
  zipCode: string
  nearestBase: string
  baseDistance: string
  status: string
  postedBy: string
  submittedDate: string
  expiresDate: string
  images: string[]
  coverImageIndex: number
  amenities: string[]
  petPolicy: string
  leaseTerm: string
  availableDate: string
  contactEmail: string
  contactPhone: string
  virtualTourUrl: string
  metaTitle: string
  metaDescription: string
  seoKeywords: string
  canonicalUrl: string
  indexable: boolean
  complianceChecks: {
    fairHousing: boolean
    contentFilter: boolean
    imageModeration: boolean
    addressVerification: boolean
  }
  auditLog: Array<{
    id: string
    action: string
    user: string
    timestamp: string
    details: string
  }>
}

export default function ListingEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "overview"

  const [listingData, setListingData] = useState<ListingData>({
    id: params.id,
    title: "Beautiful 3BR Home Near Fort Bragg",
    description:
      "Spacious family home with modern amenities, perfect for military families. Features include updated kitchen, large backyard, and close proximity to base.",
    price: "2400",
    beds: 3,
    baths: 2,
    sqft: "1850",
    address: "123 Military Way",
    city: "Fayetteville",
    state: "NC",
    zipCode: "28301",
    nearestBase: "Fort Bragg",
    baseDistance: "2.3",
    status: "pending",
    postedBy: "John Smith",
    submittedDate: "2024-01-15",
    expiresDate: "2024-04-15",
    images: [
      "/placeholder.svg?height=400&width=600&text=Living Room",
      "/placeholder.svg?height=400&width=600&text=Kitchen",
      "/placeholder.svg?height=400&width=600&text=Bedroom",
    ],
    coverImageIndex: 0,
    amenities: ["Parking", "Laundry", "Pet Friendly", "Yard"],
    petPolicy: "Cats and dogs allowed with deposit",
    leaseTerm: "12 months",
    availableDate: "2024-02-01",
    contactEmail: "john.smith@email.com",
    contactPhone: "(555) 123-4567",
    virtualTourUrl: "",
    metaTitle: "3BR Home Near Fort Bragg - Military Housing",
    metaDescription: "Beautiful 3-bedroom home perfect for military families, located just 2.3 miles from Fort Bragg.",
    seoKeywords: "Fort Bragg housing, military rental, 3 bedroom home",
    canonicalUrl: "",
    indexable: true,
    complianceChecks: {
      fairHousing: true,
      contentFilter: true,
      imageModeration: false,
      addressVerification: true,
    },
    auditLog: [
      {
        id: "1",
        action: "Listing Submitted",
        user: "John Smith",
        timestamp: "2024-01-15 10:30 AM",
        details: "Initial listing submission",
      },
      {
        id: "2",
        action: "Under Review",
        user: "Admin",
        timestamp: "2024-01-15 11:00 AM",
        details: "Moved to pending review queue",
      },
    ],
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useUnsavedChanges(hasUnsavedChanges)

  const handleTabChange = (newTab: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("tab", newTab)
    router.replace(url.pathname + url.search)
  }

  const handleInputChange = (field: string, value: any) => {
    setListingData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    console.log("[v0] Saving listing data:", listingData)
    setHasUnsavedChanges(false)
    // Save logic will be implemented
  }

  const handleAction = (action: string) => {
    console.log("[v0] Performing action:", action)
    // Action logic will be implemented
  }

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...listingData.images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)

    let newCoverIndex = listingData.coverImageIndex
    if (fromIndex === listingData.coverImageIndex) {
      newCoverIndex = toIndex
    } else if (fromIndex < listingData.coverImageIndex && toIndex >= listingData.coverImageIndex) {
      newCoverIndex--
    } else if (fromIndex > listingData.coverImageIndex && toIndex <= listingData.coverImageIndex) {
      newCoverIndex++
    }

    setListingData((prev) => ({
      ...prev,
      images: newImages,
      coverImageIndex: newCoverIndex,
    }))
    setHasUnsavedChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
            <p className="text-gray-600">ID: {params.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={listingData.status === "pending" ? "secondary" : "default"}>{listingData.status}</Badge>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Button onClick={() => handleAction("approve")} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button onClick={() => handleAction("reject")} variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => handleAction("request-edits")} variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Request Edits
            </Button>
            <Button onClick={() => handleAction("expire")} variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Expire
            </Button>
            <Button onClick={() => handleAction("hide")} variant="outline">
              Hide
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Editor */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={listingData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={listingData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="beds">Bedrooms</Label>
                    <Input
                      id="beds"
                      type="number"
                      value={listingData.beds}
                      onChange={(e) => handleInputChange("beds", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="baths">Bathrooms</Label>
                    <Input
                      id="baths"
                      type="number"
                      step="0.5"
                      value={listingData.baths}
                      onChange={(e) => handleInputChange("baths", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sqft">Square Feet</Label>
                    <Input
                      id="sqft"
                      value={listingData.sqft}
                      onChange={(e) => handleInputChange("sqft", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="price">Monthly Rent ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={listingData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Military Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={listingData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={listingData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={listingData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={listingData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nearestBase">Nearest Base</Label>
                    <Input
                      id="nearestBase"
                      value={listingData.nearestBase}
                      onChange={(e) => handleInputChange("nearestBase", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="baseDistance">Distance (miles)</Label>
                    <Input
                      id="baseDistance"
                      value={listingData.baseDistance}
                      onChange={(e) => handleInputChange("baseDistance", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="availableDate">Available Date</Label>
                  <Input
                    id="availableDate"
                    type="date"
                    value={listingData.availableDate}
                    onChange={(e) => handleInputChange("availableDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="leaseTerm">Lease Term</Label>
                  <Select
                    value={listingData.leaseTerm}
                    onValueChange={(value) => handleInputChange("leaseTerm", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                      <SelectItem value="18 months">18 months</SelectItem>
                      <SelectItem value="24 months">24 months</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="petPolicy">Pet Policy</Label>
                  <Input
                    id="petPolicy"
                    value={listingData.petPolicy}
                    onChange={(e) => handleInputChange("petPolicy", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={listingData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={listingData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop images or click to upload</p>
                <p className="text-xs text-gray-500">Recommended: 1200x800px, JPG/PNG up to 5MB each</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              {/* Image Grid with Reorder */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {listingData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      {index === listingData.coverImageIndex && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Cover
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" onClick={() => handleInputChange("coverImageIndex", index)}>
                        Set Cover
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={index === 0}
                        onClick={() => handleImageReorder(index, index - 1)}
                      >
                        ←
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={index === listingData.images.length - 1}
                        onClick={() => handleImageReorder(index, index + 1)}
                      >
                        →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Virtual Tour */}
              <div>
                <Label htmlFor="virtualTourUrl">Virtual Tour URL (Optional)</Label>
                <Input
                  id="virtualTourUrl"
                  placeholder="https://..."
                  value={listingData.virtualTourUrl}
                  onChange={(e) => handleInputChange("virtualTourUrl", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fairHousing"
                    checked={listingData.complianceChecks.fairHousing}
                    onCheckedChange={(checked) =>
                      handleInputChange("complianceChecks", {
                        ...listingData.complianceChecks,
                        fairHousing: checked,
                      })
                    }
                  />
                  <Label htmlFor="fairHousing" className="flex items-center gap-2">
                    Fair Housing Compliance
                    {listingData.complianceChecks.fairHousing ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="contentFilter"
                    checked={listingData.complianceChecks.contentFilter}
                    onCheckedChange={(checked) =>
                      handleInputChange("complianceChecks", {
                        ...listingData.complianceChecks,
                        contentFilter: checked,
                      })
                    }
                  />
                  <Label htmlFor="contentFilter" className="flex items-center gap-2">
                    Content Filter Passed
                    {listingData.complianceChecks.contentFilter ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="imageModeration"
                    checked={listingData.complianceChecks.imageModeration}
                    onCheckedChange={(checked) =>
                      handleInputChange("complianceChecks", {
                        ...listingData.complianceChecks,
                        imageModeration: checked,
                      })
                    }
                  />
                  <Label htmlFor="imageModeration" className="flex items-center gap-2">
                    Image Moderation Approved
                    {listingData.complianceChecks.imageModeration ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="addressVerification"
                    checked={listingData.complianceChecks.addressVerification}
                    onCheckedChange={(checked) =>
                      handleInputChange("complianceChecks", {
                        ...listingData.complianceChecks,
                        addressVerification: checked,
                      })
                    }
                  />
                  <Label htmlFor="addressVerification" className="flex items-center gap-2">
                    Address Verification
                    {listingData.complianceChecks.addressVerification ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={listingData.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">{listingData.metaTitle.length}/60 characters</p>
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  rows={3}
                  value={listingData.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">{listingData.metaDescription.length}/160 characters</p>
              </div>
              <div>
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Input
                  id="seoKeywords"
                  placeholder="Separate keywords with commas"
                  value={listingData.seoKeywords}
                  onChange={(e) => handleInputChange("seoKeywords", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="canonicalUrl">Canonical URL (Optional)</Label>
                <Input
                  id="canonicalUrl"
                  placeholder="https://..."
                  value={listingData.canonicalUrl}
                  onChange={(e) => handleInputChange("canonicalUrl", e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="indexable"
                  checked={listingData.indexable}
                  onCheckedChange={(checked) => handleInputChange("indexable", checked)}
                />
                <Label htmlFor="indexable">Allow search engines to index this listing</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listingData.auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{entry.action}</h4>
                        <span className="text-sm text-gray-500">{entry.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                      <p className="text-xs text-gray-500 mt-1">by {entry.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
