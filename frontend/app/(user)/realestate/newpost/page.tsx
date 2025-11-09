"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

import { ListingPage1 } from "@/components/real-estate-form/listing-page-1"
import { ListingPage2 } from "@/components/real-estate-form/listing-page-2"
import type { FormData, FormErrors, FormPageState } from "@/types/real-estate-form"

export default function NewPostPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string>("premium")

  const getWordLimit = (packageType: string): number => {
    switch (packageType) {
      case "basic":
        return 200
      case "premium":
        return 750
      default:
        return 750
    }
  }

  const getPhotoLimit = (packageType: string): number => {
    switch (packageType) {
      case "basic":
        return 5
      case "premium":
        return 40
      default:
        return 40
    }
  }

  const [formData, setFormData] = useState<FormData>(() => {
    const packageParam = searchParams.get("package") || "premium"
    return {
      // Seller Information
      firstName: "",
      lastName: "",
      email: "",
      confirmEmail: "",
      hideEmail: false,
      primaryPhone: "",
      hidePrimaryPhone: false,
      alternativePhone: "",
      hideAlternativePhone: false,
      password: "",
      confirmPassword: "",

      // Location Information
      streetAddress: "",
      hideStreetAddress: false,
      unitApt: "",
      zipCode: "",
      county: "",
      city: "",
      nearestMilitaryBase: "",
      militaryBaseDistance: "",

      // Property Basics & Pricing
      listingType: [],
      listPrice: "",
      financingTags: [],
      monthlyRent: "",
      securityDeposit: "",
      applicationFee: "",
      dateAvailable: "",
      leaseTerm: "",
      petPolicy: [],

      // Property Details
      propertyType: "",
      propertySubType: "",
      bedrooms: "",
      bathroomsFull: "",
      bathroomsHalf: "",
      interiorSize: "",
      yearBuilt: "",
      stories: "",
      architecturalStyle: "",

      // HOA & Community
      subdivisionName: "",
      communityFeatures: [],
      hoaPresent: false,
      hoaFee: "",
      hoaFrequency: "",
      servicesIncluded: [],

      // Listing Details
      listingDescription: "",
      virtualTourUrl: "",

      // Indoor & Outdoor Features
      outdoorSpaces: [],
      pool: "",
      fencing: [],
      view: [],
      parkingType: [],
      garageSpaces: "",
      drivewaySpaces: "",
      rvBoatParking: false,
      lotSize: "",
      lotSizeUnit: "sqft",
      lotFeatures: [],
      flooring: [],
      heating: [],
      cooling: [],
      appliances: [],
      laundryFeatures: "",
      redVisibilityTag: "",
      specialFeatures: [],

      // Construction & Legal Records
      construction: [],
      newConstruction: false,
      builder: "",
      zoning: "",
      parcelApn: "",
      ownershipType: "",
      listingAgreement: "",
      dateOnMarket: "",

      // Utilities, Energy & Connectivity
      water: "",
      sewer: "",
      utilitiesAvailable: [],
      energyFeatures: [],
      internetOptions: [],
      typicalDownloadSpeed: "",
      cellularNotes: "",
      smartDevices: [],

      // Media & Publish
      images: [],
      hasVirtualTour: false,
      hasVideoTour: false,
      videoTourUrl: "",
      hasFloorPlans: false,
      confirmed: false,

      // Legacy fields for compatibility
      price: "",
      priceType: "list-price",
      tags: [],
      featuredTag: "",
      schoolDistrict: "",
      otherInteriorNotes: "",
      roof: "",
      foundation: "",
      overallCondition: "",
      rentToOwnConsidered: false,
      evCharger: false,
      evChargerLocation: "",

      package: packageParam,
    }
  })

  useEffect(() => {
    const packageParam = searchParams.get("package")
    if (packageParam) {
      setSelectedPackage(packageParam)
    }
  }, [searchParams])

  const currentWordLimit = getWordLimit(selectedPackage)
  const currentPhotoLimit = getPhotoLimit(selectedPackage)

  const [pageState, setPageState] = useState<FormPageState>({
    currentPage: 1,
    totalPages: 2,
    isAccountCreated: false,
    isDraft: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDraftSaved, setIsDraftSaved] = useState(false)
  const [isGuest, setIsGuest] = useState(true) // Assume guest user initially

  const [feedbackType, setFeedbackType] = useState("feedback")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }))
    }
  }

  const toggleMultiSelect = (key: keyof FormData, value: string) => {
    const currentArray = formData[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFormData(key, newArray)
  }

  const validatePage1 = (): boolean => {
    const newErrors: FormErrors = {}

    // Seller Information validation
    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email?.trim()) newErrors.email = "Email is required"
    if (!formData.confirmEmail?.trim()) newErrors.confirmEmail = "Please confirm your email"
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = "Emails do not match"
    if (!formData.primaryPhone?.trim()) newErrors.primaryPhone = "Primary phone is required"

    // Guest user password validation
    if (isGuest) {
      if (!formData.password?.trim()) newErrors.password = "Password is required"
      if (!formData.confirmPassword?.trim()) newErrors.confirmPassword = "Please confirm your password"
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }

    // Location validation
    if (!formData.streetAddress?.trim()) newErrors.streetAddress = "Street address is required"
    if (!formData.zipCode?.trim()) newErrors.zipCode = "ZIP code is required"
    if (!formData.county?.trim()) newErrors.county = "County is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePage2 = (): boolean => {
    const newErrors: FormErrors = {}

    // Photo validation
    if (formData.images.length === 0) newErrors.images = "At least one photo is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePage1Continue = async () => {
    if (!validatePage1()) return

    // Simulate account creation for guest users
    if (isGuest) {
      setIsSubmitting(true)

      // Simulate API call for account creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPageState((prev) => ({
        ...prev,
        currentPage: 2,
        isAccountCreated: true,
        isDraft: true,
      }))
      setIsGuest(false)
      setIsSubmitting(false)
    } else {
      setPageState((prev) => ({
        ...prev,
        currentPage: 2,
        isDraft: true,
      }))
    }

    // Save draft
    handleSaveDraft()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = async () => {
    if (!validatePage2()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)

    router.push("/realestate/success")
  }

  const handleSaveDraft = () => {
    setIsDraftSaved(true)
    localStorage.setItem("realEstateDraft", JSON.stringify(formData))
    setTimeout(() => {
      setIsDraftSaved(false)
    }, 2000)
  }

  const handleBack = () => {
    setPageState((prev) => ({
      ...prev,
      currentPage: 1,
    }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) return

    setIsFeedbackSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsFeedbackSubmitting(false)
    setFeedbackSubmitted(true)

    setTimeout(() => {
      setFeedbackSubmitted(false)
      setFeedbackType("feedback")
      setFeedbackMessage("")
    }, 3000)
  }

  const handleFeedbackMessageChange = (value: string) => {
    if (value.length <= 500) {
      setFeedbackMessage(value)
    }
  }

  const progress = (pageState.currentPage / pageState.totalPages) * 100

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Your property listing has been submitted for review. You'll receive an email confirmation shortly.
              </p>
              <Button onClick={() => (window.location.href = "/realestate")}>View All Listings</Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {pageState.currentPage === 1 ? "Create New Real Estate Listing" : "Complete Your Listing"}
            </h1>
            <p className="text-gray-600">
              {pageState.currentPage === 1
                ? "Fill out your seller information and property details"
                : "Add photos, features, and publish your listing"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="w-full">
              {pageState.currentPage === 1 ? (
                <ListingPage1
                  formData={formData}
                  updateFormData={updateFormData}
                  toggleMultiSelect={toggleMultiSelect}
                  errors={errors}
                  onContinue={handlePage1Continue}
                  isGuest={isGuest}
                />
              ) : (
                <ListingPage2
                  formData={formData}
                  updateFormData={updateFormData}
                  toggleMultiSelect={toggleMultiSelect}
                  errors={errors}
                  onSaveDraft={handleSaveDraft}
                  onSubmit={handleSubmit}
                  onBack={handleBack} // Added missing onBack prop
                  currentPhotoLimit={currentPhotoLimit}
                  selectedPackage={selectedPackage}
                  isAccountCreated={pageState.isAccountCreated}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
