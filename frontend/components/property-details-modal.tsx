"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { PropertyImageGallery } from "./property-modal/property-image-gallery"
import { PropertyContactForm } from "./property-modal/property-contact-form"
import { PropertyHeader } from "./property-modal/property-header"
import { PropertyDescription } from "./property-modal/property-description"
import { PropertyFacts } from "./property-modal/property-facts"
import { PropertyActionSidebar } from "./property-modal/property-action-sidebar"
import { PropertyExpandableSections } from "./property-modal/property-expandable-sections"

interface PropertyDetailsModalProps {
  listing: any
  isOpen: boolean
  onClose: () => void
}

export function PropertyDetailsModal({ listing, isOpen, onClose }: PropertyDetailsModalProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  const images = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  const imageComments = [
    "Beautiful exterior with modern landscaping",
    "Spacious living room with natural light",
    "Updated kitchen with granite countertops",
    "Master bedroom with walk-in closet",
    "Renovated bathroom with dual vanity",
  ]

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Main Modal */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[10001] flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <div
          className="flex flex-col w-full max-w-6xl h-screen bg-white rounded-sm overflow-hidden shadow-2xl border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 z-[10002] bg-white hover:bg-gray-50 rounded-full shadow-lg md:shadow-md border border-gray-200"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto">
            {/* Image Section */}
            <div className="p-4 pb-0">
              <PropertyImageGallery images={images} imageComments={imageComments} isOpen={isOpen} onClose={onClose} />
            </div>

            {/* Main Info Section */}
            <div className="p-6 pt-0 mt-8 pl-0.5 pr-0.5">
              <PropertyHeader listing={listing} />

              {/* Content Section */}
              <div className="bg-gray-50 p-6 rounded-lg px-0.5 py-0.5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Description and Facts */}
                  <div className="lg:col-span-2 space-y-6">
                    <PropertyDescription listing={listing} />

                    <PropertyFacts listing={listing} />
                  </div>

                  <PropertyActionSidebar listing={listing} onEmailClick={() => setIsEmailModalOpen(true)} />
                </div>
              </div>

              <PropertyExpandableSections listing={listing} />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <PropertyContactForm listing={listing} isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    </>
  )
}
