"use client";

import { parseAsBoolean, parseAsInteger, parseAsString } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../hooks/use-query-state-with-local-storage";
import { useSearchContext } from "../../search-context";
import { Button } from "../../../../../../components/ui/button";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function Actions({
  onClose
}: {
  onClose: () => void;
}) {
  const { setQuery } = useSearchContext();
  const searchParams = useSearchParams()

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

  const [selectedType, setSelectedType] = useQueryStateWithLocalStorage(
    "/realestate?type",
    {
      defaultValue: "sale",
      parse: (v) => parseAsString.parse(v),
      sync: true,
      clearOnDefault: false,
    }
  );

  const [homeType, setHomeType] = useQueryStateWithLocalStorage(
    "/realestate?home_type",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

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

  const [priceMin, setPriceMin] = useQueryStateWithLocalStorage(
    "/realestate?price_min",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );
  const [priceMax, setPriceMax] = useQueryStateWithLocalStorage(
    "/realestate?price_max",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );
  const [paymentMin, setPaymentMin] = useQueryStateWithLocalStorage(
    "/realestate?payment_min",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );
  const [paymentMax, setPaymentMax] = useQueryStateWithLocalStorage(
    "/realestate?payment_max",
    {
      defaultValue: null,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  const [sort, setSort] = useQueryStateWithLocalStorage("/realestate?sort", {
    defaultValue: "recommended",
    parse: (v) => parseAsString.parse(v),
    sync: true,
  });

  const applyFilters = () => {
    const params = new URLSearchParams({
      dealType: selectedType,
    });

    if (selectedType === "sale") {
      if (priceMin) {
        params.set("minPrice", String(priceMin));
      }
      if (priceMax) {
        params.set("maxPrice", String(priceMax));
      }
    }
    if (selectedType === "rent") {
      if (paymentMin) {
        params.set("minPrice", String(paymentMin));
      }
      if (paymentMax) {
        params.set("maxPrice", String(paymentMax));
      }
    }

    if (bedrooms) {
      params.set("beds", String(bedrooms));
      if (bedsExact) {
        params.set("bedsExact", String(bedsExact));
      }
    }
    if (bathrooms) {
      params.set("baths", String(bathrooms));
      if (bathsExact) {
        params.set("bathsExact", String(bathsExact));
      }
    }

    if (homeType) {
      params.set("propertyTypes", homeType);
    }

    if (keywords) {
      params.set("keywords", keywords);
    }

    if (sqftMin) {
      params.set("minSqft", String(sqftMin));
    }
    if (sqftMax) {
      params.set("maxSqft", String(sqftMax));
    }

    if (yearBuiltMin) {
      params.set("minYearBuilt", String(yearBuiltMin));
    }
    if (yearBuiltMax) {
      params.set("maxYearBuilt", String(yearBuiltMax));
    }

    if (petFriendly) {
      params.set("petFriendly", String(petFriendly));
    }
    if (parking) {
      params.set("parking", String(parking));
    }
    if (noHOA) {
      params.set("noHOA", String(noHOA));
    }

    if (sort) {
      params.set("sortBy", sort);
    }

    setQuery(params.toString());
  };

  const clearAllFilters = () => {
    setBedrooms(null);
    setBedsExact(false);
    setBathrooms(null);
    setBathsExact(false);
    setSelectedType("sale");
    setHomeType("");
    setKeywords("");
    setSqftMin(null);
    setSqftMax(null);
    setYearBuiltMin(null);
    setYearBuiltMax(null);
    setPetFriendly(false);
    setParking(false);
    setNoHOA(false);
    setPriceMin(null);
    setPriceMax(null);
    setPaymentMin(null);
    setPaymentMax(null);
    setSort("recommended");
    applyFilters();
  };

  useEffect(() => {
    if (!searchParams.size) {
      const selectedType = (window.localStorage.getItem("/realestate?type") || "").slice(1, -1)
      const priceMin = (window.localStorage.getItem("/realestate?price_min") || "")
      const priceMax = (window.localStorage.getItem("/realestate?price_max") || "")
      const paymentMin = (window.localStorage.getItem("/realestate?payment_min") || "")
      const paymentMax = (window.localStorage.getItem("/realestate?payment_max") || "")
      const bedrooms = (window.localStorage.getItem("/realestate?bedrooms") || "")
      const bedsExact = (window.localStorage.getItem("/realestate?beds_ex") || "")
      const bathrooms = (window.localStorage.getItem("/realestate?bathrooms") || "")
      const bathsExact = (window.localStorage.getItem("/realestate?baths_ex") || "")
      const homeType = (window.localStorage.getItem("/realestate?home_type") || "").slice(1, -1)
      const keywords = (window.localStorage.getItem("/realestate?keywords") || "").slice(1, -1)
      const sqftMin = (window.localStorage.getItem("/realestate?sqft_min") || "")
      const sqftMax = (window.localStorage.getItem("/realestate?sqft_max") || "")
      const yearBuiltMin = (window.localStorage.getItem("/realestate?year_min") || "")
      const yearBuiltMax = (window.localStorage.getItem("/realestate?year_max") || "")
      const petFriendly = (window.localStorage.getItem("/realestate?pet_friendly") || "")
      const parking = (window.localStorage.getItem("/realestate?parking") || "")
      const noHOA = (window.localStorage.getItem("/realestate?no_HOA") || "")
      const sort = (window.localStorage.getItem("/realestate?sort") || "").slice(1, -1)

      const params = new URLSearchParams({
        dealType: selectedType,
      });
      if (selectedType === "sale") {
        if (priceMin !== "null") {
          params.set("minPrice", priceMin);
        }
        if (priceMax !== "null") {
          params.set("maxPrice", priceMax);
        }
      }
      if (selectedType === "rent") {
        if (paymentMin !== "null") {
          params.set("minPrice", paymentMin);
        }
        if (paymentMax !== "null") {
          params.set("maxPrice", paymentMax);
        }
      }

      if (bedrooms !== "null") {
        params.set("beds", bedrooms);
        if (bedsExact !== "false") {
          params.set("bedsExact", bedsExact);
        }
      }
      if (bathrooms !== "null") {
        params.set("baths", bathrooms);
        if (bathsExact !== "false") {
          params.set("bathsExact", bathsExact);
        }
      }

      if (homeType) {
        params.set("propertyTypes", homeType);
      }

      if (keywords) {
        params.set("keywords", keywords);
      }

      if (sqftMin !== "null") {
        params.set("minSqft", sqftMin);
      }
      if (sqftMax !== "null") {
        params.set("maxSqft", sqftMax);
      }

      if (yearBuiltMin !== "null") {
        params.set("minYearBuilt", yearBuiltMin);
      }
      if (yearBuiltMax !== "null") {
        params.set("maxYearBuilt", yearBuiltMax);
      }

      if (petFriendly !== "false") {
        params.set("petFriendly", petFriendly);
      }
      if (parking !== "false") {
        params.set("parking", parking);
      }
      if (noHOA !== "false") {
        params.set("noHOA", noHOA);
      }

      if (sort) {
        params.set("sortBy", sort);
      }
      console.log(params.toString())
      setQuery(params.toString());
    } else {
      applyFilters();
    }
  }, []);

  return (
    <div className="flex gap-2 p-4">
      <Button
        onClick={() => {
          applyFilters()
          onClose()
        }}
        className="flex-1 bg-slate-700 hover:bg-slate-800 text-white"
      >
        Apply Filters
      </Button>
      <Button
        onClick={clearAllFilters}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
      >
        Reset Filters
      </Button>
    </div>
  );
}
