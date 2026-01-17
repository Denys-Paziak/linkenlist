"use client";

import { parseAsString, parseAsInteger, parseAsBoolean } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import { Checkbox } from "../../../../../../../../components/ui/checkbox";
import { Label } from "../../../../../../../../components/ui/label";
import { Input } from "../../../../../../../../components/ui/input";

export function More() {
  const [keywords, setKeywords] = useQueryStateWithLocalStorage(
    "/realestate?keywords",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );
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

  const handleSqftBlur = () => {
    if (sqftMin && sqftMax && (sqftMin > sqftMax)) {
      setSqftMin(sqftMax);
      setSqftMax(sqftMin);
    }
  };

  const handleYearBlur = () => {
    if (yearBuiltMin && yearBuiltMax && (yearBuiltMin > yearBuiltMax)) {
      setYearBuiltMin(yearBuiltMax);
      setYearBuiltMax(yearBuiltMin);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium mb-2 block">Keywords</Label>
        <Input
          placeholder="Search keywords..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          maxLength={200}
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Square Footage</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min sqft"
            type="number"
            value={String(sqftMin)}
            onChange={(e) => setSqftMin(Number(e.target.value))}
            onBlur={handleSqftBlur}
          />
          <Input
            placeholder="Max sqft"
            type="number"
            value={String(sqftMax)}
            onChange={(e) => setSqftMax(Number(e.target.value))}
            onBlur={handleSqftBlur}
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Year Built</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min year"
            type="number"
            value={String(yearBuiltMin)}
            onChange={(e) => setYearBuiltMin(Number(e.target.value))}
            onBlur={handleYearBlur}
          />
          <Input
            placeholder="Max year"
            type="number"
            value={String(yearBuiltMax)}
            onChange={(e) => setYearBuiltMax(Number(e.target.value))}
            onBlur={handleYearBlur}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="pet-friendly"
            checked={petFriendly}
            onCheckedChange={(checked) =>
              setPetFriendly(checked === "indeterminate" ? false : checked)
            }
          />
          <Label htmlFor="pet-friendly" className="text-sm font-medium mb-0">
            Pet Friendly
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="parking"
            checked={parking}
            onCheckedChange={(checked) =>
              setParking(checked === "indeterminate" ? false : checked)
            }
          />
          <Label htmlFor="parking" className="text-sm font-medium mb-0">
            Parking
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="no-hoa"
            checked={noHOA}
            onCheckedChange={(checked) =>
              setNoHOA(checked === "indeterminate" ? false : checked)
            }
          />
          <Label htmlFor="no-hoa" className="text-sm font-medium mb-0">
            No HOA
          </Label>
        </div>
      </div>
    </div>
  );
}
