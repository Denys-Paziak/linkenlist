"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { FormData, FormErrors, MilitaryBase } from "@/types/real-estate-form"

interface ListingPage1Props {
  formData: FormData
  updateFormData: (key: keyof FormData, value: any) => void
  toggleMultiSelect: (key: keyof FormData, value: string) => void
  errors: FormErrors
  onContinue: () => void
  isGuest: boolean
}

const MILITARY_BASES: MilitaryBase[] = [
  {
    id: "1",
    name: "Fort Belvoir",
    city: "Fort Belvoir",
    state: "VA",
    zipCode: "22060",
    coordinates: { lat: 38.7073, lng: -77.1418 },
  },
  {
    id: "2",
    name: "Joint Base Andrews",
    city: "Andrews",
    state: "MD",
    zipCode: "20762",
    coordinates: { lat: 38.8108, lng: -76.8669 },
  },
  {
    id: "3",
    name: "Pentagon",
    city: "Arlington",
    state: "VA",
    zipCode: "22202",
    coordinates: { lat: 38.8719, lng: -77.0563 },
  },
  {
    id: "4",
    name: "Naval Academy",
    city: "Annapolis",
    state: "MD",
    zipCode: "21402",
    coordinates: { lat: 38.9827, lng: -76.4951 },
  },
  {
    id: "5",
    name: "Quantico Marine Base",
    city: "Quantico",
    state: "VA",
    zipCode: "22134",
    coordinates: { lat: 38.5209, lng: -77.3013 },
  },
  {
    id: "6",
    name: "Fort Meade",
    city: "Fort Meade",
    state: "MD",
    zipCode: "20755",
    coordinates: { lat: 39.1084, lng: -76.7441 },
  },
  {
    id: "7",
    name: "Dover Air Force Base",
    city: "Dover",
    state: "DE",
    zipCode: "19902",
    coordinates: { lat: 39.1295, lng: -75.4659 },
  },
  {
    id: "8",
    name: "Norfolk Naval Base",
    city: "Norfolk",
    state: "VA",
    zipCode: "23511",
    coordinates: { lat: 36.9467, lng: -76.3284 },
  },
]

const PROPERTY_TYPES = [
  "Single Family",
  "Townhouse",
  "Condo",
  "Multi-family",
  "Manufactured",
  "Apartment",
  "Lot/Land",
  "Other",
]
const PROPERTY_SUBTYPES = ["Condo", "Townhouse", "Farm/Ranch", "Waterfront", "Historic", "New Construction", "Other"]
const ARCHITECTURAL_STYLES = [
  "Colonial",
  "Contemporary",
  "Craftsman",
  "Ranch",
  "Victorian",
  "Modern",
  "Traditional",
  "Other",
]
const FINANCING_TAGS = ["VA eligible", "Assumable loan", "Owner financing", "Lease-purchase"]
const LEASE_TERMS = ["Month-to-month", "6 months", "12 months", "Other"]
const PET_POLICIES = ["Cats OK", "Dogs OK", "Breed restrictions", "Size restrictions", "Pets negotiable", "No pets"]
const COMMUNITY_FEATURES = [
  "Gated",
  "Security patrol",
  "Playground",
  "Pool",
  "Clubhouse",
  "Fitness center",
  "Tennis",
  "Trails",
  "Dog park",
  "Other",
]
const HOA_FREQUENCIES = ["Monthly", "Quarterly", "Annually"]
const SERVICES_INCLUDED = [
  "Water",
  "Sewer",
  "Trash",
  "Recycling",
  "Cable",
  "Internet",
  "Landscaping",
  "Snow removal",
  "Other",
]

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

const ListingPage1 = ({
  formData,
  updateFormData,
  toggleMultiSelect,
  errors,
  onContinue,
  isGuest,
}: ListingPage1Props) => {
  const [expandedSections, setExpandedSections] = useState({
    propertyInfo: false,
    listingDetails: false,
    amenities: false,
  })

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const [stateDropdownOpen, setStateDropdownOpen] = useState(false)
  const [stateInputValue, setStateInputValue] = useState(formData.state || "")
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [stateInput, setStateInput] = useState(formData.state || "")

  const filteredStates = US_STATES.filter((state) => state.toLowerCase().includes(stateInput.toLowerCase()))

  const handleContinue = () => {
    const validationErrors: { [key: string]: string } = {}

    // Validate mandatory Seller Information fields
    if (!formData.firstName?.trim()) {
      validationErrors.firstName = "First name is required"
    }

    if (!formData.lastName?.trim()) {
      validationErrors.lastName = "Last name is required"
    }

    if (!formData.primaryPhone?.trim()) {
      validationErrors.primaryPhone = "Primary phone is required"
    }

    if (!formData.email?.trim()) {
      validationErrors.email = "Email is required"
    }

    if (!formData.confirmEmail?.trim()) {
      validationErrors.confirmEmail = "Confirm email is required"
    } else if (formData.email !== formData.confirmEmail) {
      validationErrors.confirmEmail = "Email addresses do not match"
    }

    if (isGuest) {
      if (!formData.password?.trim()) {
        validationErrors.password = "Password is required"
      }

      if (!formData.confirmPassword?.trim()) {
        validationErrors.confirmPassword = "Confirm password is required"
      } else if (formData.password !== formData.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match"
      }
    }

    // Validate mandatory Location Information fields
    if (!formData.streetAddress?.trim()) {
      validationErrors.streetAddress = "Street address is required"
    }

    if (!formData.city?.trim()) {
      validationErrors.city = "City is required"
    }

    if (!formData.state?.trim()) {
      validationErrors.state = "State is required"
    }

    if (!formData.zipCode?.trim()) {
      validationErrors.zipCode = "Zip code is required"
    }

    if (!formData.county?.trim()) {
      validationErrors.county = "County is required"
    }

    // Validate mandatory Property Information fields
    if (!formData.forSale && !formData.forRent) {
      validationErrors.listingType = "Please select a listing type"
    }

    if (!formData.propertyType) {
      validationErrors.propertyType = "Property type is required"
    }

    if (!formData.bedrooms) {
      validationErrors.bedrooms = "Number of bedrooms is required"
    }

    if (!formData.bathroomsFull) {
      validationErrors.bathroomsFull = "Number of full baths is required"
    }

    if (!formData.bathroomsHalf) {
      validationErrors.bathroomsHalf = "Number of half baths is required"
    }

    if (!formData.interiorSize) {
      validationErrors.interiorSize = "Interior size is required"
    }

    // Validate HOA fields if HOA is present
    if (formData.hoaPresent) {
      if (!formData.hoaFee) {
        validationErrors.hoaFee = "HOA fee is required when HOA is present"
      }
      if (!formData.hoaFrequency) {
        validationErrors.hoaFrequency = "HOA frequency is required when HOA is present"
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors)
      setExpandedSections((prev) => ({ ...prev, propertyInfo: true }))
      return
    }

    setLocalErrors({})
    onContinue()
  }

  const isForSale = formData.forSale
  const isForRent = formData.forRent

  const hasPropertyInfoErrors = !!(
    errors.listingType ||
    errors.propertyType ||
    errors.bedrooms ||
    errors.bathroomsFull ||
    errors.bathroomsHalf ||
    errors.interiorSize ||
    errors.hoaFee ||
    errors.hoaFrequency ||
    localErrors.listingType ||
    localErrors.propertyType ||
    localErrors.bedrooms ||
    localErrors.bathroomsFull ||
    localErrors.bathroomsHalf ||
    localErrors.interiorSize ||
    localErrors.hoaFee ||
    localErrors.hoaFrequency
  )

  // Auto-expand Property Information if there are errors
  if (hasPropertyInfoErrors && !expandedSections.propertyInfo) {
    setExpandedSections((prev) => ({ ...prev, propertyInfo: true }))
  }

  const getCoordinatesFromZip = (zipCode: string): { lat: number; lng: number } | null => {
    // Mock coordinates for common zip codes - in real app would use geocoding API
    const zipCoordinates: Record<string, { lat: number; lng: number }> = {
      "22015": { lat: 38.9108, lng: -77.2311 }, // Burke, VA
      "20120": { lat: 38.7851, lng: -77.3069 }, // Centreville, VA
      "22030": { lat: 38.8462, lng: -77.3063 }, // Fairfax, VA
      "20170": { lat: 39.0437, lng: -77.4875 }, // Herndon, VA
      "22101": { lat: 38.8904, lng: -77.231 }, // McLean, VA
      "22180": { lat: 38.7312, lng: -77.1803 }, // Vienna, VA
    }
    return zipCoordinates[zipCode] || null
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 px-0 py-0">
      <div className="mb-8"></div>

      {/* Seller Information and Location Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seller Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Seller Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                id="firstName"
                placeholder="First Name *"
                value={formData.firstName || ""}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                error={!!(errors.firstName || localErrors.firstName)}
                required={true}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="lastName"
                placeholder="Last Name *"
                value={formData.lastName || ""}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                error={!!(errors.lastName || localErrors.lastName)}
                required={true}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="companyName"
                placeholder="Company Name (Optional)"
                value={formData.companyName || ""}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Input
                id="primaryPhone"
                type="tel"
                placeholder="Primary Phone *"
                value={formData.primaryPhone || ""}
                onChange={(e) => updateFormData("primaryPhone", e.target.value)}
                error={!!(errors.primaryPhone || localErrors.primaryPhone)}
                required={true}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hidePrimaryPhone"
                  checked={formData.hidePrimaryPhone || false}
                  onCheckedChange={(checked) => updateFormData("hidePrimaryPhone", checked)}
                />
                <Label htmlFor="hidePrimaryPhone" className="text-sm text-gray-600">
                  Hide Primary Phone
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                id="alternativePhone"
                type="tel"
                placeholder="Alternative Phone"
                value={formData.alternativePhone || ""}
                onChange={(e) => updateFormData("alternativePhone", e.target.value)}
                className="bg-gray-50"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hideAlternativePhone"
                  checked={formData.hideAlternativePhone || false}
                  onCheckedChange={(checked) => updateFormData("hideAlternativePhone", checked)}
                />
                <Label htmlFor="hideAlternativePhone" className="text-sm text-gray-600">
                  Hide Alternative Phone
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email *"
                value={formData.email || ""}
                onChange={(e) => updateFormData("email", e.target.value)}
                error={!!(errors.email || localErrors.email)}
                required={true}
                fieldName="Email"
              />
            </div>

            <div className="space-y-2">
              <Input
                id="confirmEmail"
                type="email"
                placeholder="Confirm Email *"
                value={formData.confirmEmail || ""}
                onChange={(e) => updateFormData("confirmEmail", e.target.value)}
                error={!!(errors.confirmEmail || localErrors.confirmEmail)}
                required={true}
                fieldName="Confirm Email"
                errorMessage={
                  errors.confirmEmail === "Email addresses do not match"
                    ? "Email addresses do not match. Please ensure both email fields contain the same address."
                    : undefined
                }
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hideEmail"
                  checked={formData.hideEmail || false}
                  onCheckedChange={(checked) => updateFormData("hideEmail", checked)}
                />
                <Label htmlFor="hideEmail" className="text-sm text-gray-600">
                  Hide Email on Contact Form
                </Label>
              </div>
              <p className="text-xs text-gray-500">(Buyers won&#39;t know your actual email address until you update your Profile -&gt; Public Profile)</p>
            </div>

            {isGuest && (
              <>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password *"
                    value={formData.password || ""}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    error={!!(errors.password || localErrors.password)}
                    required={true}
                    fieldName="Password"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword || ""}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    error={!!(errors.confirmPassword || localErrors.confirmPassword)}
                    required={true}
                    fieldName="Confirm Password"
                    errorMessage={
                      errors.confirmPassword === "Passwords do not match"
                        ? "Passwords do not match. Please ensure both password fields contain the same password."
                        : undefined
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                id="streetAddress"
                placeholder="Street Address *"
                value={formData.streetAddress || ""}
                onChange={(e) => updateFormData("streetAddress", e.target.value)}
                error={!!(errors.streetAddress || localErrors.streetAddress)}
                required={true}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="unitApt"
                placeholder="Unit/Apt"
                value={formData.unitApt || ""}
                onChange={(e) => updateFormData("unitApt", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="zipCode"
                placeholder="22015"
                value={formData.zipCode || ""}
                onChange={(e) => updateFormData("zipCode", e.target.value)}
                error={!!(errors.zipCode || localErrors.zipCode)}
                required={true}
              />
            </div>

            <div className="space-y-2 relative">
              <Input
                id="state"
                placeholder="Type to search states..."
                value={stateInput}
                onChange={(e) => {
                  setStateInput(e.target.value)
                  setShowStateDropdown(true)
                }}
                onFocus={() => setShowStateDropdown(true)}
                onBlur={() => {
                  setTimeout(() => setShowStateDropdown(false), 200)
                }}
                error={!!(errors.state || localErrors.state)}
                required={true}
              />
              {showStateDropdown && filteredStates.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredStates.map((state) => (
                    <div
                      key={state}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setStateInput(state)
                        updateFormData("state", state)
                        setShowStateDropdown(false)
                      }}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Input
                id="city"
                placeholder="Burke"
                value={formData.city || ""}
                onChange={(e) => updateFormData("city", e.target.value)}
                error={!!(errors.city || localErrors.city)}
                required={true}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="county"
                placeholder="Fairfax"
                value={formData.county || ""}
                onChange={(e) => updateFormData("county", e.target.value)}
                error={!!(errors.county || localErrors.county)}
                required={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Information - Collapsible */}
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <button
          type="button"
          onClick={() => setExpandedSections((prev) => ({ ...prev, propertyInfo: !prev.propertyInfo }))}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Property Information</h3>
            <p className="text-sm text-gray-600 mt-1">
              These fields are not required to place your order and may be completed at a later date in your account
            </p>
          </div>
          {expandedSections.propertyInfo ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.propertyInfo && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Listing Type & Pricing */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Listing Type <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="forSale"
                        checked={formData.forSale}
                        onCheckedChange={(checked) => updateFormData("forSale", checked)}
                        className={hasPropertyInfoErrors ? "border-red-500" : ""}
                      />
                      <Label htmlFor="forSale" className="text-sm font-medium">
                        For Sale
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="forRent"
                        checked={formData.forRent}
                        onCheckedChange={(checked) => updateFormData("forRent", checked)}
                        className={hasPropertyInfoErrors ? "border-red-500" : ""}
                      />
                      <Label htmlFor="forRent" className="text-sm font-medium">
                        For Rent
                      </Label>
                    </div>
                  </div>

                  {isForSale && (
                    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50/30">
                      <div>
                        <Input
                          id="listPrice"
                          type="text"
                          placeholder="List Price"
                          value={formData.listPrice || ""}
                          onChange={(e) => updateFormData("listPrice", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {isForRent && (
                    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            id="monthlyRent"
                            type="text"
                            placeholder="Monthly Rent"
                            value={formData.monthlyRent || ""}
                            onChange={(e) => updateFormData("monthlyRent", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Input
                            id="securityDeposit"
                            type="text"
                            placeholder="Security Deposit"
                            value={formData.securityDeposit || ""}
                            onChange={(e) => updateFormData("securityDeposit", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            id="applicationFee"
                            type="text"
                            placeholder="Application Fee"
                            value={formData.applicationFee || ""}
                            onChange={(e) => updateFormData("applicationFee", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Input
                            id="dateAvailable"
                            type="date"
                            value={formData.dateAvailable || ""}
                            onChange={(e) => updateFormData("dateAvailable", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Select
                          value={formData.leaseTerm || ""}
                          onValueChange={(value) => updateFormData("leaseTerm", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select lease term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month-to-month">Month to Month</SelectItem>
                            <SelectItem value="6-months">6 Months</SelectItem>
                            <SelectItem value="1-year">1 Year</SelectItem>
                            <SelectItem value="2-years">2 Years</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Pet Policy</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="catsOk"
                              checked={formData.catsOk || false}
                              onCheckedChange={(checked) => updateFormData("catsOk", checked)}
                            />
                            <Label htmlFor="catsOk" className="text-sm">
                              Cats OK
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="dogsOk"
                              checked={formData.dogsOk || false}
                              onCheckedChange={(checked) => updateFormData("dogsOk", checked)}
                            />
                            <Label htmlFor="dogsOk" className="text-sm">
                              Dogs OK
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="breedRestrictions"
                              checked={formData.breedRestrictions || false}
                              onCheckedChange={(checked) => updateFormData("breedRestrictions", checked)}
                            />
                            <Label htmlFor="breedRestrictions" className="text-sm">
                              Breed restrictions
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="sizeRestrictions"
                              checked={formData.sizeRestrictions || false}
                              onCheckedChange={(checked) => updateFormData("sizeRestrictions", checked)}
                            />
                            <Label htmlFor="sizeRestrictions" className="text-sm">
                              Size restrictions
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="petsNegotiable"
                              checked={formData.petsNegotiable || false}
                              onCheckedChange={(checked) => updateFormData("petsNegotiable", checked)}
                            />
                            <Label htmlFor="petsNegotiable" className="text-sm">
                              Pets negotiable
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="noPets"
                              checked={formData.noPets || false}
                              onCheckedChange={(checked) => updateFormData("noPets", checked)}
                            />
                            <Label htmlFor="noPets" className="text-sm">
                              No pets
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Property Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">
                    Property Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.propertyType || ""}
                    onValueChange={(value) => updateFormData("propertyType", value)}
                  >
                    <SelectTrigger className={hasPropertyInfoErrors ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="Bedrooms *"
                      value={formData.bedrooms || ""}
                      onChange={(e) => updateFormData("bedrooms", e.target.value)}
                      error={!!(errors.bedrooms || localErrors.bedrooms)}
                      required={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="bathroomsFull"
                      type="number"
                      placeholder="Full Baths *"
                      value={formData.bathroomsFull || ""}
                      onChange={(e) => updateFormData("bathroomsFull", e.target.value)}
                      error={!!(errors.bathroomsFull || localErrors.bathroomsFull)}
                      required={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="bathroomsHalf"
                      type="number"
                      placeholder="Half Baths *"
                      value={formData.bathroomsHalf || ""}
                      onChange={(e) => updateFormData("bathroomsHalf", e.target.value)}
                      error={!!(errors.bathroomsHalf || localErrors.bathroomsHalf)}
                      required={true}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="interiorSize"
                      type="number"
                      placeholder="Interior Size (sqft) *"
                      value={formData.interiorSize || ""}
                      onChange={(e) => updateFormData("interiorSize", e.target.value)}
                      error={!!(errors.interiorSize || localErrors.interiorSize)}
                      required={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="yearBuilt"
                      type="number"
                      placeholder="Year Built"
                      value={formData.yearBuilt || ""}
                      onChange={(e) => updateFormData("yearBuilt", e.target.value)}
                      error={!!errors.yearBuilt}
                      fieldName="Year Built"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="stories"
                      type="number"
                      placeholder="Stories / Levels"
                      value={formData.stories || ""}
                      onChange={(e) => updateFormData("stories", e.target.value)}
                      error={!!errors.stories}
                      fieldName="Stories"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="architecturalStyle"
                      placeholder="Architectural Style"
                      value={formData.architecturalStyle || ""}
                      onChange={(e) => updateFormData("architecturalStyle", e.target.value)}
                      error={!!errors.architecturalStyle}
                      fieldName="Architectural Style"
                    />
                  </div>
                </div>

                {/* HOA section moved from Amenities to Property Information */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hoaPresent"
                      checked={formData.hoaPresent || false}
                      onCheckedChange={(checked) => updateFormData("hoaPresent", checked)}
                    />
                    <Label htmlFor="hoaPresent">HOA Present</Label>
                  </div>
                  {formData.hoaPresent && (
                    <div className="pl-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Input
                            id="hoaFee"
                            placeholder="HOA Fee (amount) *"
                            value={formData.hoaFee || ""}
                            onChange={(e) => updateFormData("hoaFee", e.target.value)}
                            error={!!(errors.hoaFee || localErrors.hoaFee)}
                            required={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <Select
                            value={formData.hoaFrequency || ""}
                            onValueChange={(value) => updateFormData("hoaFrequency", value)}
                          >
                            <SelectTrigger className={hasPropertyInfoErrors ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select frequency *" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOA_FREQUENCIES.map((freq) => (
                                <SelectItem key={freq} value={freq}>
                                  {freq}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Services Included</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {SERVICES_INCLUDED.map((service) => (
                            <div key={service} className="flex items-center space-x-2">
                              <Checkbox
                                id={`service-${service}`}
                                checked={formData.servicesIncluded?.includes(service) || false}
                                onCheckedChange={() => toggleMultiSelect("servicesIncluded", service)}
                              />
                              <Label htmlFor={`service-${service}`} className="text-sm">
                                {service}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Listing Details - Collapsible */}
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <button
          type="button"
          onClick={() => setExpandedSections((prev) => ({ ...prev, listingDetails: !prev.listingDetails }))}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Listing Details</h3>
            <p className="text-sm text-gray-600 mt-1">
              These fields are not required to place your order and may be completed at a later date in your account
            </p>
          </div>
          {expandedSections.listingDetails ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.listingDetails && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Textarea
                  id="listingDescription"
                  placeholder="Describe your property..."
                  value={formData.listingDescription || ""}
                  onChange={(e) => {
                    if (e.target.value.length <= 750) {
                      updateFormData("listingDescription", e.target.value)
                    }
                  }}
                  rows={6}
                  className={errors.listingDescription ? "border-red-500 bg-red-50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="virtualTourUrl"
                  placeholder="Virtual Tour URL"
                  value={formData.virtualTourUrl || ""}
                  onChange={(e) => updateFormData("virtualTourUrl", e.target.value)}
                  error={!!errors.virtualTourUrl}
                  fieldName="Virtual Tour URL"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Amenities - Collapsible */}
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <button
          type="button"
          onClick={() => setExpandedSections((prev) => ({ ...prev, amenities: !prev.amenities }))}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
            <p className="text-sm text-gray-600 mt-1">
              These fields are not required to place your order and may be completed at a later date in your account
            </p>
          </div>
          {expandedSections.amenities ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.amenities && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="subdivisionName"
                    placeholder="Subdivision / Community Name"
                    value={formData.subdivisionName || ""}
                    onChange={(e) => updateFormData("subdivisionName", e.target.value)}
                    error={!!errors.subdivisionName}
                    fieldName="Subdivision Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Community Features</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {COMMUNITY_FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`community-${feature}`}
                          checked={formData.communityFeatures?.includes(feature) || false}
                          onCheckedChange={() => toggleMultiSelect("communityFeatures", feature)}
                        />
                        <Label htmlFor={`community-${feature}`} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Continue Button and Disclaimer */}
      <div className="space-y-4">
        <Button
          onClick={handleContinue}
          className="w-full bg-primary hover:bg-primary/90 text-white py-2 text-base font-medium"
        >
          Continue
        </Button>

        <div className="text-sm text-gray-600 leading-relaxed">
          Once you click "Continue," we'll save your listing draft and create your LinkEnlist account (if you don't have
          one). On the next page you can upload photos, add property details, choose a plan, and publish. You can return
          anytime via "My Dashboard" to keep editing or complete payment to activate your listing. By clicking
          "Continue," you agree to LinkEnlist's{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  )
}

export { ListingPage1 }
export default ListingPage1
