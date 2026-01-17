"use client";

import { useState } from "react";
import { sortOptions } from "../../../options";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsString } from "nuqs";
import { ChevronDown } from "lucide-react";

export function Sort() {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);

  const [sort, setSort] = useQueryStateWithLocalStorage("/realestate?sort", {
    defaultValue: "recommended",
    parse: (v) => parseAsString.parse(v),
    sync: true,
  });

  return (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown((state) => !state)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <span>
          {sortOptions.find((opt) => opt.value === sort)?.label || "Sort"}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {activeDropdown && (
        <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSort(option.value);
                setActiveDropdown(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                sort === option.value ? "bg-primary/10 text-primary" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
