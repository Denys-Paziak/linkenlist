"use client";

import { parseAsBoolean, parseAsInteger, parseAsString } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../hooks/use-query-state-with-local-storage";
import { useSearchContext } from "../../search-context";
import { Button } from "../../../../../../components/ui/button";
import { useEffect } from "react";

export function Actions() {
  const { setQuery } = useSearchContext();

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
    applyFilters();
  }, []);

  return (
    <div className="flex gap-2 p-4">
      <Button
        onClick={applyFilters}
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
