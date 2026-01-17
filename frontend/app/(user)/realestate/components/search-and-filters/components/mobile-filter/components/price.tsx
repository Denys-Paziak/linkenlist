'use client'

import { parseAsInteger } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";

export function Price() {
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

  const handlePriceBlur = () => {
    if (priceMin && priceMax && priceMin > priceMax) {
      setPriceMin(priceMax);
      setPriceMax(priceMin);
      setPaymentMin(priceMax)
      setPaymentMax(priceMin)
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Price Range
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min Price"
          value={String(priceMin)}
          onChange={(e) => {
            setPriceMin(Number(e.target.value) || null);
            setPaymentMin(Number(e.target.value) || null);
          }}
          onBlur={handlePriceBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={String(priceMax)}
          onChange={(e) => {
            setPriceMax(Number(e.target.value) || null);
            setPaymentMax(Number(e.target.value) || null);
          }}
          onBlur={handlePriceBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
      </div>
    </div>
  );
}
