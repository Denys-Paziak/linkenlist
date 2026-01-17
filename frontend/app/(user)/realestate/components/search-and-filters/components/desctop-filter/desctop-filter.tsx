"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ListingType } from "./components/listing-type";
import { Price } from "./components/price";
import { BedsBaths } from "./components/beds-baths";
import { HomeType } from "./components/home-type";
import { Sort } from "./components/sort";
import { More } from "./components/more";
import { useSearchParams } from "next/navigation";
import { cn } from "../../../../../../../lib/utils";
import { Actions } from "../actions";

export function DesctopFilter() {
  const query = useSearchParams();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 w-full">
        {/* Always visible core filters */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* For Sale - always visible */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleDropdown("forSale")}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              activeDropdown === "forSale"
                ? "border-slate-600 bg-slate-100 text-slate-800"
                : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <span className="truncate">
              {query.get("type") === "rent" ? "For Rent" : "For Sale"}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform flex-shrink-0 ${
                activeDropdown === "forSale" ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* Price - visible on larger screens only */}
          <div className="hidden lg:block flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDropdown("price")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
                activeDropdown === "price"
                  ? "border-slate-600 bg-slate-100 text-slate-800"
                  : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">Price</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${
                  activeDropdown === "price" ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {/* Beds & Baths - visible on extra large screens only */}
          <div className="hidden xl:block flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDropdown("bedsBaths")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
                activeDropdown === "bedsBaths"
                  ? "border-slate-600 bg-slate-100 text-slate-800"
                  : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">Beds & Baths</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${
                  activeDropdown === "bedsBaths" ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {/* Home Type - visible on 2xl+ screens */}
          <div className="hidden 2xl:block flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDropdown("homeType")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
                activeDropdown === "homeType"
                  ? "border-slate-600 bg-slate-100 text-slate-800"
                  : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">Property Types</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${
                  activeDropdown === "homeType" ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {/* Sort - visible on 3xl+ screens */}
          <div className="hidden 3xl:block flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDropdown("sort")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
                activeDropdown === "sort"
                  ? "border-slate-600 bg-slate-100 text-slate-800"
                  : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">Sort</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${
                  activeDropdown === "sort" ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </div>

        {/* More button - always visible, right-aligned */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleDropdown("more")}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-colors whitespace-nowrap ${
              activeDropdown === "more"
                ? "border-slate-600 bg-slate-100 text-slate-800"
                : "border-gray-300 bg-white text-gray-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <span className="truncate">More</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform flex-shrink-0 ${
                activeDropdown === "more" ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-40 max-h-96 overflow-y-auto",
          !activeDropdown && "hidden"
        )}
      >
        <div className={activeDropdown === "forSale" ? "" : "hidden"}>
          <ListingType />
        </div>

        <div className={activeDropdown === "price" ? "" : "hidden"}>
          <Price />
        </div>

        <div className={activeDropdown === "bedsBaths" ? "" : "hidden"}>
          <BedsBaths />
        </div>

        <div className={activeDropdown === "homeType" ? "" : "hidden"}>
          <HomeType />
        </div>

        <div className={activeDropdown === "sort" ? "" : "hidden"}>
          <Sort />
        </div>

        {/* More Dropdown */}
        {activeDropdown === "more" && (
          <div className="p-4 space-y-4">
            <div className="lg:hidden">
              <Price />
            </div>

            <div className="xl:hidden">
              <BedsBaths />
            </div>

            <div className="2xl:hidden">
              <HomeType />
            </div>

            <div className="3xl:hidden">
              <Label className="text-sm font-medium mb-3 block">Sort By</Label>
              <Sort />
            </div>

            <More />
          </div>
        )}
        <Actions />
      </div>
    </div>
  );
}
