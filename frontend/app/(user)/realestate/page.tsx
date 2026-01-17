"use client";

import { useState, useEffect } from "react";
import { SearchAndFilters } from "./components/search-and-filters/search-and-filters";
import { SearchContext } from "./components/search-context";
import { RealestateList } from "./components/realestate-list";
import { RealestateMap } from "./components/realestate-map";

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

  return (
    <SearchContext>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SearchAndFilters viewMode={viewMode} onViewModeChange={setViewMode} />
        <div className="flex-1">
          {viewMode === "map" ? (
            <div className="flex h-full">
              <RealestateMap />

              <div className="hidden md:flex flex-col bg-white border-l border-gray-200 w-[700px] min-h-screen">
                <div className="flex-1 overflow-y-auto flex flex-col">
                  <RealestateList listClasses="list-inner-map p-4 my-1.5 flex-grow h-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full px-4 pt-4 flex flex-col min-h-screen">
              <RealestateList listClasses="grid-container-realestate flex-grow max-h-full h-full" />
            </div>
          )}
        </div>
      </div>
    </SearchContext>
  );
}
