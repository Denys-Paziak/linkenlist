"use client";

import { useState } from "react";
import { ResourceCard } from "@/components/resource-card";
import { ProposalLinkModal } from "@/components/proposal-link-modal";
import { ScrollButtons } from "@/components/scroll-buttons";
import { useUser } from "@/contexts/user-context";
import { Star, Filter, Loader2 } from "lucide-react";
import { useQueryStateWithLocalStorage } from "../../../hooks/use-query-state-with-local-storage";
import { parseAsString, parseAsBoolean, parseAsInteger } from "nuqs";
import { SearchBarMobile } from "./components/search-bar-mobile";
import { SearchBar } from "./components/search-bar";
import useSWR from "swr";
import { ILink } from "../../../types/Link";
import { Pagination } from "../../../components/ui/pagination";
import { ErrorAlert } from "../../../components/ui/error-alert";
import { fetcher } from "../../../lib/fetcher";
import { Card } from "./components/card";

export default function LinksPage() {
  const [searchQuery, setSearchQuery] = useState("");
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

  if (selectedBranch) params.set("branch", selectedBranch);
  if (selectedCategory) params.set("category", selectedCategory);
  if (selectedSort) params.set("sort", selectedSort);

  const key = `/links?${params.toString()}`;
  const { data, mutate, isLoading, error } = useSWR<[ILink[], number]>(key, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
  });
  const totalPages = Math.ceil((data?.[1] || 0) / limit);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleLimitPageChange = (limit: number) => {
    setLimit(limit);
    setPage(1);
    mutate();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b-2 border-primary py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find direct links to your military websites. Faster.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            LinkEnlist is independently operated and is not affiliated with the
            DoD.
          </p>
        </div>
      </div>

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
                onChange={setSearchQuery}
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                placeholder="Search 400+ official DoD websites"
                showFavoritesOnly={showFavoritesOnly}
                onFavoritesToggle={setShowFavoritesOnly}
              />
            </div>
          </div>

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

          {(searchQuery ||
            selectedBranch ||
            selectedCategory ||
            selectedSort ||
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
          {data ? (
            <div className="grid-container-links">
              {data[0].map((resource) => (
                <Card
                  key={resource.id}
                  data={resource}
                  isLoading={isLoading}
                />
              ))}
            </div>
          ) : (
            <div className="w-full max-h-full h-full flex-grow flex items-center justify-center">
              <Loader2 className="animate-spin w-14 h-14" />
            </div>
          )}

          {data?.[1] === 0 && (
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
          pageSizeOptions={[8, 16, 32, 64]}
          className="pt-6 px-8"
        />
      </main>

      <ScrollButtons />

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
    </div>
  );
}
