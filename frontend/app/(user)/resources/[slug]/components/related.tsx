"use client";

import useSWR from "swr";
import { ResourceCard } from "../../../../../components/resource-card";
import {
  IResource,
  IResourceListExtended,
} from "../../../../../types/Resource";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function Related({
  resourceData,
  related,
  autoMode,
}: {
  resourceData: IResource;
  related?: IResource["relatedManual"];
  autoMode: boolean;
}) {
  const [searchParams, setSearchParams] = useState(() => {
    const params = new URLSearchParams({
      page: "1",
      limit: "4",
      category: resourceData.categories[0],
    });

    if (resourceData.tags.length !== 0) {
      params.append("search", resourceData.tags.map((item) => item.name).join(" "));
    }
    return params.toString();
  });

  const { data, isLoading } = useSWR<[IResourceListExtended[], number]>(
    autoMode ? `/resources?${searchParams}` : null
  );

  const filteredAutoData = useMemo(() => {
    return data?.[0]?.filter((item) => item.id !== resourceData.id);
  }, [data, resourceData]);

  useEffect(() => {
    if (filteredAutoData && filteredAutoData.length === 0) {
      const fallbackParams = new URLSearchParams({
        page: "1",
        limit: "4",
        category: resourceData.categories[0],
      });

      setSearchParams(fallbackParams.toString());
    }
  }, [filteredAutoData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8 py-3.5">
        <h3 className="font-bold text-foreground text-lg mb-6">
          Related Resources
        </h3>
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8 py-3.5">
      <h3 className="font-bold text-foreground text-lg mb-6">
        Related Resources
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {autoMode
          ? filteredAutoData
              ?.slice(0, 3)
              ?.map((relatedDeal) => (
                <ResourceCard key={relatedDeal.id} data={relatedDeal} />
              ))
          : null}
        {!autoMode
          ? related
              ?.slice(0, 3)
              ?.map((relatedDeal) => (
                <ResourceCard key={relatedDeal.id} data={relatedDeal.target} />
              ))
          : null}
        {!filteredAutoData?.length && !related?.length
          ? "No Related Deals"
          : null}
      </div>
    </div>
  );
}
