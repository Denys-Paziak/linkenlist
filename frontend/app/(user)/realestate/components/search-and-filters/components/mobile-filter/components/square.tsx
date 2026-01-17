'use client'

import { parseAsInteger } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";

export function Square() {
  const [sqftMin, setSqftMin] = useQueryStateWithLocalStorage(
    "/realestate?sqft_min",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );
  const [sqftMax, setSqftMax] = useQueryStateWithLocalStorage(
    "/realestate?sqft_max",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Square Footage
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min Sqft"
          value={String(sqftMin)}
          onChange={(e) => setSqftMin(Number(e.target.value) || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        <input
          type="number"
          placeholder="Max Sqft"
          value={String(sqftMax)}
          onChange={(e) => setSqftMax(Number(e.target.value) || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
      </div>
    </div>
  );
}
