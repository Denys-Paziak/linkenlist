"use client";

import type React from "react";

import { Search, Star } from "lucide-react";
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
import useSWR from "swr";
import { IUser } from "../../../../types/User";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: (show: boolean) => void;
}

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "popularity", label: "By popularity" },
  { value: "most_used", label: "Most used (clicks last 30 days)" },
  { value: "recently_verified", label: "Recently verified" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "official_first", label: "Official first (.mil/.gov)" },
];

export function SearchBar({
  value,
  onChange,
  selectedBranch = "",
  onBranchChange,
  selectedCategory = "",
  onCategoryChange,
  selectedSort = "",
  onSortChange,
  onKeyDown,
  showFavoritesOnly = false,
  onFavoritesToggle,
}: SearchBarProps) {
  const { data: user } = useSWR<IUser>("/users/self");

  const resetFilters = () => {
    if (onBranchChange) onBranchChange("all");
    if (onCategoryChange) onCategoryChange("all");
    if (onSortChange) onSortChange("default");
    onChange("");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-6 py-3">
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search 400+ official DoD websites"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {user && (
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
