import Link from "next/link";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { RealestateCard } from "../../../../../components/realestate-card";
import {
  Eye,
  Home,
  Loader2,
} from "lucide-react";
import useSWR from "swr";
import {
  IRealestateOwnerList,
} from "../../../../../types/Realestate";
import { Pagination } from "../../../../../components/ui/pagination";
import { parseAsInteger } from "nuqs";
import { useQueryStateWithLocalStorage } from "../../../../../hooks/use-query-state-with-local-storage";
import { useEffect } from "react";
import { ListingDropMenu } from "./listing-drop-menu";
import { BuySuccessDialog } from "./buy-success-dialog";
import { BuyCancelDialog } from "./buy-cancel-dialog";

export function MyListings() {
  const [page, setPage] = useQueryStateWithLocalStorage("/listings/my?page", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [limit, setLimit] = useQueryStateWithLocalStorage(
    "/listings/my?limit",
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

  const key = `/listings/my?${params.toString()}`;
  const { data: listings, isLoading } = useSWR<{
    items: IRealestateOwnerList[];
    meta: {
      total: number;
      activeCount: number;
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
      <div className="grid grid-cols-2 gap-2 md:gap-6">
        <Card>
          <CardContent className="p-2 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Listings
                </p>
                <p className="text-lg md:text-2xl font-bold text-[#002244]">
                  {listings?.meta.total || 0}
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
                  Active Listings
                </p>
                <p className="text-lg md:text-2xl font-bold text-[#002244]">
                  {listings?.meta.activeCount || 0}
                </p>
              </div>
              <Eye className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
            </div>
          </CardContent>
        </Card>
      </div>
      {listings && listings.items.length !== 0 ? (
        <div className="grid-container-profile">
          {listings.items.map((listing) => {
            return (
              <div key={listing.id} className="relative">
                <RealestateCard data={listing} showStatusBadges />
                <div className="absolute top-2 right-2 flex gap-1 z-30">
                  <ListingDropMenu data={listing} />
                </div>
              </div>
            );
          })}
        </div>
      ) : isLoading ? (
        <div className="w-full max-h-full h-full flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin w-14 h-14" />
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              No Listings Yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start by posting your first real estate listing.
            </p>
            <Link href="/realestate/packages">
              <Button className="bg-[#002244] hover:bg-[#001122]">
                Post Your First Listing
              </Button>
            </Link>
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

      <BuySuccessDialog />
      <BuyCancelDialog />
    </>
  );
}
