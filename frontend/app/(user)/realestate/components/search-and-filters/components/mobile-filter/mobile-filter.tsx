"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Actions } from "../actions";
import { cn } from "../../../../../../../lib/utils";
import { ListingType } from "./components/listing-type";
import { HomeType } from "./components/home-type";
import { Bedrooms } from "./components/bedrooms";
import { Bathrooms } from "./components/bathrooms";
import { Price } from "./components/price";
import { Square } from "./components/square";
import { YearBuilt } from "./components/year-built";
import { PopularTags } from "./components/popular-tags";
import { Sort } from "./components/sort";

interface MobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilter({ isOpen, onClose }: MobileFilterProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className={cn("fixed inset-0 z-[999] lg:hidden", !isOpen && "hidden")}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Search & Filter</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <ListingType />

            <HomeType />

            <Bedrooms />

            <Bathrooms />

            <Price />

            <Square />

            <YearBuilt />

            <PopularTags />

            <Sort />
          </div>

          <Actions />
        </div>
      </div>
    </div>
  );
}
