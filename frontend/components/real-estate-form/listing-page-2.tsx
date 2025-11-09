"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ArrowLeft, Upload, X } from "lucide-react"
import type { FormData, FormErrors } from "@/types/real-estate-form"
import { Label } from "@/components/ui/label"

interface ListingPage2Props {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  toggleMultiSelect: (field: keyof FormData, value: string) => void
  errors: FormErrors
  onSaveDraft: () => void
  onSubmit: () => void
  onBack: () => void
  currentPhotoLimit: number
  selectedPackage: string
  isAccountCreated?: boolean
}

interface PhotoData {
  file: File
  comment: string
}

const OUTDOOR_SPACES_OPTIONS = [
  "Covered porch",
  "Patio",
  "Deck",
  "Balcony",
  "Outdoor kitchen",
  "Firepit",
  "Shed",
  "Greenhouse",
  "None",
  "Other",
]
const POOL_OPTIONS = ["None", "In-ground", "Above-ground", "Hot tub/Spa", "Community pool"]
const FENCING_OPTIONS = ["None", "Partial", "Full", "Vinyl", "Chain link", "Wrought iron", "Wood", "Other"]
const VIEW_OPTIONS = ["Water", "Mountain", "City", "Park/Greenbelt", "Golf course", "None", "Other"]
const PARKING_OPTIONS = ["Garage", "Carport", "Driveway", "Street", "Assigned", "None", "Other"]
const LOT_FEATURES = [
  "Corner lot",
  "Cul-de-sac",
  "Waterfront",
  "Greenbelt",
  "Adjacent to open space",
  "Sloped",
  "Level",
  "Xeriscaped",
  "Orchard/Garden",
  "Other",
  "None",
]

const FLOORING_OPTIONS = ["Hardwood", "Carpet", "Tile", "Vinyl", "Laminate", "Concrete", "Other", "None"]
const HEATING_OPTIONS = ["Forced air", "Heat pump", "Radiant", "Baseboard", "Stove", "Mini-split", "No heat", "Other"]
const COOLING_OPTIONS = ["Central AC", "Mini-split", "Window units", "Evaporative", "No AC", "Other"]
const APPLIANCES_OPTIONS = [
  "Refrigerator",
  "Range/Oven",
  "Microwave",
  "Dishwasher",
  "Disposal",
  "Washer",
  "Dryer",
  "W/D hookups",
  "Water softener",
  "Other",
  "None",
]
const LAUNDRY_OPTIONS = ["In-unit", "Hookups only", "Shared/In-building", "Laundry room", "In garage", "None", "Other"]

const CONSTRUCTION_OPTIONS = ["Wood frame", "Brick", "Block", "Stucco", "Siding", "Stone", "Steel", "Other"]
const OWNERSHIP_TYPES = ["Fee simple", "Condo", "Co-op", "Leasehold", "Other"]
const LISTING_AGREEMENTS = ["FSBO", "Exclusive right", "Exclusive agency", "Open listing", "Other"]

const WATER_OPTIONS = ["Public", "Well", "Community", "Other"]
const SEWER_OPTIONS = ["Public", "Septic", "Community", "Other"]
const UTILITIES_OPTIONS = ["Electricity", "Natural gas", "Propane", "Cable", "Phone", "None", "Other"]
const ENERGY_FEATURES = [
  "Solar PV",
  "Solar hot water",
  "Energy-Star windows",
  "Extra insulation",
  "Tankless water heater",
  "Smart thermostat",
  "EV 240V outlet",
  "Generator transfer switch",
  "Other",
  "None",
]
const INTERNET_OPTIONS = ["Fiber", "Cable", "DSL", "Fixed wireless", "Satellite", "Other", "None"]
const SMART_DEVICES = [
  "Smart thermostat",
  "Smart locks",
  "Smart lighting",
  "Smart garage",
  "Cameras",
  "EV charger/240V outlet",
  "Other",
  "None",
]

function ListingPage2({
  formData,
  updateFormData,
  onBack,
  onSaveDraft,
  onSubmit,
  errors,
  currentPhotoLimit,
  selectedPackage,
  isAccountCreated,
}: ListingPage2Props) {
  const router = useRouter()
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoData[]>([])
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null)
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({})
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const [expandedSections, setExpandedSections] = useState({
    outdoorFeatures: true, // Open by default
    indoorFeatures: false,
    construction: false,
    utilities: false,
  })

  const [isDragging, setIsDragging] = useState(false)

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isNoneSelected = (categoryArray: string[] | undefined, noneValue = "None") => {
    return categoryArray?.includes(noneValue) || false
  }

  const handleCheckboxChange = (categoryKey: string, value: string, checked: boolean, noneValue = "None") => {
    const current = (formData as any)[categoryKey] || []

    if (value === noneValue) {
      if (checked) {
        updateFormData(categoryKey, [noneValue])
      } else {
        updateFormData(categoryKey, [])
      }
    } else {
      let newArray = current.filter((item: string) => item !== noneValue)

      if (checked) {
        newArray = [...newArray, value]
      } else {
        newArray = newArray.filter((item: string) => item !== value)
        if (value === "Other") {
          const newOtherInputs = { ...otherInputs }
          delete newOtherInputs[categoryKey]
          setOtherInputs(newOtherInputs)
        }
      }

      updateFormData(categoryKey, newArray)
    }
  }

  const handleOtherInputChange = (categoryKey: string, value: string) => {
    if (value.length <= 40) {
      setOtherInputs((prev) => ({
        ...prev,
        [categoryKey]: value,
      }))
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => file.type.startsWith("image/"))
    const totalPhotos = uploadedPhotos.length + validFiles.length

    if (totalPhotos <= currentPhotoLimit) {
      const newPhotos = validFiles.map((file) => ({ file, comment: "" }))
      setUploadedPhotos((prev) => [...prev, ...newPhotos])
    }

    // Reset the input value to allow re-uploading the same file
    event.target.value = ""
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => {
      const photoToRemove = prev[index]
      if (photoToRemove?.file) {
        URL.revokeObjectURL(URL.createObjectURL(photoToRemove.file))
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter((file) => file.type.startsWith("image/"))
    const totalPhotos = uploadedPhotos.length + validFiles.length

    if (totalPhotos <= currentPhotoLimit) {
      const newPhotos = validFiles.map((file) => ({ file, comment: "" }))
      setUploadedPhotos((prev) => [...prev, ...newPhotos])
    }
  }

  const updatePhotoComment = (index: number, comment: string) => {
    if (comment.length <= 200) {
      setUploadedPhotos((prev) => prev.map((photo, i) => (i === index ? { ...photo, comment } : photo)))
    }
  }

  const handlePhotoDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPhotoIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handlePhotoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"

    // Only update if different to prevent flashing
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handlePhotoDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only clear if leaving the entire card area
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null)
    }
  }

  const handlePhotoDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)

    if (draggedPhotoIndex === null || draggedPhotoIndex === dropIndex) {
      setDraggedPhotoIndex(null)
      return
    }

    setUploadedPhotos((prev) => {
      const newPhotos = [...prev]
      const draggedPhoto = newPhotos[draggedPhotoIndex]

      // Remove dragged photo from its original position
      newPhotos.splice(draggedPhotoIndex, 1)

      // Insert at new position
      const adjustedDropIndex = draggedPhotoIndex < dropIndex ? dropIndex - 1 : dropIndex
      newPhotos.splice(adjustedDropIndex, 0, draggedPhoto)

      return newPhotos
    })

    setDraggedPhotoIndex(null)
  }

  const handleSaveDraft = () => {
    console.log("[v0] Saving draft...")
    // TODO: Implement actual save to localStorage or API
    localStorage.setItem("listing-draft", JSON.stringify(formData))
    alert("Draft saved successfully!")
  }

  const handleSubmit = () => {
    console.log("[v0] Submitting listing...")
    // TODO: Implement actual API submission
    // For now, just navigate to success page
    router.push("/realestate/success")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Back Button */}
      

      {isAccountCreated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-800">Great! Your listing is linked to your account.</h4>
              <p className="text-sm text-green-700 mt-1">
                Continue editing, and you can always manage it in Profile → My Real Estate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Outdoor Features */}
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <button
          type="button"
          onClick={() => toggleSection("outdoorFeatures")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Outdoor Features</h3>
            <p className="text-sm text-gray-600 mt-1">
              These fields are not required to place your order and may be completed at a later date in your account
            </p>
          </div>
          {expandedSections.outdoorFeatures ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.outdoorFeatures && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-6">
                {/* Outdoor Spaces */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Outdoor Spaces</h4>
                  {OUTDOOR_SPACES_OPTIONS.map((space) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.outdoorSpaces)
                    const isDisabled = isNoneSelectedInCategory && space !== "None"

                    return (
                      <div key={space}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`outdoor-${space.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.outdoorSpaces?.includes(space) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("outdoorSpaces", space, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`outdoor-${space.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {space}
                          </label>
                        </div>
                        {space === "Other" && formData.outdoorSpaces?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other outdoor space (40 chars max)"
                              value={otherInputs.outdoorSpaces || ""}
                              onChange={(e) => handleOtherInputChange("outdoorSpaces", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.outdoorSpaces || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Fencing */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Fencing</h4>
                  {FENCING_OPTIONS.map((fence) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.fencing)
                    const isDisabled = isNoneSelectedInCategory && fence !== "None"

                    return (
                      <div key={fence}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`fence-${fence.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.fencing?.includes(fence) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => handleCheckboxChange("fencing", fence, checked as boolean)}
                          />
                          <label
                            htmlFor={`fence-${fence.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {fence}
                          </label>
                        </div>
                        {fence === "Other" && formData.fencing?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other fencing type (40 chars max)"
                              value={otherInputs.fencing || ""}
                              onChange={(e) => handleOtherInputChange("fencing", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.fencing || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* View */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">View</h4>
                  {VIEW_OPTIONS.map((view) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.view)
                    const isDisabled = isNoneSelectedInCategory && view !== "None"

                    return (
                      <div key={view}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`view-${view.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.view?.includes(view) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => handleCheckboxChange("view", view, checked as boolean)}
                          />
                          <label
                            htmlFor={`view-${view.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {view}
                          </label>
                        </div>
                        {view === "Other" && formData.view?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other view type (40 chars max)"
                              value={otherInputs.view || ""}
                              onChange={(e) => handleOtherInputChange("view", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.view || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Parking Type */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Parking Type</h4>
                  {PARKING_OPTIONS.map((parking) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.parkingType)
                    const isDisabled = isNoneSelectedInCategory && parking !== "None"

                    return (
                      <div key={parking}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`parking-${parking.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.parkingType?.includes(parking) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("parkingType", parking, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`parking-${parking.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {parking}
                          </label>
                        </div>
                        {parking === "Other" && formData.parkingType?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other parking type (40 chars max)"
                              value={otherInputs.parkingType || ""}
                              onChange={(e) => handleOtherInputChange("parkingType", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.parkingType || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* RV/Boat Parking */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rvBoatParking"
                      checked={formData.rvBoatParking || false}
                      onCheckedChange={(checked) => updateFormData("rvBoatParking", checked)}
                    />
                    <label htmlFor="rvBoatParking" className="text-sm font-medium">
                      RV/Boat Parking
                    </label>
                  </div>
                </div>

                {/* Lot Features */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Lot Features</h4>
                  {LOT_FEATURES.map((feature) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.lotFeatures)
                    const isDisabled = isNoneSelectedInCategory && feature !== "None"

                    return (
                      <div key={feature}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`lot-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.lotFeatures?.includes(feature) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("lotFeatures", feature, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`lot-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {feature}
                          </label>
                        </div>
                        {feature === "Other" && formData.lotFeatures?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other lot feature (40 chars max)"
                              value={otherInputs.lotFeatures || ""}
                              onChange={(e) => handleOtherInputChange("lotFeatures", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.lotFeatures || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Additional Details */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700">Additional Details</h4>

                  <div className="space-y-2">
                    <Select
                      value={formData.poolType || ""}
                      onValueChange={(value) => updateFormData("poolType", value)}
                    >
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue placeholder="Pool Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {POOL_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Garage Spaces"
                        value={formData.garageSpaces || ""}
                        onChange={(e) => updateFormData("garageSpaces", e.target.value)}
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Driveway Spaces"
                        value={formData.drivewaySpaces || ""}
                        onChange={(e) => updateFormData("drivewaySpaces", e.target.value)}
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Lot Size (e.g., 0.25 acres, 10,000 sqft)"
                      value={formData.lotSize || ""}
                      onChange={(e) => updateFormData("lotSize", e.target.value)}
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indoor Features & Extra */}
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <button
          type="button"
          onClick={() => toggleSection("indoorFeatures")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Indoor Features & Extra</h3>
            <p className="text-sm text-gray-600 mt-1">
              These fields are not required to place your order and may be completed at a later date in your account
            </p>
          </div>
          {expandedSections.indoorFeatures ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.indoorFeatures && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-6">
                {/* Flooring */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Flooring</h4>
                  {FLOORING_OPTIONS.map((floor) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.flooring)
                    const isDisabled = isNoneSelectedInCategory && floor !== "None"

                    return (
                      <div key={floor}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`floor-${floor.toLowerCase()}`}
                            checked={formData.flooring?.includes(floor) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => handleCheckboxChange("flooring", floor, checked as boolean)}
                          />
                          <label
                            htmlFor={`floor-${floor.toLowerCase()}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {floor}
                          </label>
                        </div>
                        {floor === "Other" && formData.flooring?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other flooring type (40 chars max)"
                              value={otherInputs.flooring || ""}
                              onChange={(e) => handleOtherInputChange("flooring", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.flooring || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Heating */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Heating</h4>
                  {HEATING_OPTIONS.map((heat) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.heating, "No heat")
                    const isDisabled = isNoneSelectedInCategory && heat !== "No heat"

                    return (
                      <div key={heat}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`heat-${heat.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.heating?.includes(heat) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("heating", heat, checked as boolean, "No heat")
                            }
                          />
                          <label
                            htmlFor={`heat-${heat.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {heat}
                          </label>
                        </div>
                        {heat === "Other" && formData.heating?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other heating type (40 chars max)"
                              value={otherInputs.heating || ""}
                              onChange={(e) => handleOtherInputChange("heating", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.heating || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Cooling */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Cooling</h4>
                  {COOLING_OPTIONS.map((cool) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.cooling, "No AC")
                    const isDisabled = isNoneSelectedInCategory && cool !== "No AC"

                    return (
                      <div key={cool}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`cool-${cool.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.cooling?.includes(cool) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("cooling", cool, checked as boolean, "No AC")
                            }
                          />
                          <label
                            htmlFor={`cool-${cool.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {cool}
                          </label>
                        </div>
                        {cool === "Other" && formData.cooling?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other cooling type (40 chars max)"
                              value={otherInputs.cooling || ""}
                              onChange={(e) => handleOtherInputChange("cooling", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.cooling || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-6">
                {/* Appliances */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Appliances</h4>
                  {APPLIANCES_OPTIONS.map((appliance) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.appliances)
                    const isDisabled = isNoneSelectedInCategory && appliance !== "None"

                    return (
                      <div key={appliance}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`appliance-${appliance.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.appliances?.includes(appliance) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("appliances", appliance, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`appliance-${appliance.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {appliance}
                          </label>
                        </div>
                        {appliance === "Other" && formData.appliances?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other appliance (40 chars max)"
                              value={otherInputs.appliances || ""}
                              onChange={(e) => handleOtherInputChange("appliances", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.appliances || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Laundry Features */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                    Laundry Features
                  </h4>
                  {LAUNDRY_OPTIONS.map((laundry) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.laundryFeatures)
                    const isDisabled = isNoneSelectedInCategory && laundry !== "None"

                    return (
                      <div key={laundry}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`laundry-${laundry.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.laundryFeatures?.includes(laundry) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("laundryFeatures", laundry, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`laundry-${laundry.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {laundry}
                          </label>
                        </div>
                        {laundry === "Other" && formData.laundryFeatures?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other laundry feature (40 chars max)"
                              value={otherInputs.laundryFeatures || ""}
                              onChange={(e) => handleOtherInputChange("laundryFeatures", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.laundryFeatures || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Red Visibility Tag & Special Features */}
                {formData.package === "premium" && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700">Premium Features</h4>

                    <div className="space-y-2">
                      <Input
                        placeholder="Red visibility tag (20 chars max)"
                        value={formData.redVisibilityTag || ""}
                        onChange={(e) => {
                          if (e.target.value.length <= 20) {
                            updateFormData("redVisibilityTag", e.target.value)
                          }
                        }}
                        maxLength={20}
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">{(formData.redVisibilityTag || "").length}/20 characters</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700">Special Features</h4>
                  <p className="text-xs text-gray-600">Add up to 4 special features (20 characters each)</p>

                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="space-y-2">
                      <Input
                        placeholder={`Special feature ${index + 1} (20 chars max)`}
                        value={formData.specialFeatures?.[index] || ""}
                        onChange={(e) => {
                          if (e.target.value.length <= 20) {
                            const features = [...(formData.specialFeatures || [])]
                            features[index] = e.target.value
                            updateFormData("specialFeatures", features)
                          }
                        }}
                        maxLength={20}
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        {(formData.specialFeatures?.[index] || "").length}/20 characters
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Construction & Legal Records */}
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <button
          type="button"
          onClick={() => toggleSection("construction")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Construction & Legal Records</h3>
            <p className="text-sm text-gray-600 mt-1">
              These fields are not required to place your order and may be completed at a later date in your account
            </p>
          </div>
          {expandedSections.construction ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.construction && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Construction</h4>
                  {CONSTRUCTION_OPTIONS.map((construction) => {
                    return (
                      <div key={construction}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`construction-${construction.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.construction?.includes(construction) || false}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("construction", construction, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`construction-${construction.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm font-medium"
                          >
                            {construction}
                          </label>
                        </div>
                        {construction === "Other" && formData.construction?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other construction type (40 chars max)"
                              value={otherInputs.construction || ""}
                              onChange={(e) => handleOtherInputChange("construction", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.construction || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newConstruction"
                      checked={formData.newConstruction || false}
                      onCheckedChange={(checked) => updateFormData("newConstruction", checked)}
                    />
                    <label htmlFor="newConstruction" className="text-sm font-medium">
                      New Construction
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Builder Name"
                    value={formData.builder || ""}
                    onChange={(e) => updateFormData("builder", e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Zoning (e.g., Residential)"
                    value={formData.zoning || ""}
                    onChange={(e) => updateFormData("zoning", e.target.value)}
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Parcel/APN (e.g., 123-456-789)"
                    value={formData.parcelApn || ""}
                    onChange={(e) => updateFormData("parcelApn", e.target.value)}
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Select
                    value={formData.ownershipType || ""}
                    onValueChange={(value) => updateFormData("ownershipType", value)}
                  >
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Ownership Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {OWNERSHIP_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select
                    value={formData.listingAgreement || ""}
                    onValueChange={(value) => updateFormData("listingAgreement", value)}
                  >
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Listing Agreement" />
                    </SelectTrigger>
                    <SelectContent>
                      {LISTING_AGREEMENTS.map((agreement) => (
                        <SelectItem key={agreement} value={agreement}>
                          {agreement}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Input
                    type="date"
                    placeholder="Date on Market"
                    value={formData.dateOnMarket || ""}
                    onChange={(e) => updateFormData("dateOnMarket", e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Utilities, Energy & Connectivity */}
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <button
          type="button"
          onClick={() => toggleSection("utilities")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Utilities, Energy & Connectivity</h3>
            <p className="text-sm text-gray-600 mt-1">
              These fields are not required to place your order and may be completed at a later date in your account
            </p>
          </div>
          {expandedSections.utilities ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.utilities && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Select value={formData.water || ""} onValueChange={(value) => updateFormData("water", value)}>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Water" />
                    </SelectTrigger>
                    <SelectContent>
                      {WATER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={formData.sewer || ""} onValueChange={(value) => updateFormData("sewer", value)}>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Sewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEWER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Utilities Available */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                    Utilities Available
                  </h4>
                  {UTILITIES_OPTIONS.map((utility) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.utilitiesAvailable)
                    const isDisabled = isNoneSelectedInCategory && utility !== "None"

                    return (
                      <div key={utility}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`utility-${utility.toLowerCase()}`}
                            checked={formData.utilitiesAvailable?.includes(utility) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("utilitiesAvailable", utility, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`utility-${utility.toLowerCase()}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {utility}
                          </label>
                        </div>
                        {utility === "Other" && formData.utilitiesAvailable?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other utility (40 chars max)"
                              value={otherInputs.utilitiesAvailable || ""}
                              onChange={(e) => handleOtherInputChange("utilitiesAvailable", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.utilitiesAvailable || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Energy Features */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                    Energy & Green Features
                  </h4>
                  {ENERGY_FEATURES.map((feature) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.energyFeatures)
                    const isDisabled = isNoneSelectedInCategory && feature !== "None"

                    return (
                      <div key={feature}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`energy-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.energyFeatures?.includes(feature) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("energyFeatures", feature, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`energy-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {feature}
                          </label>
                        </div>
                        {feature === "Other" && formData.energyFeatures?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other energy feature (40 chars max)"
                              value={otherInputs.energyFeatures || ""}
                              onChange={(e) => handleOtherInputChange("energyFeatures", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.energyFeatures || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Input
                    placeholder="Typical Download Speed (Mbps)"
                    value={formData.downloadSpeed || ""}
                    onChange={(e) => updateFormData("downloadSpeed", e.target.value)}
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Cellular Notes"
                    value={formData.cellularNotes || ""}
                    onChange={(e) => updateFormData("cellularNotes", e.target.value)}
                    className="bg-gray-50"
                  />
                </div>

                {/* Internet Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                    Internet Options
                  </h4>
                  {INTERNET_OPTIONS.map((option) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.internetOptions)
                    const isDisabled = isNoneSelectedInCategory && option !== "None"

                    return (
                      <div key={option}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`internet-${option.toLowerCase()}`}
                            checked={formData.internetOptions?.includes(option) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("internetOptions", option, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`internet-${option.toLowerCase()}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {option}
                          </label>
                        </div>
                        {option === "Other" && formData.internetOptions?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other internet option (40 chars max)"
                              value={otherInputs.internetOptions || ""}
                              onChange={(e) => handleOtherInputChange("internetOptions", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.internetOptions || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Smart Devices */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Smart Devices</h4>
                  {SMART_DEVICES.map((device) => {
                    const isNoneSelectedInCategory = isNoneSelected(formData.smartDevices)
                    const isDisabled = isNoneSelectedInCategory && device !== "None"

                    return (
                      <div key={device}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`smart-${device.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={formData.smartDevices?.includes(device) || false}
                            disabled={isDisabled}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("smartDevices", device, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`smart-${device.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                          >
                            {device}
                          </label>
                        </div>
                        {device === "Other" && formData.smartDevices?.includes("Other") && (
                          <div className="ml-6 mt-2">
                            <Input
                              placeholder="Specify other smart device (40 chars max)"
                              value={otherInputs.smartDevices || ""}
                              onChange={(e) => handleOtherInputChange("smartDevices", e.target.value)}
                              maxLength={40}
                              className="bg-gray-50 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(otherInputs.smartDevices || "").length}/40 characters
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media & Publish */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Media & Publish</h3>

          {/* Photo Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Photos</h4>
              <span className="text-sm text-gray-500">
                {uploadedPhotos.length}/{selectedPackage === "premium" ? 40 : 5} photos
              </span>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("photo-upload")?.click()}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                {isDragging ? "Drop photos here" : "Drag and drop photos here, or click to select"}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {selectedPackage === "premium" ? "Up to 40 photos" : "Up to 5 photos"}
              </p>
              <input
                type="file"
                multiple={selectedPackage === "premium"}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  document.getElementById("photo-upload")?.click()
                }}
                disabled={uploadedPhotos.length >= currentPhotoLimit}
              >
                Select Photos
              </Button>
            </div>

            {/* Photo Preview */}
            {uploadedPhotos.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {uploadedPhotos.length > 1 && "Drag photos to reorder them. "}
                  Add comments to describe each photo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uploadedPhotos.map((photoData, index) => {
                    let imageUrl = "/placeholder.svg"
                    try {
                      imageUrl = URL.createObjectURL(photoData.file)
                    } catch (error) {
                      console.error("Error creating object URL:", error)
                    }

                    return (
                      <div key={index} className="relative">
                        {draggedPhotoIndex !== null && draggedPhotoIndex !== index && dragOverIndex === index && (
                          <div className="absolute -left-4 top-0 bottom-0 z-20 flex items-center">
                            <div className="w-1 h-full bg-blue-500 rounded-full animate-pulse shadow-lg" />
                            <div className="absolute -left-8 top-1/2 -translate-y-1/2">
                              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full whitespace-nowrap">
                                Drop here
                              </span>
                            </div>
                          </div>
                        )}

                        <div
                          className={`relative bg-white border rounded-lg p-4 transition-all duration-200 ${
                            draggedPhotoIndex === index ? "opacity-50 scale-95" : "hover:shadow-md"
                          } ${
                            dragOverIndex === index && draggedPhotoIndex !== index
                              ? "border-blue-500 bg-blue-50 shadow-lg"
                              : ""
                          }`}
                          draggable={uploadedPhotos.length > 1}
                          onDragStart={(e) => handlePhotoDragStart(e, index)}
                          onDragOver={(e) => handlePhotoDragOver(e, index)}
                          onDragLeave={handlePhotoDragLeave}
                          onDrop={(e) => handlePhotoDrop(e, index)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">Photo {index + 1}</span>
                            {uploadedPhotos.length > 1 && (
                              <div className="flex items-center gap-1 text-xs text-gray-400 cursor-move">
                                <span>⋮⋮</span>
                                <span>Drag to reorder</span>
                              </div>
                            )}
                          </div>

                          <div className="relative mb-3">
                            <img
                              src={imageUrl || "/placeholder.svg"}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-[250px] object-cover rounded-lg"
                              onLoad={() => {
                                if (imageUrl !== "/placeholder.svg") {
                                  URL.revokeObjectURL(imageUrl)
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`photo-comment-${index}`} className="text-xs font-medium text-gray-700">
                              Photo Description
                            </Label>
                            <div className="relative">
                              <Input
                                id={`photo-comment-${index}`}
                                type="text"
                                placeholder="Add a description for this photo..."
                                value={photoData.comment}
                                onChange={(e) => updatePhotoComment(index, e.target.value)}
                                className="text-sm pr-12"
                                maxLength={200}
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                {photoData.comment.length}/200
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row gap-2 sm:gap-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2 sm:gap-4 ml-auto">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            Submit Listing
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ListingPage2
export { ListingPage2 }
