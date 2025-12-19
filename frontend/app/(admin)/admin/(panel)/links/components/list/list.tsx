"use client";

import type React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { ILinkList } from "../../../../../../../types/Link";
import Image from "next/image";
import { DeleteDialog } from "./components/delete-dialog";
import useSWR from "swr";
import { cn } from "../../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { useQueryStateWithLocalStorage } from "../../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger, parseAsString } from "nuqs";
import { Pagination } from "../../../../../../../components/ui/pagination";
import { StatusChip } from "../../../../../../../components/ui/status-chip";
import { useDebounce } from "use-debounce";
import { SafeLink } from "../../../../components/safe-link";

export function List() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useQueryStateWithLocalStorage(
    "/admin/links?search",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );
  const [debouncedSearch] = useDebounce(searchQuery, 700, {
    leading: true,
  });

  const [page, setPage] = useQueryStateWithLocalStorage("/admin/links?page", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [limit, setLimit] = useQueryStateWithLocalStorage(
    "/admin/links?limit",
    {
      defaultValue: 9,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (debouncedSearch.length >= 2) params.set("search", debouncedSearch);

  const key = `/admin/links?${params.toString()}`;
  const { data, mutate, isValidating, error } = useSWR<[ILinkList[], number]>(
    key,
    {
      revalidateIfStale: true,
    }
  );
  const totalPages = Math.ceil((data?.[1] || 0) / limit);

  const handleCardClick = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleLimitPageChange = (limit: number) => {
    setLimit(limit);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handleChangeSearch = (search: string) => {
    setSearchQuery(search);
    if (page !== 1) {
      setPage(1);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex w-fit rounded-md border border-input bg-background px-3 pr-2 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring"
            />
          </div>
        </CardHeader>
        {error ? (
          <div className="p-6 pt-0">
            <ErrorAlert message="Failed to load data" />
          </div>
        ) : null}
        <CardContent>
          {data && data[0].length !== 0 ? (
            <div className="grid-container-links">
              {data[0].map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "card group  relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer",
                    isValidating && "pointer-events-none"
                  )}
                  onClick={() => {
                    if (!isValidating) {
                      handleCardClick(item.url);
                    }
                  }}
                >
                  {/* Image Container with fixed aspect ratio - matching realestate cards */}
                  <div className="card-media-container p-2 pb-1">
                    <div className="card-media w-full bg-secondary rounded-md border border-gray-200 overflow-hidden">
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        {item.image ? (
                          <Image
                            className="w-full h-full object-cover"
                            src={item.image.url}
                            alt={item.title}
                            width={item.image.width}
                            height={item.image.height}
                          />
                        ) : (
                          <span className="text-sm font-medium uppercase">
                            link
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Container - matching realestate card structure */}
                  <div className="px-2 pb-2">
                    {/* Title - matching realestate card styling */}
                    <h3 className="card-price mb-1 font-bold text-[#002244] text-left text-sm leading-tight line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Description - NOW limited to 2 rows */}
                    <p
                      className="text-xs text-gray-500 font-medium text-left mb-2 leading-relaxed"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.4",
                        maxHeight: "2.8em", // 2 lines * 1.4 line-height
                      }}
                    >
                      {item.status} • {0} views • Updated{" "}
                      {item.updatedAt.split("T")[0]}
                    </p>

                    {/* Tags - limited to one line only */}
                    <div
                      className="flex flex-wrap gap-1 overflow-hidden"
                      style={{ maxHeight: "1.5rem" }}
                    >
                      {item.verified && (
                        <StatusChip text="Verified" status="published" />
                      )}
                      <StatusChip text={item.category} status="draft" />
                    </div>
                  </div>

                  {/* Edit Button - top left */}
                  <div className="absolute top-2 left-2 flex gap-1 z-20">
                    <SafeLink
                      href={"/admin/links/" + item.id + "/edit"}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="w-6 h-6 p-0 bg-white/90 hover:bg-gray-100 rounded-sm flex items-center justify-center group/tooltip relative"
                      aria-label="Edit item"
                    >
                      <Edit className="w-3.5 h-3.5 text-gray-500" />
                      <div className="absolute top-full left-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                        Edit
                      </div>
                    </SafeLink>
                  </div>

                  {/* Delete Button - top right */}
                  <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(item);
                      }}
                      className="w-6 h-6 p-0 bg-white/90 hover:bg-red-100 rounded-sm flex items-center justify-center group/tooltip relative"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                        Delete
                      </div>
                    </button>
                  </div>

                  {isValidating ? (
                    <div className="absolute z-30 flex items-center justify-center inset-0 bg-black/10">
                      <Loader2 className="animate-spin w-11 h-11 text-white" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : isValidating ? (
            <div className="w-full max-h-full py-5 h-full flex-grow flex items-center justify-center">
              <Loader2 className="animate-spin w-14 h-14" />
            </div>
          ) : null}
        </CardContent>
        <Pagination
          handlePageChange={handlePageChange}
          handleLimitPageChange={handleLimitPageChange}
          pagination={{
            limit,
            page,
          }}
          totalPages={totalPages}
          className="pb-8 px-6"
        />
      </Card>
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        itemToDelete={itemToDelete}
        showDeleteDialog={showDeleteDialog}
        handleCancelDelete={() => setShowDeleteDialog(false)}
        handleSuccessDelete={() => {
          mutate();
          setTimeout(() => {
            setShowDeleteDialog(false);
            setItemToDelete(null);
          }, 2000);
        }}
      />
    </>
  );
}
