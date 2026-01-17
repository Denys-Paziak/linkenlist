"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsString } from "nuqs";
import { listingTypeOptions } from "../../../options";

export function ListingType() {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);

  const [selectedType, setSelectedType] = useQueryStateWithLocalStorage(
    "/realestate?type",
    {
      defaultValue: "sale",
      parse: (v) => parseAsString.parse(v),
      sync: true,
      clearOnDefault: false,
    }
  );

  return (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(state => !state)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <span>{selectedType === "rent" ? "For Rent" : "For Sale"}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {activeDropdown && (
        <div className="mt-1 w-full absolute z-10 top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {listingTypeOptions.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setSelectedType(type.value);
                setActiveDropdown(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                selectedType === type.value ? "bg-primary/10 text-primary" : ""
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
