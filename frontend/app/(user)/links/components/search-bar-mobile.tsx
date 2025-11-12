"use client";

import { useState, useEffect } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { branchesOptions, categories } from "../../../../lib/schemas/link-form-schema";

interface SearchBarMobileProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;

  selectedSort: string;
  onSortChange: (sort: string) => void;
}

export function SearchBarMobile({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  selectedBranch,
  onBranchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
}: SearchBarMobileProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "most_used", label: "Most used (clicks last 30 days)" },
    { value: "recently_verified", label: "Recently verified" },
    { value: "alphabetical", label: "Alphabetical" },
    { value: "official_first", label: "Official first (.mil/.gov)" },
  ];

  const applyFilters = () => {
    setActiveDropdown(null);
    onClose();
  };

  const resetFilters = () => {
    onBranchChange("");
    onCategoryChange("");
    onSortChange("");
    onSearchChange("");
    setActiveDropdown(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Search & Filter</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search 400+ official DoD websites"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Branch Filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "branch" ? null : "branch"
                  )
                }
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{selectedBranch || "Branch"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "branch" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {["All", ...branchesOptions].map((branch) => (
                    <button
                      key={branch}
                      onClick={() => {
                        onBranchChange(branch === "All" ? "" : branch);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedBranch === branch ||
                        (!selectedBranch && branch === "All")
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "category" ? null : "category"
                  )
                }
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>{selectedCategory || "Category"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "category" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {["All", ...categories].map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category === "All" ? "" : category);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedCategory === category ||
                        (!selectedCategory && category === "All")
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(activeDropdown === "sort" ? null : "sort")
                }
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span>
                  {sortOptions.find((opt) => opt.value === selectedSort)
                    ?.label || "Sort"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "sort" && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg ${
                        selectedSort === option.value
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 border-t space-y-3">
            <div className="flex gap-3">
              <button
                onClick={applyFilters}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-sm"
              >
                Reset Filters
              </button>
            </div>
            <button
              onClick={() => {
                /* Submit link functionality */
              }}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span>
              Submit Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
