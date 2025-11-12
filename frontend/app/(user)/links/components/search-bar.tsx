"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Star } from "lucide-react";
import { branchesOptions, categories } from "../../../../lib/schemas/link-form-schema";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: (show: boolean) => void;
}

export function SearchBar({
  value,
  onChange,
  selectedBranch = "",
  onBranchChange,
  selectedCategory = "",
  onCategoryChange,
  selectedSort = "",
  onSortChange,
  placeholder = "Search resources...",
  onKeyDown,
  showFavoritesOnly = false,
  onFavoritesToggle,
}: SearchBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [rightAlignedDropdowns, setRightAlignedDropdowns] = useState<
    Set<string>
  >(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeDropdown) {
      const checkDropdownPosition = () => {
        const refs = {
          branch: branchRef.current,
          category: categoryRef.current,
          sort: sortRef.current
        };

        const currentRef = refs[activeDropdown as keyof typeof refs];
        if (currentRef) {
          const rect = currentRef.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const dropdownWidth = 200; // Approximate dropdown width

          const newRightAligned = new Set(rightAlignedDropdowns);

          if (rect.left + dropdownWidth > viewportWidth - 20) {
            newRightAligned.add(activeDropdown);
          } else {
            newRightAligned.delete(activeDropdown);
          }

          setRightAlignedDropdowns(newRightAligned);
        }
      };

      setTimeout(checkDropdownPosition, 10);
    }
  }, [activeDropdown]);

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "most_used", label: "Most used (clicks last 30 days)" },
    { value: "recently_verified", label: "Recently verified" },
    { value: "alphabetical", label: "Alphabetical" },
    { value: "official_first", label: "Official first (.mil/.gov)" },
  ];

  const resetFilters = () => {
    if (onBranchChange) onBranchChange("");
    if (onCategoryChange) onCategoryChange("");
    if (onSortChange) onSortChange("");
    onChange("");
    setActiveDropdown(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-6 py-3">
      <div ref={containerRef} className="space-y-4">
        <div className="flex gap-3 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {onFavoritesToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newValue = !showFavoritesOnly;
                onFavoritesToggle(newValue);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                showFavoritesOnly
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  showFavoritesOnly
                    ? "fill-[#dc2626] text-[#dc2626]"
                    : "text-gray-400"
                }`}
              />
              Saved
            </button>
          )}

          {/* Branch Filter */}
          <div className="relative" ref={branchRef}>
            <button
              onClick={() => handleDropdownToggle("branch")}
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-w-[120px]"
            >
              <span>{selectedBranch || "Branch"}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {activeDropdown === "branch" && (
              <div
                className={`absolute top-full mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto ${
                  rightAlignedDropdowns.has("branch") ? "right-0" : "left-0"
                }`}
              >
                {["All", ...branchesOptions].map((branch) => (
                  <button
                    key={branch}
                    onClick={() => {
                      onBranchChange(branch === "All" ? "" : branch);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg whitespace-nowrap ${
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
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => handleDropdownToggle("category")}
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-w-[120px]"
            >
              <span>{selectedCategory || "Category"}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {activeDropdown === "category" && (
              <div
                className={`absolute top-full mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto ${
                  rightAlignedDropdowns.has("category") ? "right-0" : "left-0"
                }`}
              >
                {["All", ...categories].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category === "All" ? "" : category);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg whitespace-nowrap ${
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
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => handleDropdownToggle("sort")}
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-w-[120px]"
            >
              <span>
                {selectedSort
                  ? sortOptions.find((option) => option.value === selectedSort)
                      ?.label
                  : "Sort"}
              </span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {activeDropdown === "sort" && (
              <div
                className={`absolute top-full mt-1 min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto ${
                  rightAlignedDropdowns.has("sort") ? "right-0" : "left-0"
                }`}
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg whitespace-nowrap ${
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

          <button
            onClick={resetFilters}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
