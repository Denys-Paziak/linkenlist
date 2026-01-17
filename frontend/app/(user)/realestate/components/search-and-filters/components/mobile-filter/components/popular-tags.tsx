"use client";

import { parseAsBoolean } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";

export function PopularTags() {
  const [petFriendly, setPetFriendly] = useQueryStateWithLocalStorage(
    "/realestate?pet_friendly",
    {
      defaultValue: false,
      parse: (v) => parseAsBoolean.parse(v),
      sync: true,
    }
  );
  const [parking, setParking] = useQueryStateWithLocalStorage(
    "/realestate?parking",
    {
      defaultValue: false,
      parse: (v) => parseAsBoolean.parse(v),
      sync: true,
    }
  );
  const [noHOA, setNoHOA] = useQueryStateWithLocalStorage(
    "/realestate?no_HOA",
    {
      defaultValue: false,
      parse: (v) => parseAsBoolean.parse(v),
      sync: true,
    }
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Popular Features
      </label>
      <div className="space-y-2">
        <button
          onClick={() => {
            if (petFriendly) {
              setPetFriendly(false);
            } else {
              setPetFriendly(true);
            }
          }}
          className={`w-full text-left px-3 py-2 border rounded-lg text-sm transition-colors ${
            petFriendly
              ? "bg-primary/10 border-primary text-primary"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          Pet Friendly
        </button>
        <button
          onClick={() => {
            if (parking) {
              setParking(false);
            } else {
              setParking(true);
            }
          }}
          className={`w-full text-left px-3 py-2 border rounded-lg text-sm transition-colors ${
            parking
              ? "bg-primary/10 border-primary text-primary"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          Parking
        </button>
        <button
          onClick={() => {
            if (noHOA) {
              setNoHOA(false);
            } else {
              setNoHOA(true);
            }
          }}
          className={`w-full text-left px-3 py-2 border rounded-lg text-sm transition-colors ${
            noHOA
              ? "bg-primary/10 border-primary text-primary"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          No HOA
        </button>
      </div>
    </div>
  );
}
