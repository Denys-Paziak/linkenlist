"use client";

import { useEffect, useRef, useState } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { capitalize } from "../../../../lib/utils";
import { dealCategories } from "../../../../lib/schemas/deal/basic-form-schema";

interface MobileFilterDrawer {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: MobileFilterDrawer) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
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

  const resetFilters = () => {
    onCategoryChange("");
    onSearchChange("");
    setActiveDropdown(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Search & Filter
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Search Bar */}
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
            onClick={resetFilters}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
