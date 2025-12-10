'use client'

import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockListings } from "../../../../data/mock-listings";
import { PropertyCard } from "../../../../components/property-card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FeaturedListings() {
  const router = useRouter();

  const [bookmarkedListings, setBookmarkedListings] = useState<number[]>([]);

  const openPropertyDetails = (listing: any) => {
    router.push(`/realestate?listing=${listing.id}`);
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedListings((prev) => (prev.includes(id) ? prev.filter((listingId) => listingId !== id) : [...prev, id]))
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-5">
      <div className="text-center mb-7">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 text-left">
          Recently Added Listings
        </h2>
      </div>

      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => {
            const container = document.getElementById(
              "featured-listings-scroll"
            );
            if (container) {
              container.scrollBy({ left: -300, behavior: "smooth" });
            }
          }}
          className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Scroll Button */}
        <button
          onClick={() => {
            const container = document.getElementById(
              "featured-listings-scroll"
            );
            if (container) {
              container.scrollBy({ left: 300, behavior: "smooth" });
            }
          }}
          className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scrollable Container */}
        <div className="md:mx-10">
          <div
            id="featured-listings-scroll"
            className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mockListings.slice(0, 8).map((listing) => (
              <div
                key={listing.id}
                className="flex-shrink-0 w-64 md:w-72 snap-start"
              >
                <PropertyCard
                  listing={listing}
                  onDetailsClick={() => openPropertyDetails(listing)}
                  isBookmarked={bookmarkedListings.includes(listing.id)}
                  onBookmarkToggle={() => toggleBookmark(listing.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
