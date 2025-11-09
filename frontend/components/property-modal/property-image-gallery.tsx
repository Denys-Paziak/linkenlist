"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react"

interface PropertyImageGalleryProps {
  images: string[]
  imageComments: string[]
  isOpen: boolean
  onClose: () => void
}

export function PropertyImageGallery({ images, imageComments, isOpen, onClose }: PropertyImageGalleryProps) {
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openPhotoGallery = () => {
    setIsPhotoGalleryOpen(true)
  }

  const closePhotoGallery = () => {
    setIsPhotoGalleryOpen(false)
  }

  const openFullscreen = (index: number) => {
    setFullscreenImageIndex(index)
    setIsFullscreenOpen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreenOpen(false)
  }

  const backToGallery = () => {
    setIsFullscreenOpen(false)
    setIsPhotoGalleryOpen(true)
  }

  const nextFullscreenImage = () => {
    setFullscreenImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevFullscreenImage = () => {
    setFullscreenImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  // Handle keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreenOpen) {
        event.preventDefault()
        if (event.key === "ArrowLeft") {
          prevFullscreenImage()
        } else if (event.key === "ArrowRight") {
          nextFullscreenImage()
        } else if (event.key === "Escape") {
          closeFullscreen()
        }
      }
    }

    if (isFullscreenOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFullscreenOpen])

  // Function to render gallery images with alternating pattern
  const renderGalleryImages = () => {
    const elements = []
    let imageIndex = 0

    while (imageIndex < images.length) {
      const isEvenRow = Math.floor(elements.length) % 2 === 0

      if (isEvenRow) {
        // Row pattern: Large photo (60%) on left, 2 small photos (40%) on right
        const rowImages = []

        // Large photo on left
        if (imageIndex < images.length) {
          rowImages.push(
            <div
              key={`large-left-${imageIndex}`}
              className="w-[60%] relative aspect-[3/2] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openFullscreen(imageIndex)}
            >
              <img
                src={images[imageIndex] || "/placeholder.svg"}
                alt={`Property photo ${imageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {imageIndex + 1}
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity max-w-[200px] truncate">
                {imageComments[imageIndex] || `Photo ${imageIndex + 1}`}
              </div>
            </div>,
          )
          imageIndex++
        }

        // Two small photos on right
        const smallPhotos = []
        for (let i = 0; i < 2 && imageIndex < images.length; i++) {
          smallPhotos.push(
            <div
              key={`small-right-${imageIndex}`}
              className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openFullscreen(imageIndex)}
            >
              <img
                src={images[imageIndex] || "/placeholder.svg"}
                alt={`Property thumbnail ${imageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {imageIndex + 1}
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity max-w-[150px] truncate">
                {imageComments[imageIndex] || `Photo ${imageIndex + 1}`}
              </div>
            </div>,
          )
          imageIndex++
        }

        if (smallPhotos.length > 0) {
          rowImages.push(
            <div key={`small-stack-right-${imageIndex}`} className="w-[40%] flex flex-col gap-2">
              {smallPhotos}
            </div>,
          )
        }

        if (rowImages.length > 0) {
          elements.push(
            <div key={`row-even-${elements.length}`} className="flex gap-4 w-full">
              {rowImages}
            </div>,
          )
        }
      } else {
        // Row pattern: 2 small photos (40%) on left, Large photo (60%) on right
        const rowImages = []

        // Two small photos on left
        const smallPhotos = []
        for (let i = 0; i < 2 && imageIndex < images.length; i++) {
          smallPhotos.push(
            <div
              key={`small-left-${imageIndex}`}
              className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openFullscreen(imageIndex)}
            >
              <img
                src={images[imageIndex] || "/placeholder.svg"}
                alt={`Property thumbnail ${imageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {imageIndex + 1}
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity max-w-[150px] truncate">
                {imageComments[imageIndex] || `Photo ${imageIndex + 1}`}
              </div>
            </div>,
          )
          imageIndex++
        }

        if (smallPhotos.length > 0) {
          rowImages.push(
            <div key={`small-stack-left-${imageIndex}`} className="w-[40%] flex flex-col gap-2">
              {smallPhotos}
            </div>,
          )
        }

        // Large photo on right
        if (imageIndex < images.length) {
          rowImages.push(
            <div
              key={`large-right-${imageIndex}`}
              className="w-[60%] relative aspect-[3/2] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openFullscreen(imageIndex)}
            >
              <img
                src={images[imageIndex] || "/placeholder.svg"}
                alt={`Property photo ${imageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {imageIndex + 1}
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity max-w-[200px] truncate">
                {imageComments[imageIndex] || `Photo ${imageIndex + 1}`}
              </div>
            </div>,
          )
          imageIndex++
        }

        if (rowImages.length > 0) {
          elements.push(
            <div key={`row-odd-${elements.length}`} className="flex gap-4 w-full">
              {rowImages}
            </div>,
          )
        }
      }
    }

    return elements
  }

  return (
    <>
      {/* Desktop Image Grid */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-2 relative">
        {/* Primary Image */}
        <div
          className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md group cursor-pointer"
          onClick={() => openFullscreen(0)}
        >
          <img
            src={images[0] || "/placeholder.svg"}
            alt="Property main"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity max-w-[200px] truncate">
            {imageComments[0] || "Property photo"}
          </div>
        </div>

        {/* Secondary Images */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {images.slice(1, 5).map((img, index) => (
            <div
              key={index + 1}
              className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md group cursor-pointer"
              onClick={() => openFullscreen(index + 1)}
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`Property thumbnail ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity max-w-[150px] truncate">
                {imageComments[index + 1] || `Photo ${index + 2}`}
              </div>
            </div>
          ))}
        </div>

        {/* See all photos button */}
        <div className="absolute bottom-2 right-2 z-10">
          <Button
            variant="secondary"
            className="bg-white/90 hover:bg-white text-gray-800 text-xs px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              openPhotoGallery()
            }}
          >
            <ImageIcon className="h-4 w-4" />
            See all {images.length} photos
          </Button>
        </div>
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden relative h-64 md:h-80 bg-gray-200">
        <img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt="Property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-medium">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {isPhotoGalleryOpen && (
        <div
          className="fixed inset-0 z-[10003] flex items-center justify-center p-4 bg-black/50"
          onClick={closePhotoGallery}
        >
          <div
            className="flex flex-col w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePhotoGallery}
                  className="text-gray-600 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to listing
                </Button>
                <span className="text-sm text-gray-600">{images.length} photos</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closePhotoGallery}
                className="text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4 w-full">{renderGalleryImages()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isFullscreenOpen && (
        <div
          className="fixed inset-0 bg-black z-[99999] flex items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault()
              e.stopPropagation()
              closeFullscreen()
            }
          }}
        >
          {/* Image Container */}
          <div className="relative w-[79%] h-full flex items-center justify-center">
            <img
              src={images[fullscreenImageIndex] || "/placeholder.svg"}
              alt={`Property photo ${fullscreenImageIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Sidebar for details */}
          <div className="w-[21%] h-full bg-white p-6 overflow-y-auto text-gray-800">
            <h3 className="text-xl font-bold mb-4">Image Details</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Comment:</p>
                <p className="text-gray-600">
                  {imageComments[fullscreenImageIndex] || `Photo ${fullscreenImageIndex + 1}`}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Close Button */}
            <div
              className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full text-white flex items-center justify-center transition-colors pointer-events-auto z-[100000] cursor-pointer"
              onClick={closeFullscreen}
            >
              <X className="h-6 w-6" />
            </div>

            {/* Back to Gallery Button */}
            <div
              className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors pointer-events-auto z-[100000] cursor-pointer"
              onClick={backToGallery}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to gallery
            </div>

            {/* Navigation Arrows */}
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full text-white flex items-center justify-center transition-colors pointer-events-auto z-[100000] cursor-pointer"
              onClick={prevFullscreenImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </div>

            <div
              className="absolute right-[21%] top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full text-white flex items-center justify-center transition-colors pointer-events-auto z-[100000] cursor-pointer"
              onClick={nextFullscreenImage}
            >
              <ChevronRight className="h-8 w-8" />
            </div>

            {/* Photo Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-lg font-medium pointer-events-none z-[100000]">
              {fullscreenImageIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
