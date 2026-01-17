"use client";

import { parseAsString } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { Label } from "../../../../../../../../components/ui/label";
import { PROPERTY_TYPES } from "../../../../../../../../constants/real-estate-options";
import { Checkbox } from "../../../../../../../../components/ui/checkbox";
import { Button } from "../../../../../../../../components/ui/button";

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
    <div className="2xl:p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Property Types</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (homeType.split(",").length === PROPERTY_TYPES.length) {
              setHomeType("");
            } else {
              setHomeType(PROPERTY_TYPES.join(","));
            }
          }}
          className="text-sm"
        >
          {homeType.split(",").length === PROPERTY_TYPES.length ? "Deselect All" : "Select All"}
        </Button>
      </div>

      <div className="space-y-3">
        {PROPERTY_TYPES.map((type, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Checkbox
              id={type}
              checked={homeType.split(",").includes(type)}
              onCheckedChange={(checked) => {
                if (checked === "indeterminate") return;

                const homeTypeArr = homeType ? homeType.split(",") : [];

                if (checked) {
                  homeTypeArr.push(type);
                  setHomeType(homeTypeArr.join(","));
                } else {
                  setHomeType(
                    homeTypeArr.filter((item) => item !== type).join(",")
                  );
                }
              }}
            />
            <Label htmlFor={type} className="text-sm font-medium mb-0">
              {type}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
