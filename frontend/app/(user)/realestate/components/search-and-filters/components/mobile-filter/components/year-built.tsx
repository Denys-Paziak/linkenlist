'use client'

import { parseAsInteger } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";

export function YearBuilt() {
  const [yearBuiltMin, setYearBuiltMin] = useQueryStateWithLocalStorage(
    "/realestate?year_min",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );
  const [yearBuiltMax, setYearBuiltMax] = useQueryStateWithLocalStorage(
    "/realestate?year_max",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Year Built
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min Year"
          value={String(yearBuiltMin)}
          onChange={(e) => setYearBuiltMin(Number(e.target.value) || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        <input
          type="number"
          placeholder="Max Year"
          value={String(yearBuiltMax)}
          onChange={(e) => setYearBuiltMax(Number(e.target.value) || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
      </div>
    </div>
  );
}
