"use client";

import { Bookmark, Home, Link, Loader2 } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { RealestateCard } from "../../../../../components/realestate-card";
import { parseAsInteger } from "nuqs";
import { useEffect } from "react";
import useSWR from "swr";
import { useQueryStateWithLocalStorage } from "../../../../../hooks/use-query-state-with-local-storage";
import { IRealestateOwnerList } from "../../../../../types/Realestate";
import { Pagination } from "../../../../../components/ui/pagination";

export function SavedListings() {
  const [page, setPage] = useQueryStateWithLocalStorage(
    "/listings/saved?page",
    {
      defaultValue: 1,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    },
  );

  const [limit, setLimit] = useQueryStateWithLocalStorage(
    "/listings/saved?limit",
    {
      defaultValue: 16,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    },
  );

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const key = `/favorite/listings/objects?${params.toString()}`;
  const { data: listings, isLoading } = useSWR<{
    items: IRealestateOwnerList[];
    meta: {
      total: number;
      forSaleCount: number;
      forRentCount: number;
    };
  }>(key, {
    revalidateIfStale: true,
  });
  const totalPages = Math.ceil((listings?.meta.total || 0) / limit);

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
  }, [limit]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
        <Card>
          <CardContent className="p-2 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Saved
                </p>
                <p className="text-lg md:text-2xl font-bold text-[#002244]">
                  {listings?.meta.total || 0}
                </p>
              </div>
              <Bookmark className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  For Sale
                </p>
                <p className="text-lg md:text-2xl font-bold text-[#002244]">
                  {listings?.meta.forSaleCount || 0}
                </p>
              </div>
              <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  For Rent
                </p>
                <p className="text-lg md:text-2xl font-bold text-[#002244]">
                  {listings?.meta.forRentCount || 0}
                </p>
              </div>
              <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {listings && listings.items.length !== 0 ? (
        <div className="grid-container-profile">
          {listings.items.map((listing) => (
            <RealestateCard key={listing.id} data={listing} showPremiumFeatures />
          ))}
        </div>
      ) : isLoading ? (
        <div className="w-full max-h-full h-full flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin w-14 h-14" />
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              No Saved Listings
            </h2>
            <p className="text-gray-600 mb-8">
              Browse properties and bookmark the ones you're interested in to
              see them here.
            </p>
          </CardContent>
        </Card>
      )}
      <Pagination
        handlePageChange={handlePageChange}
        handleLimitPageChange={handleLimitPageChange}
        pagination={{
          limit,
          page,
        }}
        totalPages={totalPages}
        pageSizeOptions={[8, 16, 32, 64]}
        className="pt-6 px-8"
      />
    </>
  );
}
