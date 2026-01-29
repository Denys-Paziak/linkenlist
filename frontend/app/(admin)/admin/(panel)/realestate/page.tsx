"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Home, AlertCircle, Loader2 } from "lucide-react";
import { IRealestateAdminList } from "../../../../../types/Realestate";
import { RealestateCard } from "../../../../../components/realestate-card";
import { useQueryStateWithLocalStorage } from "../../../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger, parseAsString } from "nuqs";
import { BulkActions } from "./components/bulk-actions";
import useSWR from "swr";
import { Pagination } from "../../../../../components/ui/pagination";
import { ErrorAlert } from "../../../../../components/ui/error-alert";
import { DetailsDialog } from "./components/details-dialog";
import { Filters } from "./components/filters";
import { TopBarActions } from "./components/top-bar-actions";

export default function RealEstatePage() {
  const [showDetailsDialog, setShowDetailsDialog] =
    useState<IRealestateAdminList | null>(null);

  const [selectedListings, setSelectedListings] = useState<
    IRealestateAdminList[]
  >([]);
  const selectedListingsIds = useMemo(() => {
    return selectedListings.map((item) => item.id);
  }, [selectedListings]);

  const [page, setPage] = useQueryStateWithLocalStorage(
    "/admin/real-estate?page",
    {
      defaultValue: 1,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    },
  );

  const [limit, setLimit] = useQueryStateWithLocalStorage(
    "/admin/real-estate?limit",
    {
      defaultValue: 40,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    },
  );

  const [activeTab, setActiveTab] = useQueryStateWithLocalStorage(
    "/admin/real-estate?tab",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    },
  );

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (activeTab !== "all") params.set("filter", activeTab);

  const key = `/admin/listings?${params.toString()}`;
  const { data, isLoading, isValidating, error } = useSWR<
    [IRealestateAdminList[], number]
  >(key, { revalidateOnMount: true });
  const totalPages = Math.ceil((data?.[1] || 0) / limit);

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
  }, [limit, activeTab]);

  useEffect(() => {
    if (data) {
      setSelectedListings(
        data[0].filter((item) => selectedListingsIds.includes(item.id)),
      );
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Real Estate Management
          </h1>
          <p className="text-gray-600">
            Review and manage property listings across all military bases
          </p>
        </div>
        <TopBarActions
          listingsIdsForExport={
            selectedListingsIds.length
              ? selectedListingsIds
              : data?.[0].map((item) => item.id) || []
          }
        />
      </div>

      {selectedListings.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {selectedListings.length} listing(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedListings([])}
                >
                  Clear Selection
                </Button>
              </div>
              <BulkActions selectedListings={selectedListings} />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Filters />

        {["all", "draft", "pending", "reported", "expiring", "duplicates"].map(
          (status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {error ? (
                <div className="p-6">
                  <ErrorAlert message="Failed to load data" />
                </div>
              ) : null}
              {data && data[0].length !== 0 ? (
                <div className="overflow-x-auto relative space-y-4">
                  {data[0].length > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Checkbox
                        checked={selectedListings.length === data[0].length}
                        onCheckedChange={(checked) => {
                          if (
                            checked === "indeterminate" ||
                            checked === false
                          ) {
                            setSelectedListings([]);
                          } else {
                            setSelectedListings(data[0]);
                          }
                        }}
                      />
                      <Label className="mb-0">
                        Select All ({data[0].length} listings)
                      </Label>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data[0].map((listing) => (
                      <div key={listing.id} className="relative group">
                        <div className="absolute top-3 left-3 z-20">
                          <Checkbox
                            checked={selectedListingsIds.includes(listing.id)}
                            onCheckedChange={(checked) => {
                              if (
                                checked === "indeterminate" ||
                                checked === false
                              ) {
                                setSelectedListings((state) =>
                                  state.filter(
                                    (item) => item.id !== listing.id,
                                  ),
                                );
                              } else {
                                setSelectedListings((state) => [
                                  listing,
                                  ...state,
                                ]);
                              }
                            }}
                            className="bg-white/95 border-2 shadow-sm"
                          />
                        </div>

                        <RealestateCard
                          data={listing}
                          showStatusBadges
                          showFavoriteButton={false}
                        />

                        <div className="absolute bottom-2 right-2 z-30">
                          <button
                            onClick={() => setShowDetailsDialog(listing)}
                            className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border cursor-pointer hover:bg-white transition-colors"
                          >
                            <AlertCircle className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(isLoading || isValidating) && (
                    <div className="absolute z-30 flex items-center justify-center inset-0 bg-black/10">
                      <Loader2 className="animate-spin w-14 h-14" />
                    </div>
                  )}
                </div>
              ) : isLoading ? (
                <div className="w-full max-h-full h-full flex-grow flex items-center justify-center p-6">
                  <Loader2 className="animate-spin w-14 h-14" />
                </div>
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-8 text-gray-500">
                      <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No listings found for this category</p>
                      <p className="text-sm">
                        Try adjusting your filters or search terms
                      </p>
                    </CardContent>
                  </Card>
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
                pageSizeOptions={[40, 70, 100]}
                className="py-6 px-8"
              />
            </TabsContent>
          ),
        )}
      </Tabs>

      {showDetailsDialog && (
        <DetailsDialog
          isShow={!!showDetailsDialog}
          onClose={() => setShowDetailsDialog(null)}
          selectedListing={showDetailsDialog}
        />
      )}
    </div>
  );
}
