'use client'

import useSWR from "swr";
import { ResourceCard } from "../../../../../components/resource-card";
import {
  IResource,
  IResourceListExtended,
} from "../../../../../types/Resource";
import { Loader2 } from "lucide-react";

export function Related({
  resourceData,
  related,
  autoMode,
}: {
  resourceData: IResource;
  related?: IResource["relatedManual"];
  autoMode: boolean;
}) {
  const params = new URLSearchParams({
    page: "1",
    limit: "4",
    search: resourceData.tags.map((item) => item.name).join(" "),
    category: resourceData.categories[0],
  });

  const { data, isLoading } = useSWR<[IResourceListExtended[], number]>(
    autoMode ? `/resources?${params.toString()}` : null
  );

  const filteredAutoData = data?.[0]?.filter(
    (item) => item.id !== resourceData.id
  );

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
          : !filteredAutoData?.length
          ? "No Related Resources"
          : null}
        {!autoMode
          ? related
              ?.slice(0, 3)
              ?.map((relatedDeal) => (
                <ResourceCard key={relatedDeal.id} data={relatedDeal.target} />
              ))
          : !related?.length
          ? "No Related Resources"
          : null}
      </div>
    </div>
  );
}
