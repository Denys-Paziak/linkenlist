"use client";

import useSWR from "swr";
import { DealCard } from "../../../../../components/deal-card";
import { IDeal, IDealListExtended } from "../../../../../types/Deal";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function Related({
  dealData,
  related,
  autoMode,
}: {
  dealData: IDeal;
  related?: IDeal["relatedManual"];
  autoMode: boolean;
}) {
  const [searchParams, setSearchParams] = useState(() => {
    const params = new URLSearchParams({
      page: "1",
      limit: "4",
      category: dealData.categories[0],
    });

    if (dealData.tags.length !== 0) {
      params.append("search", dealData.tags.map((item) => item.name).join(" "));
    }
    return params.toString();
  });

  const { data, isLoading } = useSWR<[IDealListExtended[], number]>(
    autoMode ? `/deals?${searchParams}` : null
  );

  const filteredAutoData = useMemo(() => {
    return data?.[0]?.filter((item) => item.id !== dealData.id);
  }, [data, dealData]);

  useEffect(() => {
    if (filteredAutoData && filteredAutoData.length === 0) {
      const fallbackParams = new URLSearchParams({
        page: "1",
        limit: "4",
        category: dealData.categories[0],
      });

      setSearchParams(fallbackParams.toString());
    }
  }, [filteredAutoData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8 py-3.5">
        <h3 className="font-bold text-foreground text-lg mb-6">
          Related Deals
        </h3>
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8 py-3.5">
      <h3 className="font-bold text-foreground text-lg mb-6">Related Deals</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {autoMode
          ? filteredAutoData
              ?.slice(0, 3)
              ?.map((relatedDeal) => (
                <DealCard key={relatedDeal.id} data={relatedDeal} />
              ))
          : null}
        {!autoMode
          ? related
              ?.slice(0, 3)
              ?.map((relatedDeal) => (
                <DealCard key={relatedDeal.id} data={relatedDeal.target} />
              ))
          : null}
        {!filteredAutoData?.length && !related?.length
          ? "No Related Deals"
          : null}
      </div>
    </div>
  );
}
