'use client'

import { parseAsString } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { PROPERTY_TYPES } from "../../../../../../../../constants/real-estate-options";

export function HomeType() {
  const [homeType, setHomeType] = useQueryStateWithLocalStorage(
    "/realestate?home_type",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Property Type ({homeType ? homeType.split(",").length : "0"})
      </label>
      <div className="space-y-2">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => {
                const homeTypeArr = homeType ? homeType.split(",") : [];

                if (homeTypeArr.includes(type)) {
                  setHomeType(
                    homeTypeArr.filter((item) => item !== type).join(",")
                  );
                } else {
                  homeTypeArr.push(type);
                  setHomeType(homeTypeArr.join(","));
                }
            }}
            className={`w-full text-left px-3 py-2 border rounded-lg text-sm transition-colors ${
              homeType.includes(type)
                ? "bg-primary/10 border-primary text-primary"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
