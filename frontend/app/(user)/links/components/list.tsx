"use client";

import { useState } from "react";
import { ProposalLinkModal } from "@/components/proposal-link-modal";
import { ScrollButtons } from "@/components/scroll-buttons";
import { Star, Filter, Loader2 } from "lucide-react";
import { parseAsString, parseAsBoolean, parseAsInteger } from "nuqs";

import { useDebounce } from "use-debounce";
import { useQueryStateWithLocalStorage } from "../../../../hooks/use-query-state-with-local-storage";
import { SearchBar } from "./search-bar";
import { ErrorAlert } from "../../../../components/ui/error-alert";
import { Card } from "./card";
import { Pagination } from "../../../../components/ui/pagination";
import { SearchBarMobile } from "./search-bar-mobile";
import useSWR from "swr";
import { ILink } from "../../../../types/Link";

export function List() {
  const [searchQuery, setSearchQuery] = useQueryStateWithLocalStorage(
    "/links?search",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );
  const [debouncedSearch] = useDebounce(searchQuery, 700, {
    leading: true,
  });

  const [selectedBranch, setSelectedBranch] = useQueryStateWithLocalStorage(
    "/links?branch",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [selectedCategory, setSelectedCategory] = useQueryStateWithLocalStorage(
    "/links?category",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [selectedSort, setSelectedSort] = useQueryStateWithLocalStorage(
    "/links?sort",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [showFavoritesOnly, setShowFavoritesOnly] =
    useQueryStateWithLocalStorage("/links?favorites", {
      defaultValue: false,
      parse: (v) => parseAsBoolean.parse(v),
      sync: true,
    });

  const [page, setPage] = useQueryStateWithLocalStorage("/links?page", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [limit, setLimit] = useQueryStateWithLocalStorage("/links?limit", {
    defaultValue: 16,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (debouncedSearch.length >= 2) params.set("search", debouncedSearch);
  if (selectedBranch) params.set("branch", selectedBranch);
  if (selectedCategory) params.set("category", selectedCategory);
  if (selectedSort) params.set("sort", selectedSort);

  const key = `/links?${params.toString()}`;
  const { data, isLoading, error } = useSWR<[ILink[], number]>(key);
  const totalPages = Math.ceil((data?.[1] || 0) / limit);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      <main className="flex-grow bg-gray-50 py-6 flex flex-col justify-between">
        <div className="w-full h-full flex flex-col flex-grow px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1120px] w-full max-h-fit flex-grow mx-auto mb-6">
            <div className="lg:hidden mb-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  const newValue = !showFavoritesOnly;
                  setShowFavoritesOnly(newValue);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                  showFavoritesOnly
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                <Star
                  className={`h-4 w-4 ${
                    showFavoritesOnly ? "fill-current" : ""
                  }`}
                />
                Saved
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 text-sm font-medium min-h-[44px] touch-manipulation"
                style={{ touchAction: "manipulation" }}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="hidden lg:block">
              <SearchBar
                value={searchQuery}
                onChange={handleChangeSearch}
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                showFavoritesOnly={showFavoritesOnly}
                onFavoritesToggle={setShowFavoritesOnly}
              />
            </div>
          </div>

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
            selectedBranch ||
            selectedCategory ||
            showFavoritesOnly) && (
            <div className="mb-4 px-2">
              <p className="text-sm text-muted-foreground">
                {data?.[1]} result
                {data?.[1] !== 1 ? "s" : ""} found
                {selectedBranch && ` for ${selectedBranch}`}
                {selectedCategory && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
                {showFavoritesOnly && ` in your favorites`}
              </p>
            </div>
          )}
          {data && data[0].length !== 0 ? (
            <div className="grid-container-links">
              {data[0].map((link) => (
                <Card key={link.id} data={link} isLoading={isLoading} />
              ))}
            </div>
          ) : isLoading ? (
            <div className="w-full max-h-full h-full flex-grow flex items-center justify-center">
              <Loader2 className="animate-spin w-14 h-14" />
            </div>
          ) : null}

          {data?.[0].length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-base">
                {showFavoritesOnly
                  ? "No favorite links found"
                  : "No links found"}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                {showFavoritesOnly
                  ? "Start adding links to your favorites by clicking the star icon on any card."
                  : "Try adjusting your search terms or filters."}
              </p>
            </div>
          )}
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

      <ProposalLinkModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      />
      <SearchBarMobile
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />
    </>
  );
}
