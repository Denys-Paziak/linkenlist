"use client"

import { useState } from "react"

interface PropertyDescriptionProps {
  listing: any
}

export function PropertyDescription({ listing }: PropertyDescriptionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  const fullDescription = `Where Classic Charm Meets Modern Elegance -- Welcome to 20 Aquia Avenue—a timeless 1950s Cape Cod, masterfully reimagined for today's lifestyle. Tucked away on a beautifully landscaped .36 acres, this 4-bedroom, 2-bath residence offers approximately 1600sqft of refined living space, which includes the enclosed sunroom that sets a gracious tone from the moment you arrive.

Step inside to a harmonious blend of sophistication and comfort. The renovated kitchen is a true showpiece, showcasing gleaming quartz countertops, professionally refinished cabinetry, and sleek stainless steel appliances. The main level also features a well-proportioned living room, a convenient laundry area with direct access to the backyard, two spacious bedrooms, and a full bath with classic tilework and a tub/shower combination.

Upstairs, you'll find two additional bedrooms and a second full bath, complete with a custom walk-in shower—ideal for guests or a private retreat.

The exterior is equally impressive. A manicured front garden delivers instant curb appeal, while the oversized garage easily accommodates two vehicles and provides ample space for storage or hobbies. Whether you're entertaining on the patio, relaxing in the sunroom, or simply enjoying the serenity of the backyard, this home is a perfect balance of form and function—designed to impress and built to endure.`

  const isLongDescription = fullDescription.length > 450
  const truncatedDescription = isLongDescription ? fullDescription.substring(0, 450) + "..." : fullDescription

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-[#002244] pb-2">Description</h2>
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
        <div className="relative">
          <div
            dangerouslySetInnerHTML={{
              __html: (showFullDescription || !isLongDescription ? fullDescription : truncatedDescription)
                .split("\n\n")
                .map((paragraph) => `<p class="mb-4">${paragraph}</p>`)
                .join(""),
            }}
          />
          {isLongDescription && !showFullDescription && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          )}
        </div>
        {isLongDescription && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="inline-flex items-center gap-2 text-[#002244] hover:text-gray-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {showFullDescription ? (
                <>
                  Show Less
                  <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              ) : (
                <>
                  Show More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Special Features Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Special Features</h3>
        <div className="flex flex-wrap gap-2">
          {listing.specialFeatures?.slice(0, 4).map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#002244] text-white border border-[#002244]"
            >
              {feature}
            </span>
          )) || (
            <>
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-[#002244] text-white border border-[#002244]">
                Renovated Kitchen
              </span>
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-[#002244] text-white border border-[#002244]">
                Hardwood Floors
              </span>
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-[#002244] text-white border border-[#002244]">
                Two-Car Garage
              </span>
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-[#002244] text-white border border-[#002244]">
                Enclosed Sunroom
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center text-gray-600 text-sm">
          <span className="font-semibold text-gray-900">14 days</span>
          <span className="mx-2">on LinkEnlist</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="font-semibold text-gray-900">254</span>
          <span className="mx-2">views</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="font-semibold text-gray-900">10</span>
          <span className="mx-2">saves</span>
        </div>
      </div>
    </div>
  )
}
