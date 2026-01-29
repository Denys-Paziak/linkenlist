"use client";

import { LayoutGrid, Map, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileFilter } from "./components/mobile-filter/mobile-filter";
import { DesctopFilter } from "./components/desctop-filter/desctop-filter";
import { useState } from "react";

export function SearchAndFilters({
  viewMode,
  onViewModeChange,
  search
}: {
  viewMode: "grid" | "map";
  onViewModeChange: (mode: "grid" | "map") => void;
  search: JSX.Element
}) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <>
      {/* Fixed Filter Bar */}
      <div className="sticky top-[56px] z-40 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="w-full px-3 py-2 md:px-4 md:py-3">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="flex items-center gap-2">
              {/* Search Bar with magnifying glass icon */}
              {search}

              {/* Filters Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {search}

              <DesctopFilter />
            </div>

            <div className="hidden xl:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewModeChange("map")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  viewMode === "map"
                    ? "bg-white border-gray-300 text-gray-700 shadow-sm"
                    : "bg-transparent border-transparent text-gray-600 hover:bg-white hover:text-gray-700"
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white border-gray-300 text-gray-700 shadow-sm"
                    : "bg-transparent border-transparent text-gray-600 hover:bg-white hover:text-gray-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Map Toggle Button for Mobile */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <Button
          onClick={() => onViewModeChange(viewMode === "map" ? "grid" : "map")}
          className="flex items-center gap-2 px-6 py-3 bg-[#002244] hover:bg-[#042d57] text-white rounded-lg shadow-lg border-0 text-sm font-medium"
        >
          {viewMode === "map" ? (
            <>
              <LayoutGrid className="w-4 h-4" />
              List
            </>
          ) : (
            <>
              <Map className="w-4 h-4" />
              Map
            </>
          )}
        </Button>
      </div>

      <MobileFilter
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />
    </>
  );
}
