"use client";

import { parseAsInteger, parseAsBoolean } from "nuqs";
import { Button } from "../../../../../../../../components/ui/button";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { Label } from "../../../../../../../../components/ui/label";
import { Checkbox } from "../../../../../../../../components/ui/checkbox";
import { bathroomsOptions, bedroomsOptions } from "../../../options";



export function BedsBaths() {
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

  return (
    <div className="xl:p-4 space-y-4">
      <div>
        <Label className="text-sm font-medium mb-3 block">Beds & Baths</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {bedroomsOptions.map((option, i) => (
            <Button
              key={i}
              variant={bedrooms === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setBedrooms(option.value)}
              className="px-3 py-1 text-sm"
            >
              {option.label}
            </Button>
          ))}
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

      <div>
        <Label className="text-sm font-medium mb-3 block">Bathrooms</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {bathroomsOptions.map((option, i) => (
            <Button
              key={i}
              variant={bathrooms === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setBathrooms(option.value)}
              className="px-3 py-1 text-sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bathrooms-exact"
            checked={bathsExact}
            onCheckedChange={(checked) =>
              setBathsExact(checked === "indeterminate" ? false : checked)
            }
          />
          <Label htmlFor="bathrooms-exact" className="text-sm mb-0 cursor-pointer">
            Use exact match
          </Label>
        </div>
      </div>
    </div>
  );
}
