import { Home, Bed, Bath } from "lucide-react";
import { IRealestate } from "../../../../../types/Realestate";
import { formatDateDiff } from "../../../../../lib/utils";

export function PropertyHeader({ listing }: { listing: IRealestate }) {
  return (
    <div className="bg-white border-b-4 border-blue-900 p-6 mb-6 px-3.5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {listing.forSale && (
                <span className="px-3 py-1 text-sm font-bold rounded text-white bg-blue-900">
                  FOR SALE
                </span>
              )}
              {listing.forRent && (
                <span className="px-3 py-1 text-sm font-bold rounded text-white bg-green-600">
                  FOR RENT
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {renderPrice(listing)}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span className="text-sm">{listing.bedrooms} bds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span className="text-sm">
                  {(listing.bathroomsFull || 0) +
                    (listing.bathroomsHalf
                      ? listing.bathroomsHalf * 0.5
                      : 0)}{" "}
                  ba
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="text-sm">{listing.interiorSize} sqft</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{renderAddress(listing)}</p>
          </div>
        </div>

        {/* Right Side - Property Feature Cards */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">
                {formatDateDiff(listing.publishedAt)}
              </span>
              <span className="text-xs text-gray-600 ml-1">On LinkEnlist</span>
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">
                {listing.propertyType}
              </span>
              <span className="text-xs text-gray-600 ml-1">Property Type</span>
            </div>
            {listing.yearBuilt && (
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
                <span className="text-xs font-medium text-gray-900">
                  {listing.yearBuilt}
                </span>
                <span className="text-xs text-gray-600 ml-1">Year Built</span>
              </div>
            )}
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
              <span className="text-xs font-medium text-gray-900">
                {listing.interiorSize.toLocaleString("en-US")} sq ft
              </span>
              <span className="text-xs text-gray-600 ml-1">Interior Size</span>
            </div>
            {listing.forSale && listing.listPrice && (
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
                <span className="text-xs font-medium text-gray-900">
                  $
                  {Math.ceil(
                    listing.listPrice / listing.interiorSize
                  ).toLocaleString("en-US")}
                </span>
                <span className="text-xs text-gray-600 ml-1">Price/Sq.Ft.</span>
              </div>
            )}
            {listing.hoaPresent && listing.hoaFee && listing.hoaFrequency ? (
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-left min-h-[2.5rem] flex items-center">
                <span className="text-xs font-medium text-gray-900">
                  ${listing.hoaFee}/
                  {listing.hoaFrequency === "month"
                    ? "mo"
                    : listing.hoaFrequency}
                </span>
                <span className="text-xs text-gray-600 ml-1">HOA Dues</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPrice(listing: IRealestate) {
  if (listing.listPrice && listing.monthlyRent) {
    return (
      <>
        ${listing.listPrice.toLocaleString("en-US")}
        <span className="text-gray-600 text-xs mx-2.5 my-1.5 py-0">|</span>$
        {listing.monthlyRent.toLocaleString("en-US")}/mo
      </>
    );
  }

  if (listing.listPrice) {
    return "$" + listing.listPrice.toLocaleString("en-US");
  }

  if (listing.monthlyRent) {
    return "$" + listing.monthlyRent.toLocaleString("en-US") + "/mo";
  }

  return "Price not available";
}

function renderAddress(listing: IRealestate) {
  if (listing.unit && listing.street) {
    return (
      listing.unit +
      " " +
      listing.street +
      ", " +
      listing.city +
      ", " +
      listing.state +
      " " +
      listing.zip
    );
  }

  return listing.city + ", " + listing.state + " " + listing.zip;
}
