"use client"
import { Home, Bed, Bath } from "lucide-react"

interface PropertyHeaderProps {
  listing: any
}

export function PropertyHeader({ listing }: PropertyHeaderProps) {
  return (
    <div className="bg-white border-b-4 border-blue-900 p-6 mb-6 px-3.5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {(listing.salePrice || listing.type === "sale") && (
                <span className="px-3 py-1 text-sm font-bold rounded text-white bg-blue-900">FOR SALE</span>
              )}
              {(listing.rentPrice || listing.type === "rent") && (
                <span className="px-3 py-1 text-sm font-bold rounded text-white bg-green-600">FOR RENT</span>
              )}
              {listing.status === "inactive" && (
                <span className="px-3 py-1 text-sm font-bold rounded text-white bg-gray-500">INACTIVE</span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {(listing.salePrice || (listing.type === "sale" && listing.price)) &&
                `$${
                  String(listing.salePrice || listing.price)
                    .replace(/[$,]/g, "")
                    .replace(/[^\d]/g, "")
                    ? Number(
                        String(listing.salePrice || listing.price)
                          .replace(/[$,]/g, "")
                          .replace(/[^\d]/g, ""),
                      ).toLocaleString()
                    : listing.salePrice || listing.price
                }`}
              {(listing.salePrice || (listing.type === "sale" && listing.price)) &&
                (listing.rentPrice || (listing.type === "rent" && listing.price)) && (
                  <span className="text-gray-400 mx-3.5">|</span>
                )}
              {(listing.rentPrice || (listing.type === "rent" && listing.price)) &&
                `$${
                  String(listing.rentPrice || listing.price)
                    .replace(/[$,/mo]/g, "")
                    .replace(/[^\d]/g, "")
                    ? Number(
                        String(listing.rentPrice || listing.price)
                          .replace(/[$,/mo]/g, "")
                          .replace(/[^\d]/g, ""),
                      ).toLocaleString()
                    : listing.rentPrice || listing.price
                }/mo`}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span className="text-sm">{listing.beds} bds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span className="text-sm">{listing.baths} ba</span>
              </div>
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="text-sm">{listing.sqft?.toLocaleString()} sqft</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{listing.address}</p>
          </div>
        </div>

        {/* Right Side - Property Feature Cards */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">10 days</span>
              <span className="text-xs text-gray-600 ml-1">On LinkEnlist</span>
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">Townhome</span>
              <span className="text-xs text-gray-600 ml-1">Property Type</span>
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">1986</span>
              <span className="text-xs text-gray-600 ml-1">Year Built</span>
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">1,440 sq ft</span>
              <span className="text-xs text-gray-600 ml-1">Lot Size</span>
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">$312</span>
              <span className="text-xs text-gray-600 ml-1">Price/Sq.Ft.</span>
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">$101/mo</span>
              <span className="text-xs text-gray-600 ml-1">HOA Dues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
