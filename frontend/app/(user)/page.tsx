"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FloatingCommentCards } from "@/components/floating-comment-cards"
import { PropertyCard } from "@/components/property-card"
import { DealCard } from "@/components/deal-card"
import { EnhancedResourceCard } from "@/components/enhanced-resource-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { mockDeals } from "@/data/mock-deals"
import { mockListings } from "@/data/mock-listings"
import { mockResources } from "@/data/mock-resources"
import {
  Home,
  DollarSign,
  Shield,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Camera,
  FileText,
  Check,
  ArrowRight,
  Star,
  Tag,
  BookOpen,
  LinkIcon,
} from "lucide-react"

interface LocationData {
  city: string
  state: string
}

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("Real Estate")
  const [selectedState, setSelectedState] = useState("")
  const [scrollY, setScrollY] = useState(0)
  const [selectedBranch, setSelectedBranch] = useState("")

  const [bookmarkedListings, setBookmarkedListings] = useState<number[]>([])

  const [freeZip, setFreeZip] = useState("")
  const [premiumZip, setPremiumZip] = useState("")
  const [freeLocation, setFreeLocation] = useState<LocationData | null>(null)
  const [premiumLocation, setPremiumLocation] = useState<LocationData | null>(null)
  const [freeLoading, setFreeLoading] = useState(false)
  const [premiumLoading, setPremiumLoading] = useState(false)

  const zipRegex = /^\d{5}(-\d{4})?$/

  const lookupZip = async (zip: string, setPlan: "free" | "premium") => {
    const zip5 = zip.slice(0, 5)
    const setLoading = setPlan === "free" ? setFreeLoading : setPremiumLoading
    const setLocation = setPlan === "free" ? setFreeLocation : setPremiumLocation

    setLoading(true)
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip5}`)
      if (response.ok) {
        const data = await response.json()
        setLocation({
          city: data.places[0]["place name"],
          state: data.places[0]["state abbreviation"],
        })
      } else {
        setLocation(null)
      }
    } catch (error) {
      setLocation(null)
    } finally {
      setLoading(false)
    }
  }

  const handleZipChange = (value: string, plan: "free" | "premium") => {
    const setZip = plan === "free" ? setFreeZip : setPremiumZip
    const setLocation = plan === "free" ? setFreeLocation : setPremiumLocation

    setZip(value)
    setLocation(null)

    if (zipRegex.test(value)) {
      lookupZip(value, plan)
    }
  }

  const handleSubmit = (plan: "free" | "premium") => {
    const zip = plan === "free" ? freeZip : premiumZip
    const location = plan === "free" ? freeLocation : premiumLocation
    const zip5 = zip.slice(0, 5)

    let url = `/realestate/newpost?package=${plan}&zip=${zip5}`
    if (location) {
      url += `&city=${encodeURIComponent(location.city)}&state=${location.state}`
    }

    router.push(url)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (selectedState) params.set("state", selectedState)

    switch (activeTab) {
      case "Real Estate":
        window.location.href = `/realestate?${params.toString()}`
        break
      case "Deals":
        window.location.href = `/deals?${params.toString()}`
        break
      case "Resources":
        window.location.href = `/resources?${params.toString()}`
        break
      case "Links":
        window.location.href = `/links?${params.toString()}`
        break
      default:
        window.location.href = `/realestate?${params.toString()}`
    }
  }

  const handleStateClick = (state: string) => {
    setSelectedState(state)
    window.location.href = `/realestate?state=${state}`
  }

  const featuredListings = mockListings.slice(0, 4)

  const toggleBookmark = (id: number) => {
    setBookmarkedListings((prev) => (prev.includes(id) ? prev.filter((listingId) => listingId !== id) : [...prev, id]))
  }

  const openPropertyDetails = (listing: any) => {
    router.push(`/realestate?listing=${listing.id}`)
  }

  const benefits = [
    {
      icon: Home,
      title: "Homes near duty stations",
      description: "BAH filters, VA-ready options, verified details.",
    },
    {
      icon: DollarSign,
      title: "Military discounts and deals",
      description: "Curated savings on travel, retail, and services.",
    },
    {
      icon: Shield,
      title: "Official resources, fast",
      description: "Direct links to pay, health, training, and support.",
    },
    {
      icon: MapPin,
      title: "Your hub for military life",
      description: "Trusted sites for benefits, PCS checklists, and legal tools.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="relative min-h-[350px] md:min-h-[700px] bg-gray-50 flex items-center justify-center py-4 overflow-hidden md:py-16">
        <div className="text-center max-w-6xl mx-auto px-4 relative z-10">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 leading-tight text-gray-800">
            Linking Military Community
          </h1>

          <p className="text-base md:text-xl lg:text-2xl mb-4 md:mb-8 text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Military-focused Real Estate marketplace, Direct Links to the
            <br className="hidden md:block" />
            military websites, Resources and Deals linked for you.
          </p>

          <div className="hidden bg-white rounded-2xl shadow-2xl p-3 md:p-6 lg:p-8 max-w-[95%] md:max-w-[600px] lg:max-w-[716.8px] mx-auto relative z-20">
            {/* Tab Navigation */}
            <div className="flex justify-start mb-0 w-full">
              <div className="flex bg-gray-100 rounded-t-xl p-0.5 md:p-1 w-fit">
                {["Real Estate", "Deals", "Resources", "Links"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-1.5 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-white text-[#003366] shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSearch()
              }}
              className="flex w-full max-w-2xl mx-auto rounded-b-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:border-[#003366] transition-colors duration-200"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base placeholder-gray-500 outline-none bg-white"
              />
              <button
                type="submit"
                className="bg-[#003366] hover:bg-[#003366]/90 text-white px-4 md:px-6 py-2 md:py-3 flex items-center justify-center transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>
          </div>

          <div className="max-w-4xl mx-auto relative z-20 mt-4 md:mt-8">
            <div className="max-w-xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-2.5">
                <button
                  onClick={() => router.push("/realestate")}
                  className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-2 md:p-4 transition-all duration-200 hover:shadow-xl group"
                >
                  <div className="flex flex-col items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#003366]/90 transition-colors">
                      <Home className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-gray-800">Real Estate</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/deals")}
                  className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-2 md:p-4 transition-all duration-200 hover:shadow-xl group"
                >
                  <div className="flex flex-col items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#003366]/90 transition-colors">
                      <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-gray-800">Deals</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/resources")}
                  className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-2 md:p-4 transition-all duration-200 hover:shadow-xl group"
                >
                  <div className="flex flex-col items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#003366]/90 transition-colors">
                      <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-gray-800">Resources</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/links")}
                  className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-2 md:p-4 transition-all duration-200 hover:shadow-xl group"
                >
                  <div className="flex flex-col items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#003366]/90 transition-colors">
                      <LinkIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-gray-800">Links</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Comment Cards with Scroll-Based Animation */}
        <FloatingCommentCards scrollY={scrollY} />
      </div>

      {/* Featured Listings Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-5">
        <div className="text-center mb-7">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 text-left">Recently Added Listings</h2>
        </div>

        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => {
              const container = document.getElementById("featured-listings-scroll")
              if (container) {
                container.scrollBy({ left: -300, behavior: "smooth" })
              }
            }}
            className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={() => {
              const container = document.getElementById("featured-listings-scroll")
              if (container) {
                container.scrollBy({ left: 300, behavior: "smooth" })
              }
            }}
            className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Scrollable Container */}
          <div className="md:mx-10">
            <div
              id="featured-listings-scroll"
              className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {mockListings.slice(0, 8).map((listing) => (
                <div key={listing.id} className="flex-shrink-0 w-64 md:w-72 snap-start">
                  <PropertyCard
                    listing={listing}
                    onDetailsClick={() => openPropertyDetails(listing)}
                    isBookmarked={bookmarkedListings.includes(listing.id)}
                    onBookmarkToggle={() => toggleBookmark(listing.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Military Community Trust Section */}
      <section className="max-w-5xl mx-auto px-4 md:py-16 py-0">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            List your home for the military community
          </h2>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-slate-700 mb-6">
            Rent or sell near any base. Reach military families in minutes.
          </p>
        </div>

        {/* Mobile: Horizontal scrollable, Desktop: Grid */}
        <div className="block md:hidden mb-12">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth pl-6 pr-4 -mr-4">
            {/* Basic Package Card - Mobile Compact */}
            <Card className="rounded-2xl border bg-white/70 shadow-sm p-3 h-96 flex flex-col relative flex-shrink-0 w-80 snap-start">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                  90 days
                </Badge>
              </div>

              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CardTitle className="text-lg font-bold text-gray-900">Basic</CardTitle>
                  <span className="text-xl font-bold text-[#002244]">$0</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 space-y-2">
                {/* Package Features */}
                <div className="space-y-1.5 pb-2 border-b border-gray-200 mb-2">
                  <div className="flex items-center gap-2">
                    <Camera className="h-3 w-3 text-[#002244]" />
                    <span className="text-xs">Up to 5 photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-[#002244]" />
                    <span className="text-xs">Description up to 4,000 characters</span>
                  </div>
                </div>

                {/* Included Features */}
                <div className="flex-1 mb-2">
                  <ul className="space-y-1">
                    <li className="flex items-start gap-1.5">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">Listing page with map + nearest base</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">BAH calculator, Unlimited edits</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">
                        Tags: VA eligible, Assumable loan, PCS-Ready, 3D Tour
                      </span>
                    </li>
                  </ul>
                </div>

                {/* ZIP Form */}
                <div className="mt-auto space-y-1.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="free-zip-mobile" className="text-xs font-medium">
                      Enter ZIP to start
                    </Label>

                    <div className="flex gap-1.5">
                      <div className="flex-1">
                        <Input
                          id="free-zip-mobile"
                          type="text"
                          placeholder="12345"
                          value={freeZip}
                          onChange={(e) => handleZipChange(e.target.value, "free")}
                          className="focus:ring-2 focus:ring-[#002244] focus:border-[#002244] text-sm h-8"
                        />
                      </div>
                      <Button
                        onClick={() => handleSubmit("free")}
                        disabled={!zipRegex.test(freeZip) || freeLoading}
                        className="bg-[#002244] hover:bg-[#001122] text-white focus:ring-2 focus:ring-[#002244] focus:ring-offset-2 px-2 h-8"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Package Card - Mobile Compact */}
            <Card className="rounded-2xl border-2 border-[#002244] bg-white/70 shadow-sm p-3 h-96 flex flex-col relative flex-shrink-0 w-80 snap-start">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                  180 days
                </Badge>
              </div>

              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#002244] text-white px-4 py-1">Most Popular</Badge>
              </div>

              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CardTitle className="text-lg font-bold text-gray-900">Premium</CardTitle>
                  <span className="text-xl font-bold text-[#002244]">$44.94</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 space-y-2">
                {/* Package Features */}
                <div className="space-y-1.5 pb-2 border-b border-gray-200 mb-2">
                  <div className="flex items-center gap-2">
                    <Camera className="h-3 w-3 text-[#002244]" />
                    <span className="text-xs">Everything in Basic plus up to 40 photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-red-500" />
                    <span className="text-xs">Red "Featured" badge on listing cards</span>
                    <Badge className="bg-red-500 text-white text-xs px-1 py-0.5">Featured</Badge>
                  </div>
                </div>

                {/* Included Features */}
                <div className="flex-1 mb-2">
                  <ul className="space-y-1">
                    <li className="flex items-start gap-1.5">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">Listing page with map + nearest base</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">BAH calculator, Unlimited edits</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">
                        Tags: VA eligible, Assumable loan, PCS-Ready, 3D Tour
                      </span>
                    </li>
                  </ul>
                </div>

                {/* ZIP Form */}
                <div className="mt-auto space-y-1.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="premium-zip-mobile" className="text-xs font-medium">
                      Enter ZIP to start
                    </Label>

                    <div className="flex gap-1.5">
                      <div className="flex-1">
                        <Input
                          id="premium-zip-mobile"
                          type="text"
                          placeholder="12345"
                          value={premiumZip}
                          onChange={(e) => handleZipChange(e.target.value, "premium")}
                          className="focus:ring-2 focus:ring-[#002244] focus:border-[#002244] text-sm h-8"
                        />
                      </div>
                      <Button
                        onClick={() => handleSubmit("premium")}
                        disabled={!zipRegex.test(premiumZip) || premiumLoading}
                        className="bg-[#002244] hover:bg-[#001122] text-white focus:ring-2 focus:ring-[#002244] focus:ring-offset-2 px-2 h-8"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Desktop: Original Grid Layout */}
        <div className="hidden md:grid grid-cols-2 gap-8 md:gap-8">
          {/* Basic Package Card */}
          <Card className="rounded-2xl border bg-white/70 shadow-sm p-4 md:p-6 h-full flex flex-col relative">
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                90 days
              </Badge>
            </div>

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <CardTitle className="text-2xl font-bold text-gray-900">Basic</CardTitle>
                <span className="text-3xl font-bold text-[#002244]">$0</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              {/* Package Features */}
              <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
                <div className="flex items-center gap-3">
                  <Camera className="h-4 w-4 text-[#002244]" />
                  <span className="text-sm">Up to 5 photos</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-[#002244]" />
                  <span className="text-sm">Description up to 4,000 characters (~650–700 words)</span>
                </div>
              </div>

              {/* Included Features */}
              <div className="flex-1 mb-4">
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Listing page with map + nearest base</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">BAH calculator, Unlimited edits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Tags: VA eligible, Assumable loan, PCS-Ready, 3D Tour</span>
                  </li>
                </ul>
              </div>

              {/* ZIP Form */}
              <div className="mt-auto space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="free-zip" className="text-sm font-medium">
                    Enter ZIP to start
                  </Label>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="free-zip"
                        type="text"
                        placeholder="12345"
                        value={freeZip}
                        onChange={(e) => handleZipChange(e.target.value, "free")}
                        className="focus:ring-2 focus:ring-[#002244] focus:border-[#002244]"
                      />
                    </div>
                    <Button
                      onClick={() => handleSubmit("free")}
                      disabled={!zipRegex.test(freeZip) || freeLoading}
                      className="bg-[#003366] hover:bg-[#003366]/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      <ArrowRight className="h-4 w-4 md:hidden" />
                      <span className="hidden md:inline">Start</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Package Card */}
          <Card className="rounded-2xl border-2 border-[#002244] bg-white/70 shadow-sm p-4 md:p-6 h-full flex flex-col relative">
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                180 days
              </Badge>
            </div>

            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-[#002244] text-white px-4 py-1">Most Popular</Badge>
            </div>

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <CardTitle className="text-2xl font-bold text-gray-900">Premium</CardTitle>
                <span className="text-3xl font-bold text-[#002244]">$44.94</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              {/* Package Features */}
              <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
                <div className="flex items-center gap-3">
                  <Camera className="h-4 w-4 text-[#002244]" />
                  <span className="text-sm">Everything in Basic plus up to 60 photos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Red "Featured" badge on listing cards</span>
                  <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 ml-2">Featured</Badge>
                </div>
              </div>

              {/* Included Features */}
              <div className="flex-1 mb-4">
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Listing page with map + nearest base</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">BAH calculator, Unlimited edits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Tags: VA eligible, Assumable loan, PCS-Ready, 3D Tour</span>
                  </li>
                </ul>
              </div>

              {/* ZIP Form */}
              <div className="mt-auto space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="premium-zip" className="text-sm font-medium">
                    Enter ZIP to start
                  </Label>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="premium-zip"
                        type="text"
                        placeholder="12345"
                        value={premiumZip}
                        onChange={(e) => handleZipChange(e.target.value, "premium")}
                        className="focus:ring-2 focus:ring-[#002244] focus:border-[#002244]"
                      />
                    </div>
                    <Button
                      onClick={() => handleSubmit("premium")}
                      disabled={!zipRegex.test(premiumZip) || premiumLoading}
                      className="bg-[#003366] hover:bg-[#001122] text-white focus:ring-2 focus:ring-[#002244] focus:ring-offset-2 md:px-4"
                    >
                      <ArrowRight className="h-4 w-4 md:hidden" />
                      <span className="hidden md:inline">Start</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Military Deals Section */}
      <div className="bg-gray-50 py-8 md:py-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-7">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 text-left">Featured Military Deals</h2>
          </div>

          <div className="relative">
            {/* Left Scroll Button */}
            <button
              onClick={() => {
                const container = document.getElementById("featured-deals-scroll")
                if (container) {
                  container.scrollBy({ left: -300, behavior: "smooth" })
                }
              }}
              className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={() => {
                const container = document.getElementById("featured-deals-scroll")
                if (container) {
                  container.scrollBy({ left: 300, behavior: "smooth" })
                }
              }}
              className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Scrollable Container */}
            <div className="md:mx-10">
              <div
                id="featured-deals-scroll"
                className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {mockDeals.slice(0, 6).map((deal) => (
                  <div key={deal.id} className="flex-shrink-0 w-64 md:w-72 snap-start">
                    <DealCard deal={deal} onClick={() => router.push(`/deals/${deal.id}`)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why LinkEnlist Section */}
      <div className="bg-gray-50 py-6 md:py-11">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6 md:mb-7">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4 md:text-3xl">Why LinkEnlist?</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-10 h-10 md:w-20 md:h-20 bg-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-6 group-hover:bg-[#003366]/90 transition-colors duration-300">
                  <benefit.icon className="w-5 h-5 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-4 line-clamp-2">
                  {benefit.title}
                </h3>
                <p className="text-xs md:text-base text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Military Resources Section */}
      <div className="bg-gray-50 py-8 md:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-7">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 text-left">Featured Military Resources</h2>
          </div>

          <div className="relative">
            {/* Left Scroll Button */}
            <button
              onClick={() => {
                const container = document.getElementById("featured-resources-scroll")
                if (container) {
                  container.scrollBy({ left: -300, behavior: "smooth" })
                }
              }}
              className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={() => {
                const container = document.getElementById("featured-resources-scroll")
                if (container) {
                  container.scrollBy({ left: 300, behavior: "smooth" })
                }
              }}
              className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Scrollable Container */}
            <div className="md:mx-10">
              <div
                id="featured-resources-scroll"
                className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {mockResources.slice(0, 8).map((resource) => (
                  <div key={resource.id} className="flex-shrink-0 w-64 md:w-72 snap-start">
                    <EnhancedResourceCard resource={resource} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column - Content */}
          <div className="md:col-span-7">
            <div className="flex items-center justify-center md:justify-start mb-4 md:mb-6">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-red-600 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
              </svg>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">About Us</h2>
              <svg className="w-6 h-6 md:w-8 md:h-8 text-red-600 ml-2 md:ml-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
              </svg>
            </div>
            <p
              className="text-base md:text-lg text-slate-600 leading-relaxed text-center md:text-left"
              style={{ maxWidth: "60ch" }}
            >
              LinkEnlist was started by a military family who has done the PCS shuffle, and built for other military
              families who do the same. We know the scramble of PCS season, finding a home near a new base, and tracking
              down the right resources. Our goal is simple: put trusted listings, official links, and helpful deals in
              one place so you spend less time hunting and more time settling in.
            </p>
          </div>

          {/* Right Column - Stats and CTA */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
            {/* Inspirational Quote */}
            <div className="mb-4 md:mb-6">
              <p className="text-lg md:text-xl font-semibold text-slate-800 leading-relaxed">
                "If it links you to what you need, when you need it, we're doing it right."
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => router.push("/signin?mode=signup")}
                className="bg-[#003366] hover:bg-[#003366]/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Sign Up
              </button>
              <a
                href="/about"
                className="text-[#003366] hover:text-[#003366]/80 underline underline-offset-4 transition-colors duration-200 font-normal text-sm text-slate-500"
              >
                Learn more about our mission
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
