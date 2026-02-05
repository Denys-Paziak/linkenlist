"use client";

import useSWR from "swr";
import { RealestateCard } from "../../../../components/realestate-card";
import { useSearchContext } from "./search-context";
import { useQueryStateWithLocalStorage } from "../../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger } from "nuqs";
import { Pagination } from "../../../../components/ui/pagination";
import { useEffect } from "react";
import { IRealestateOwnerList } from "../../../../types/Realestate";
import { Loader2 } from "lucide-react";
import { ErrorAlert } from "../../../../components/ui/error-alert";
import { useSearchParams } from "next/navigation";

export function RealestateList({
  viewMode,
  listClasses,
}: {
  viewMode: "map" | "grid";
  listClasses: string;
}) {
  const { query } = useSearchContext();
  const searchParams = useSearchParams();

  const [page, setPage] = useQueryStateWithLocalStorage("/realestate?page", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [limit, setLimit] = useQueryStateWithLocalStorage("/realestate?limit", {
    defaultValue: 16,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const neLat = searchParams.get("neLat");
  const neLng = searchParams.get("neLng");
  const swLat = searchParams.get("swLat");
  const swLng = searchParams.get("swLng");
  const params = new URLSearchParams(query);
  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("neLat", String(neLat));
  params.set("neLng", String(neLng));
  params.set("swLat", String(swLat));
  params.set("swLng", String(swLng));
  const key = !neLat || !neLng || !swLat || !swLng ? null : `/listings?${params.toString()}`;
  const {
    data: realestate,
    isLoading,
    isValidating,
    error,
  } = useSWR<[IRealestateOwnerList[], number]>(key);
  const totalPages = Math.ceil((realestate?.[1] || 0) / limit);

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLimitPageChange = (limit: number) => {
    setLimit(limit);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [limit, query, neLat, neLng, swLat, swLng]);

  return (
    <>
      {error ? (
        <div className="m-3">
          <ErrorAlert message="Failed to load data" />
        </div>
      ) : null}

      {realestate && realestate[0].length !== 0 ? (
        <div className="relative h-full">
          <div className={listClasses}>
            {realestate?.[0].map((listing) => (
              <RealestateCard
                key={listing.id}
                data={listing}
                showPremiumFeatures
              />
            ))}
          </div>
          {(isLoading || isValidating) && (
            <div className="absolute z-10 flex items-center justify-center inset-0 bg-black/10">
              <Loader2 className="animate-spin w-14 h-14" />
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin w-14 h-14" />
        </div>
      ) : null}

      {realestate?.[0].length === 0 && !isLoading && (
        <div className="text-center py-8 m-3">
          <p className="text-muted-foreground text-base">
            No Reale State found
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}

      <Pagination
        handlePageChange={handlePageChange}
        handleLimitPageChange={handleLimitPageChange}
        pagination={{
          limit,
          page,
        }}
        totalPages={totalPages}
        center={viewMode === "grid"}
        pageSizeOptions={[8, 16, 32, 64]}
        className="py-6 px-8"
      />
    </>
  );
}
