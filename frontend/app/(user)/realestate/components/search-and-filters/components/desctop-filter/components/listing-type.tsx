"use client";

import { parseAsString } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { listingTypeOptions } from "../../../options";

export function ListingType() {
  const [selectedType, setSelectedType] = useQueryStateWithLocalStorage(
    "/realestate?type",
    {
      defaultValue: "sale",
      parse: (v) => parseAsString.parse(v),
      sync: true,
      clearOnDefault: false
    }
  );

  return (
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        {listingTypeOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center w-fit space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              value={option.value}
              checked={selectedType === option.value}
              onChange={() => setSelectedType(option.value)}
              className="w-4 h-4 text-slate-600"
            />
            <span className="text-sm font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
