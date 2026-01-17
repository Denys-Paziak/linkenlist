"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsBoolean, parseAsInteger } from "nuqs";
import { Checkbox } from "../../../../../../../../components/ui/checkbox";
import { Label } from "../../../../../../../../components/ui/label";
import { bathroomsOptions } from "../../../options";

export function Bathrooms() {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);

  const [bathrooms, setBathrooms] = useQueryStateWithLocalStorage(
    "/realestate?bathrooms",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  const [bathsExact, setBathsExact] = useQueryStateWithLocalStorage(
    "/realestate?baths_ex",
    {
      defaultValue: false,
      parse: (v) => parseAsBoolean.parse(v),
      sync: true,
    }
  );

  const activeBathroomOptions = bathroomsOptions.find(
      (item) => item.value === bathrooms
    )?.label;

  return (
    <div className="relative">
      <div className="relative mb-1">
        <button
          onClick={() => setActiveDropdown((state) => !state)}
          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <span>
              {activeBathroomOptions === "Any"
                ? "Bathrooms"
                : activeBathroomOptions}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
        {activeDropdown && (
          <div className="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {bathroomsOptions.map((baths) => (
              <button
                key={baths.value}
                onClick={() => {
                  setBathrooms(baths.value);
                  setActiveDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                  bathrooms === baths.value || (!bathrooms && baths.value === null)
                    ? "bg-primary/10 text-primary"
                    : ""
                }`}
              >
                {baths.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="bathrooms-exact"
          checked={bathsExact}
          onCheckedChange={(checked) =>
            setBathsExact(checked === "indeterminate" ? false : checked)
          }
        />
        <Label
          htmlFor="bathrooms-exact"
          className="text-sm mb-0 cursor-pointer"
        >
          Use exact match
        </Label>
      </div>
    </div>
  );
}
