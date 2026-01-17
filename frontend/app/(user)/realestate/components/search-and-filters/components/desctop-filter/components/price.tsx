"use client";

import { useState } from "react";
import { parseAsInteger } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../../../../hooks/use-query-state-with-local-storage";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../../../../components/ui/tabs";
import { Label } from "../../../../../../../../components/ui/label";
import { Input } from "../../../../../../../../components/ui/input";

export function Price() {
  const [priceType, setPriceType] = useState<"sale" | "rent">("sale");

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
    if (priceMin && priceMax && (priceMin > priceMax)) {
      setPriceMin(priceMax);
      setPriceMax(priceMin);
    }
  };

  const handlePaymentBlur = () => {
    if (paymentMin && paymentMax && (paymentMin > paymentMax)) {
      setPaymentMin(paymentMax);
      setPaymentMax(paymentMin);
    }
  };

  return (
    <div className="lg:p-4 space-y-4">
      <Tabs
        value={priceType}
        onValueChange={(value) => setPriceType(value as "sale" | "rent")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sale">List Price</TabsTrigger>
          <TabsTrigger value="rent">Monthly Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="sale" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Min Price
              </Label>
              <Input
                type="number"
                placeholder="No Min"
                value={String(priceMin)}
                onChange={(e) => setPriceMin(Number(e.target.value) || null)}
                onBlur={handlePriceBlur}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Max Price
              </Label>
              <Input
                type="number"
                placeholder="No Max"
                value={String(priceMax)}
                onChange={(e) => setPriceMax(Number(e.target.value) || null)}
                onBlur={handlePriceBlur}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="rent" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Min Payment
              </Label>
              <Input
                type="number"
                placeholder="No Min"
                value={String(paymentMin)}
                onChange={(e) => setPaymentMin(Number(e.target.value) || null)}
                onBlur={handlePaymentBlur}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Max Payment
              </Label>
              <Input
                type="number"
                placeholder="No Max"
                value={String(paymentMax)}
                onChange={(e) => setPaymentMax(Number(e.target.value) || null)}
                onBlur={handlePaymentBlur}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
