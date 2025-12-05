"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Star } from "lucide-react";
import { dealCategories } from "../../../../lib/schemas/deal/basic-form-schema";
import { capitalize } from "../../../../lib/utils";

interface FilterBarProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  showSavedOnly?: boolean;
  onSavedToggle?: (show: boolean) => void;
}

export function FilterBar({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  showSavedOnly = false,
  onSavedToggle,
}: FilterBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleResetFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
    if (onSavedToggle) onSavedToggle(false);
  };

  // Close dropdowns when clicking outside
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

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>

        {onSavedToggle && (
          <button
            onClick={() => onSavedToggle(!showSavedOnly)}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
              showSavedOnly
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                showSavedOnly
                  ? "fill-[#dc2626] text-[#dc2626]"
                  : "text-gray-400"
              }`}
            />
            Saved
          </button>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => handleDropdownToggle("category")}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <span>{capitalize(selectedCategory) || "All Categories"}</span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                activeDropdown === "category" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeDropdown === "category" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {["All Categories", ...dealCategories].map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(
                      category === "All Categories" ? "" : category
                    );
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm first:rounded-t-lg last:rounded-b-lg whitespace-nowrap ${
                    selectedCategory === category ||
                    (!selectedCategory && category === "All Categories")
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                >
                  {capitalize(category)}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleResetFilters}
          className="flex-1 w-full px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
