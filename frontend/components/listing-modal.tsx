"use client"

import { useEffect, useRef } from "react"
import { PropertyDetailsModal } from "@/components/property-details-modal"

interface ListingModalProps {
  listing: any
  isOpen: boolean
  onClose: () => void
}

export function ListingModal({ listing, isOpen, onClose }: ListingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      modalRef.current?.focus()

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose()
        }
      }

      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !listing) return null

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-[10001] focus:outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-modal-title"
    >
      <PropertyDetailsModal listing={listing} isOpen={isOpen} onClose={onClose} />
    </div>
  )
}
