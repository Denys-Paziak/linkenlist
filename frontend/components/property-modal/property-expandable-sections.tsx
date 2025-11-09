"use client"
import { useState, useRef } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, PlayCircle, ChevronDown, Flag, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { PropertyCard } from "@/components/property-card"

const mockListings = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=300&text=House+Front",
    images: [
      "/placeholder.svg?height=200&width=300&text=House+Front",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Master+Bedroom",
      "/placeholder.svg?height=200&width=300&text=Backyard",
    ],
    rentPrice: "$2,800/mo",
    salePrice: "$650,000",
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
    status: "active",
    postedBy: "Real Estate Agent",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=300&text=Apartment+Front",
    images: [
      "/placeholder.svg?height=200&width=300&text=Apartment+Front",
      "/placeholder.svg?height=200&width=300&text=Living+Area",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
      "/placeholder.svg?height=200&width=300&text=Bathroom",
    ],
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
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=300&text=House+Exterior",
    images: [
      "/placeholder.svg?height=200&width=300&text=House+Exterior",
      "/placeholder.svg?height=200&width=300&text=Front+Door",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen+Dining",
      "/placeholder.svg?height=200&width=300&text=Pool+Area",
    ],
    rentPrice: "$2,200/mo",
    salePrice: "$485,000",
    beds: 3,
    baths: 2,
    sqft: "1,800",
    address: "9012 Liberty Lane, Norfolk, VA 23502",
    description: "Near Naval Station Norfolk",
    lotSize: "0.15 acres",
    hoa: "$75/mo",
    tags: ["Walkable", "Community Pool", "VA Loan Ready", "Navy"],
    badges: ["Open Sat"],
    type: "sale",
    status: "active",
    postedBy: "Sample LLC",
  },
]

interface PropertyExpandableSectionsProps {
  listing: any
}

export function PropertyExpandableSections({ listing }: PropertyExpandableSectionsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    map: false,
    videoTour: false,
  })

  const [showReportForm, setShowReportForm] = useState(false)
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleReportListing = () => {
    setShowReportForm(true)
    // TODO: Implement report form modal
  }

  const handleVideoTourClick = () => {
    toggleSection("videoTour")
  }

  const handleExternalVideoLink = () => {
    // Replace with actual video tour URL
    const videoTourUrl = "https://example.com/video-tour"
    window.open(videoTourUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="mt-8 space-y-4 ml-1.5 mr-1.5">
      {/* Map Location */}
      <Card ref={mapRef}>
        <CardHeader className="cursor-pointer hover:bg-gray-50" onClick={() => toggleSection("map")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">Map Location</h3>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-600 transition-transform ${expandedSections.map ? "rotate-180" : ""}`}
            />
          </div>
        </CardHeader>
        {expandedSections.map && (
          <CardContent className="p-4" ref={mapRef}>
            <div className="bg-gray-200 h-64 flex items-center justify-center rounded-md">
              <p className="text-gray-500">Map Placeholder</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Video Tour */}
      <Card ref={videoRef}>
        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleExternalVideoLink}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-bold text-gray-900">Video Tour</h3>
                <p className="text-sm text-gray-500 mt-1">https://example.com/video-tour</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ExternalLink className="h-4 w-4" />
              <span>External site</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 ml-2.5">
          <h3 className="text-xl font-bold text-gray-900">Homes for you</h3>
          <div className="flex gap-2 mx-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const container = document.getElementById("homes-scroll-container")
                if (container) {
                  container.scrollBy({ left: -280, behavior: "smooth" })
                }
              }}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const container = document.getElementById("homes-scroll-container")
                if (container) {
                  container.scrollBy({ left: 280, behavior: "smooth" })
                }
              }}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          id="homes-scroll-container"
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {mockListings.map((listing) => (
            <div key={listing.id} className="flex-shrink-0 w-[280px]">
              <PropertyCard
                listing={listing}
                onDetailsClick={() => {}}
                isBookmarked={false}
                onBookmarkToggle={() => {}}
                showStatusBadges="inactive-only"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 flex-1">
            All calculations are estimates and provided by LinkEnlist (NodEd LLC) for informational purposes only.
            Actual amounts may vary.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReportListing}
            className="ml-4 w-8 h-8 p-0 text-gray-600 hover:text-gray-800 bg-transparent border-gray-300 hover:border-gray-400"
            title="Report this listing"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showReportForm && (
        <div
          className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          onClick={() => setShowReportForm(false)}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Report this listing</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for reporting</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a reason</option>
                  <option value="incorrect-info">Incorrect information</option>
                  <option value="spam">Spam or duplicate</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="fraud">Fraudulent listing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional details</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Please provide more details..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recaptcha-checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={(e) => setIsRecaptchaVerified(e.target.checked)}
                    />
                    <label htmlFor="recaptcha-checkbox" className="text-sm text-gray-700">
                      I'm not a robot
                    </label>
                    <div className="ml-auto">
                      <div className="text-xs text-gray-500">reCAPTCHA</div>
                      <div className="text-xs text-gray-400">Privacy - Terms</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowReportForm(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={`text-white ${
                    isRecaptchaVerified ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isRecaptchaVerified}
                  onClick={(e) => {
                    e.preventDefault()
                    if (isRecaptchaVerified) {
                      setShowReportForm(false)
                      setIsRecaptchaVerified(false)
                      // TODO: Handle form submission
                    }
                  }}
                >
                  Submit Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
