"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "../../../../../../../../components/ui/checkbox";
import { Label } from "../../../../../../../../components/ui/label";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsBoolean, parseAsInteger } from "nuqs";
import { bedroomsOptions } from "../../../options";

export function Bedrooms() {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);

  const [bedrooms, setBedrooms] = useQueryStateWithLocalStorage(
    "/realestate?bedrooms",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  const [bedsExact, setBedsExact] = useQueryStateWithLocalStorage(
    "/realestate?beds_ex",
    {
      defaultValue: false,
      parse: (v) => parseAsBoolean.parse(v),
      sync: true,
    }
  );

  const activeBedroomsOptions = bedroomsOptions.find(
    (item) => item.value === bedrooms
  )?.label;

  return (
    <div>
      <div className="relative mb-1">
        <button
          onClick={() => setActiveDropdown((state) => !state)}
          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <span>
            {activeBedroomsOptions === "Any"
              ? "Bedrooms"
              : activeBedroomsOptions}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
        {activeDropdown && (
          <div className="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {bedroomsOptions.map((beds) => (
              <button
                key={beds.value}
                onClick={() => {
                  setBedrooms(beds.value);
                  setActiveDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                  bedrooms === beds.value || (!bedrooms && beds.value === null)
                    ? "bg-primary/10 text-primary"
                    : ""
                }`}
              >
                {beds.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="bedrooms-exact"
          checked={bedsExact}
          onCheckedChange={(checked) =>
            setBedsExact(checked === "indeterminate" ? false : checked)
          }
        />
        <Label htmlFor="bedrooms-exact" className="text-sm mb-0 cursor-pointer">
          Use exact match
        </Label>
      </div>
    </div>
  );
}
