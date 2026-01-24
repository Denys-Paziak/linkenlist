"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, PlayCircle } from "lucide-react";
import { IRealestate } from "../../../../../types/Realestate";
import { getInitials } from "../../../../../lib/utils";
import Image from "next/image";
import { UserProfileDialog } from "../../../../../components/user-profile-dialog";

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
    } catch {}
  };

  const handleVideoTour = () => {
    if (listing.virtualTourUrl) {
      window.open(listing.virtualTourUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-lg sticky top-16 w-full max-w-sm mx-auto h-fit border border-gray-100">
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
        <UserProfileDialog 
          onClose={() => setIsAgentProfileOpen(false)}
          userInfo={{
            id: listing.owner.id,
            avatar: listing.owner.avatar,
            company: listing.company || null,
            alternativePhone: listing.alternativePhone || "",
            primaryPhone: listing.primaryPhone || "",
            createdAt: listing.owner.createdAt,
            firstName: listing.firstName,
            lastName: listing.lastName,
            listings: listing.owner.listings,
            professionalTitle: listing.owner.professionalTitle,
            publicEmail: listing.email
          }}
        />
      )}
    </>
  );
}
