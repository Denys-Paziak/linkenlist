"use client";

import { Filter, Loader2, Star } from "lucide-react";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { FilterBar } from "./filter-bar";
import { Pagination } from "../../../../components/ui/pagination";
import { useQueryStateWithLocalStorage } from "../../../../hooks/use-query-state-with-local-storage";
import { parseAsBoolean, parseAsInteger, parseAsString } from "nuqs";
import { useDebounce } from "use-debounce";
import useSWR, { useSWRConfig } from "swr";
import { useEffect, useState } from "react";
import { ErrorAlert } from "../../../../components/ui/error-alert";
import { IResourceListExtended } from "../../../../types/Resource";
import { ResourceCard } from "../../../../components/resource-card";

export function List() {
  const [searchQuery, setSearchQuery] = useQueryStateWithLocalStorage(
    "/resources?search",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );
  const [debouncedSearch] = useDebounce(searchQuery, 700, {
    leading: true,
  });

  const [selectedSort, setSelectedSort] = useQueryStateWithLocalStorage(
    "/resources?sort",
    {
      defaultValue: "default",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [selectedCategory, setSelectedCategory] = useQueryStateWithLocalStorage(
    "/resources?category",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [selectedFormat, setSelectedFormat] = useQueryStateWithLocalStorage(
    "/resources?format",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [showFavoritesOnly, setShowFavoritesOnly] =
    useQueryStateWithLocalStorage("/resources?favorites", {
      defaultValue: false,
      parse: (v) => parseAsBoolean.parse(v),
      sync: true,
    });

  const [page, setPage] = useQueryStateWithLocalStorage("/resources?page", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [limit, setLimit] = useQueryStateWithLocalStorage("/resources?limit", {
    defaultValue: 16,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (debouncedSearch.length >= 2) params.set("search", debouncedSearch);
  if (selectedCategory !== "all") params.set("category", selectedCategory);
  if (selectedFormat !== "all") params.set("format", selectedFormat);
  if (selectedSort !== "default") params.set("sort", selectedSort);
  if (showFavoritesOnly) params.set("isFavorite", String(showFavoritesOnly));

  const key = `/resources?${params.toString()}`;
  const { data, isLoading, error, isValidating } = useSWR<[IResourceListExtended[], number]>(key);
  const totalPages = Math.ceil((data?.[1] || 0) / limit);

  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (showFavoritesOnly) {
      if (showFavoritesOnly) params.set("isFavorite", String(showFavoritesOnly))

      const keyFavorite = `/resources?${params.toString()}`;
      mutate(keyFavorite)
    }
  }, [showFavoritesOnly])

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  const handleChangeSearch = (search: string) => {
    setSearchQuery(search);
  };

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [limit, searchQuery, selectedCategory, selectedFormat, showFavoritesOnly]);

  return (
    <>
      <main className="flex-grow bg-gray-50 py-6 flex flex-col justify-between">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-4 lg:hidden flex justify-center gap-3">
            <button
              onClick={() => {
                const newValue = !showFavoritesOnly;
                setShowFavoritesOnly(newValue);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${showFavoritesOnly
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <Star
                className={`w-4 h-4 ${showFavoritesOnly
                  ? "fill-blue-600 text-blue-600"
                  : "text-gray-400"
                  }`}
              />
              Saved
            </button>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Filter Sidebar - Smaller width on desktop */}
            <div className="hidden lg:block w-full lg:w-64 lg:min-w-64 mb-6 lg:mb-0">
              <FilterBar
                searchTerm={searchQuery}
                onSearchChange={handleChangeSearch}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                showSavedOnly={showFavoritesOnly}
                onSavedToggle={setShowFavoritesOnly}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
              />
            </div>

            {/* Resources Content - Flexible width */}
            <div className="flex-1 min-w-0">
              {error ? (
                <div className="py-6 pt-0">
                  <ErrorAlert message="Failed to load data" />
                </div>
              ) : null}

              {showFavoritesOnly && (
                <div className="mb-6 px-2">
                  <div className="bg-secondary border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-accent fill-accent" />
                      <span className="font-bold text-foreground">
                        Showing your favorite resources
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowFavoritesOnly(false);
                      }}
                      className="text-primary hover:text-primary/70 font-medium text-sm"
                    >
                      Show All
                    </button>
                  </div>
                </div>
              )}

              {(debouncedSearch.length >= 2 ||
                selectedCategory ||
                showFavoritesOnly) && (
                  <div className="mb-4 px-2">
                    <p className="text-sm text-muted-foreground">
                      {data?.[1]} result
                      {data?.[1] !== 1 ? "s" : ""} found
                      {selectedCategory && ` in ${selectedCategory}`}
                      {searchQuery && ` matching "${searchQuery}"`}
                      {showFavoritesOnly && ` in your favorites`}
                    </p>
                  </div>
                )}
              {data && data[0].length !== 0 ? (
                <div className="grid-container-resources">
                  {data[0].map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      data={resource}
                      isLoading={isLoading || isValidating}
                    />
                  ))}
                </div>
              ) : (isLoading) ? (
                <div className="w-full max-h-full h-full flex-grow flex items-center justify-center">
                  <Loader2 className="animate-spin w-14 h-14" />
                </div>
              ) : null}

              {data?.[0].length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-base">
                    {showFavoritesOnly
                      ? "No favorite resources found"
                      : "No resources found"}
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {showFavoritesOnly
                      ? "Start adding resources to your favorites by clicking the star icon on any card."
                      : "Try adjusting your search terms or filters."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

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
      </main>

      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        searchTerm={searchQuery}
        onSearchChange={handleChangeSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />
    </>
  );
}
