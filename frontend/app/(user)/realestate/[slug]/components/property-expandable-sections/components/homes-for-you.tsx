'use client'

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../../../../components/ui/button";

export function HomesForYou() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 ml-2.5">
        <h3 className="text-xl font-bold text-gray-900">Homes for you</h3>
        <div className="flex gap-2 mx-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const container = document.getElementById(
                "homes-scroll-container",
              );
              if (container) {
                container.scrollBy({ left: -280, behavior: "smooth" });
              }
            }}
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const container = document.getElementById(
                "homes-scroll-container",
              );
              if (container) {
                container.scrollBy({ left: 280, behavior: "smooth" });
              }
            }}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        id="homes-scroll-container"
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {mockListings.map((listing) => (
          <div key={listing.id} className="flex-shrink-0 w-[280px]">
            <PropertyCard
              listing={listing}
              onDetailsClick={() => {}}
              isBookmarked={false}
              onBookmarkToggle={() => {}}
              showStatusBadges="inactive-only"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
