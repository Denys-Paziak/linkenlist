"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Link, PlayCircle } from "lucide-react";
import { IRealestate } from "../../../../../types/Realestate";
import { formatDateDiff, getInitials } from "../../../../../lib/utils";
import Image from "next/image";

export function PropertyActionSidebar({ listing }: { listing: IRealestate }) {
  const [isAgentProfileOpen, setIsAgentProfileOpen] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showCopyEmailTooltip, setShowCopyEmailTooltip] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(listing.email);
      setShowCopyEmailTooltip(true);
      setTimeout(() => setShowCopyEmailTooltip(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleVideoTour = () => {
    if (listing.virtualTourUrl) {
      window.open(listing.virtualTourUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-lg sticky top-4 w-full max-w-sm mx-auto h-fit border border-gray-100">
        {/* Action Buttons */}
        <div className="flex gap-2 mb-4 items-center">
          <div className="relative w-full">
            <Button
              variant="outline"
              disabled={listing.status === "inactive"}
              className={`w-full border-[#002244] text-[#002244] hover:bg-[#002244] hover:text-white px-3 py-2 text-sm bg-transparent rounded-lg flex-1 ${
                listing.status === "inactive"
                  ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-[#002244]"
                  : ""
              }`}
              onClick={handleCopyEmail}
            >
              ✉️ {listing.email}
            </Button>
            {showCopyEmailTooltip && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                Copied!
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="border-[#002244] text-[#002244] hover:bg-[#002244] hover:text-white p-2 bg-transparent rounded-lg transition-colors"
              onClick={handleCopyLink}
              title="Copy Link"
            >
              <Link className="h-4 w-4" />
            </Button>
            {showCopyTooltip && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                Copied!
              </div>
            )}
          </div>
        </div>

        {listing.virtualTourUrl && (
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:text-gray-700 hover:border-gray-600 hover:bg-gray-100 px-3 py-2 text-sm bg-transparent rounded-lg flex items-center gap-2 flex-1"
              onClick={handleVideoTour}
            >
              <PlayCircle className="h-4 w-4" />
              Video Tour
            </Button>
          </div>
        )}

        <div className="border-t pt-3 mt-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Listed By
          </h3>
          <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setIsAgentProfileOpen(true)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002244] to-[#003366] flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
              {listing.owner.avatar ? (
                <Image
                  src={listing.owner.avatar.url}
                  alt={`${listing.firstName} ${listing.lastName}`}
                  width={listing.owner.avatar.width}
                  height={listing.owner.avatar.height}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(`${listing.firstName} ${listing.lastName}`)
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">
                {listing.firstName} {listing.lastName}
              </p>
              <p className="text-xs text-gray-600">{listing.company}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Profile Modal */}
      {isAgentProfileOpen && (
        <div
          className="fixed inset-0 z-[10003] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setIsAgentProfileOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Agent Profile</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAgentProfileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#002244] to-[#003366] flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-3 overflow-hidden">
                {listing.owner.avatar ? (
                  <Image
                    src={listing.owner.avatar.url}
                    alt={`${listing.firstName} ${listing.lastName}`}
                    width={listing.owner.avatar.width}
                    height={listing.owner.avatar.height}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(`${listing.firstName} ${listing.lastName}`)
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {listing.firstName} {listing.lastName}
              </h3>
              <p className="text-sm text-gray-600">Real Estate Agent</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Contact Information
                </h4>
                <p className="text-sm text-gray-600">
                  📞 {listing.primaryPhone}
                </p>
                <p className="text-sm text-gray-600">
                  📞 {listing.alternativePhone}
                </p>
                <p className="text-sm text-gray-600">✉️ {listing.email}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Company Name</h4>
                <p className="text-sm text-gray-600">{listing.company}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  LinkEnlist Experience
                </h4>
                <p className="text-sm text-gray-600">
                  Member since:{" "}
                  {new Date(listing.owner.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}{" "}
                  ({formatDateDiff(listing.owner.createdAt)})
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Property Listings
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-[#002244]">
                      {listing.owner.listings.forSale}
                    </div>
                    <div className="text-[#002244]">For Sale</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-red-600">
                      {listing.owner.listings.forRent}
                    </div>
                    <div className="text-red-600">For Rent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
