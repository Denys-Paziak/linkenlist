"use client"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/user-context"
import { Check, Camera, FileText, Star, AlertCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface LocationData {
  city: string
  state: string
}

export default function ListingPackagesPage() {
  const { user } = useUser()
  const router = useRouter()

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

  const handleSkipZip = (plan: "free" | "premium") => {
    router.push(`/realestate/newpost?package=${plan}`)
  }

  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
              <p className="text-gray-600 mb-8">You need to be signed in to post a listing.</p>
              <Button
                onClick={() => (window.location.href = "/signin")}
                className="bg-[#002244] hover:bg-[#001122] text-white"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Listing Package</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect package for your real estate listing. All packages include essential features to help
              you connect with military families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Basic Package Card */}
            <Card className="rounded-2xl border bg-white/70 shadow-sm p-4 md:p-6 h-full flex flex-col relative">
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                  90 days
                </Badge>
              </div>

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-3 mb-3">
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
                      <span className="text-sm text-gray-600">
                        Tags: VA eligible, Assumable loan, PCS-Ready, 3D Tour
                      </span>
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
                        className="bg-[#002244] hover:bg-[#001122] text-white focus:ring-2 focus:ring-[#002244] focus:ring-offset-2 md:px-4"
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
                <div className="flex items-center justify-center gap-3 mb-3">
                  <CardTitle className="text-2xl font-bold text-gray-900">Premium</CardTitle>
                  <span className="text-3xl font-bold text-[#002244]">$44.94</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1">
                {/* Package Features */}
                <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
                  <div className="flex items-center gap-3">
                    <Camera className="h-4 w-4 text-[#002244]" />
                    <span className="text-sm">Everything in Basic plus up to 40 photos</span>
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
                      <span className="text-sm text-gray-600">
                        Tags: VA eligible, Assumable loan, PCS-Ready, 3D Tour
                      </span>
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
                        className="bg-[#002244] hover:bg-[#001122] text-white focus:ring-2 focus:ring-[#002244] focus:ring-offset-2 md:px-4"
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

          <div className="bg-gray-50 rounded-lg p-6">
            
          </div>
        </div>
      </main>
    </div>
  )
}
