"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SearchAndFilters } from "./components/search-and-filters/search-and-filters";
import { SearchContext } from "./components/search-context";
import { RealestateList } from "./components/realestate-list";
import { RealestateMap } from "./components/realestate-map";
import { AutocompleteSearch } from "./components/search-and-filters/components/autocomplete-search";
import { cn } from "../../../lib/utils";

export default function RealEstatePage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "grid" : "map";
    }
    return "grid";
  });

  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "grid" : "map");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mapApiRef = useRef<{
    fitBounds: (b: google.maps.LatLngBounds) => void;
    setCenterZoom: (lat: number, lng: number, zoom: number) => void;
  } | null>(null);

  const handlePlaceSelect = useCallback(
    (place: {
      viewport?: google.maps.LatLngBounds;
      location?: google.maps.LatLng;
    }) => {
      if (!mapApiRef.current) return;

      if (place.viewport) {
        mapApiRef.current.fitBounds(place.viewport);
      } else if (place.location) {
        mapApiRef.current.setCenterZoom(
          place.location.lat(),
          place.location.lng(),
          12,
        );
      }
    },
    [],
  );

  return (
    <SearchContext>
      <div className="bg-gray-50 ">
        <SearchAndFilters
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          search={<AutocompleteSearch onPlace={handlePlaceSelect} />}
        />

        <div className="relative flex flex-col">
          <div
            className={cn(
              "flex gap-4 px-4",
              viewMode === "grid" && "absolute inset-0",
            )}
          >
            <div
              className="flex-1 sticky"
              style={{
                top: 121.6,
                height: `calc(100vh - ${121.6}px)`,
              }}
            >
              <RealestateMap mapApiRef={mapApiRef} />
            </div>

            <div className="w-[700px] flex flex-col gap-4">
              {viewMode === "map" && (
                <RealestateList
                  viewMode="map"
                  listClasses="list-inner-map p-4 my-1.5 flex-grow h-full"
                />
              )}
            </div>
          </div>
          {viewMode === "grid" && (
            <div
              className="flex flex-col pt-4 px-4 relative top-0 left-0 w-full z-20 bg-gray-50"
              style={{
                minHeight: `calc(100vh - ${121.6}px)`,
              }}
            >
              <RealestateList
                viewMode="grid"
                listClasses="grid-container-realestate flex-grow"
              />
            </div>
          )}
        </div>
      </div>
    </SearchContext>
  );
}
