"use client";

import { X, Search } from "lucide-react";
import {
  branchesOptions,
  categories,
} from "../../../../lib/schemas/link-form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { capitalize } from "../../../../lib/utils";

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

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "most_used", label: "Most used (clicks last 30 days)" },
  { value: "recently_verified", label: "Recently verified" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "official_first", label: "Official first (.mil/.gov)" },
];

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
  const resetFilters = () => {
    onBranchChange("");
    onCategoryChange("");
    onSortChange("");
    onSearchChange("");
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

            <Select
              value={selectedBranch}
              onValueChange={(value) => {
                onBranchChange(value);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branchesOptions.map((item, i) => (
                  <SelectItem key={i} value={item}>
                    {capitalize(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                onCategoryChange(value);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((item, i) => (
                  <SelectItem key={i} value={item}>
                    {capitalize(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                selectedSort
                  ? sortOptions.find((option) => option.value === selectedSort)
                      ?.value
                  : "Sort"
              }
              onValueChange={(value) => {
                onSortChange(value);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((item, i) => (
                  <SelectItem key={i} value={item.value}>
                    {capitalize(item.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 border-t space-y-3">
            <div className="flex gap-3">
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
