"use client";

import type React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { ILink } from "../../../../../../../types/Link";
import Image from "next/image";
import { DeleteDialog } from "./components/delete-dialog";
import useSWR, { mutate as globalMutate } from "swr";
import { cn } from "../../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { useQueryStateWithLocalStorage } from "../../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger } from "nuqs";
import { SafeLink } from "../../../../../../../components/admin/safe-link";
import { Pagination } from "../../../../../../../components/ui/pagination";

export function List() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const [page, setPage] = useQueryStateWithLocalStorage("/admin/links?page", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [limit, setLimit] = useQueryStateWithLocalStorage("/admin/links?limit", {
    defaultValue: 9,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const { data, mutate, isLoading, error } = useSWR<[ILink[], number]>(
    "/admin/links?" + `page=${page}` + "&" + `limit=${limit}`,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true
    }
  );
  const totalPages = Math.ceil((data?.[1] || 0) / limit);

  const handleCardClick = (item: any) => {
    let url = item.url || "#";

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
    setPage(1);
    globalMutate(
      (key) =>
        typeof key === "string" &&
        (key.startsWith("/admin/links?") || key === "/admin/links")
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md pointer-events-none ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search links...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid-container-links">
            {data?.[0].map((item) => (
              <div
                key={item.id}
                className={cn(
                  "card group  relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer",
                  isLoading && "pointer-events-none"
                )}
                onClick={() => {
                  if (!isLoading) {
                    handleCardClick(item);
                  }
                }}
              >
                {/* Image Container with fixed aspect ratio - matching realestate cards */}
                <div className="card-media-container p-2 pb-1">
                  <div className="card-media w-full bg-secondary rounded-md border border-gray-200 overflow-hidden">
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      {item.image ? (
                        <Image
                          className="w-full h-full object-fill"
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
                    {item.category} - {item.status} • {0} views • Updated{" "}
                    {item.updatedAt.split("T")[0]}
                  </p>

                  {/* Tags - limited to one line only */}
                  <div
                    className="flex flex-wrap gap-1 overflow-hidden"
                    style={{ maxHeight: "1.5rem" }}
                  >
                    {item.verified && (
                      <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Verified
                      </span>
                    )}
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Edit Button - top left */}
                <div className="absolute top-2 left-2 flex gap-1 z-20">
                  <SafeLink
                    href={"/admin/links/"+item.id+"/edit"}
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

                {isLoading ? (
                  <div className="absolute z-30 flex items-center justify-center inset-0 bg-black/30">
                    <Loader2 className="animate-spin w-11 h-11 text-white" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
        {error ? (
          <div className="p-6 pt-0">
            <ErrorAlert message="Failed to load data" />
          </div>
        ) : null}
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
