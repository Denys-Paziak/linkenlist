"use client";

import { parseAsString } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { sortOptions } from "../../../options";

export function Sort() {
  const [sort, setSort] = useQueryStateWithLocalStorage("/realestate?sort", {
    defaultValue: "recommended",
    parse: (v) => parseAsString.parse(v),
    sync: true,
  });

  return (
    <div className="3xl:p-4 space-y-3">
      {sortOptions.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="radio"
            name="sortBy"
            value={option.value}
            checked={sort === option.value}
            onChange={(e) => setSort(e.target.value)}
            className="w-4 h-4 text-slate-600"
          />
          <span className="text-sm font-medium">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
