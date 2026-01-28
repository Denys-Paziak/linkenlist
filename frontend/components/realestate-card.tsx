"use client";

import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Square,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { useState } from "react";
import {
  EListingStatus,
  IListingPhoto,
  IRealestateAdminList,
  IRealestateList,
  IRealestateOwnerList,
} from "../types/Realestate";
import Link from "next/link";
import { cn } from "../lib/utils";
import Image from "next/image";
import { fetcherUser } from "../lib/fetcher";
import useSWR from "swr";
import { IUser } from "../types/User";
import { useUser } from "../contexts/user-context";
import { StatusChip, TStatus } from "./ui/status-chip";

export function RealestateCard({
  data,
  showStatusBadges = false,
  showPremiumFeatures = false,
  showFavoriteButton = true,
  isLoading = false,
}: {
  data: IRealestateOwnerList | IRealestateList | IRealestateAdminList;
  showStatusBadges?: boolean;
  showPremiumFeatures?: boolean;
  showFavoriteButton?: boolean;
  isLoading?: boolean;
}) {
  const handleCardClick = async () => {
    try {
      await fetcherUser(`/listings/${data.id}/add-view`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {}
  };

  return (
    <>
      <div
        className={cn(
          "card group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm h-fit",
          data.status === EListingStatus.ACTIVE &&
            "transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer",
          isLoading && "pointer-events-none",
        )}
      >
        {/* Link covering entire card */}
        {data.status === EListingStatus.ACTIVE && (
          <Link
            onClick={handleCardClick}
            href={`/realestate/${data.slug}`}
            className={cn(
              "absolute inset-0 z-[5]",
              isLoading && "pointer-events-none",
            )}
          />
        )}

        <div className="relative">
          <Photos photos={data.photos} />

          {showPremiumFeatures && data.premiumFeatures ? (
            <div className="absolute top-3 left-2 z-10 px-[3px]">
              <div className="bg-[#dc2626] text-white text-[10px] px-1 py-0.5 rounded-full">
                {data.premiumFeatures}
              </div>
            </div>
          ) : null}

          {showStatusBadges && (
            <div className="absolute bottom-2 left-2 z-10 px-[3px]">
              {(data as IRealestateOwnerList)?.isExpired ? (
                <StatusChip text={"expired"} status={"expired"} />
              ) : (
                <StatusChip
                  text={data.status}
                  status={
                    (
                      {
                        [EListingStatus.ACTIVE]: "published",
                        [EListingStatus.DRAFT]: "draft",
                        [EListingStatus.INACTIVE]: "archived",
                        [EListingStatus.PENDING]: "scheduled",
                        [EListingStatus.REJECTED]: "expired",
                      } as Record<EListingStatus, TStatus>
                    )[data.status]
                  }
                />
              )}
            </div>
          )}

          {showFavoriteButton && <FavoriteButton id={data.id} />}
        </div>

        {/* Content Container */}
        <div className="px-2 pb-2">
          {/* Price - updated to handle dual pricing */}
          <h3 className="card-price mb-1 font-bold text-[#002244] text-left text-lg leading-7">
            {renderPrice(data)}
          </h3>

          {/* Property Details - single line with proper spacing */}
          <div className="card-meta flex items-center text-xs text-gray-900 mb-1 whitespace-nowrap">
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Bed className="w-3 h-3" />
              <span>{data.bedrooms} bds</span>
            </div>
            <span className="mx-1">•</span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Bath className="w-3 h-3" />
              <span>
                {(data.bathroomsFull || 0) +
                  (data.bathroomsHalf ? data.bathroomsHalf * 0.5 : 0)}
                ba
              </span>
            </div>
            <span className="mx-1">•</span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Square className="w-3 h-3" />
              <span>{data.interiorSize?.toLocaleString("en-US")} sqft</span>
            </div>
          </div>

          {/* Address - clamped to one line */}
          <p className="card-title text-xs text-gray-900 font-medium text-left">
            {renderAddress(data)}
          </p>
        </div>
      </div>
    </>
  );
}

function FavoriteButton({ id }: { id: number }) {
  const { data: user } = useSWR<IUser>("/users/self");

  const { setShowLoginModal } = useUser();

  const { data, mutate } = useSWR<number[]>(user ? `/favorite/listings` : null);

  const addFavorite = async () => {
    try {
      await fetcherUser(`/favorite/listings/${id}`, {
        method: "POST",
        credentials: "include",
      });

      mutate((draft) => [...(draft || []), id], {
        revalidate: false,
      });
    } catch {}
  };

  const deleteFavorite = async () => {
    try {
      await fetcherUser(`/favorite/listings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      mutate((draft) => draft?.filter((item) => item !== id), {
        revalidate: false,
      });
    } catch {}
  };

  const isFavorite = data?.includes(id);

  return (
    <button
      onClick={() => {
        if (user) {
          if (!isFavorite) {
            addFavorite();
          } else {
            deleteFavorite();
          }
        } else {
          setShowLoginModal(true);
        }
      }}
      className="absolute top-2 right-2 z-20 w-6 h-6 bg-white/90 hover:bg-gray-100 rounded-sm shadow-sm flex items-center justify-center transition-colors duration-200"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={`w-3.5 h-3.5 transition-colors duration-200 ${
          isFavorite
            ? "fill-[#dc2626] text-[#dc2626]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      />
    </button>
  );
}

function Photos({ photos }: { photos: IListingPhoto[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="card-media-container p-2 pb-1 relative">
      <div className="card-media w-full bg-secondary rounded-md border border-gray-200 overflow-hidden relative">
        {photos.length > 0 && (
          <Image
            src={photos[currentImageIndex].url}
            alt={photos[currentImageIndex].caption || ""}
            width={photos[currentImageIndex].width}
            height={photos[currentImageIndex].height}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        )}

        {photos.length > 1 && (
          <>
            {/* Left Arrow - Enhanced visibility */}
            <Button
              size="sm"
              variant="secondary"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 p-0 bg-black/30 hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 border-0 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </Button>

            {/* Right Arrow - Enhanced visibility */}
            <Button
              size="sm"
              variant="secondary"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 p-0 bg-black/30 hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 border-0 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </Button>

            {/* Image Dots - Always visible with better contrast */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {photos.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 border border-white/30 ${
                    index === currentImageIndex
                      ? "bg-white shadow-sm"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function renderPrice(listing: {
  listPrice: number | null;
  monthlyRent: number | null;
}) {
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
export function renderAddress(listing: {
  street?: string | null;
  unit?: string | null;
  zip?: string | null;
  state?: string | null;
  city?: string | null;
}) {
  if (listing.unit && listing.street) {
    return (
      (listing.unit || "[Not specified]") +
      " " +
      (listing.street || "[Not specified]") +
      ", " +
      (listing.city || "[Not specified]") +
      ", " +
      (listing.state || "[Not specified]") +
      " " +
      (listing.zip || "[Not specified]")
    );
  }

  return (
    (listing.city || "[Not specified]") +
    ", " +
    (listing.state || "[Not specified]") +
    " " +
    (listing.zip || "[Not specified]")
  );
}
