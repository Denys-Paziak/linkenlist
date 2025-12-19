"use client";

import { Search, Star } from "lucide-react";
import { capitalize } from "../../../../lib/utils";
import {
  resourceCategories,
  resourceFormats,
} from "../../../../lib/schemas/resources/basic-form-schema";
import useSWR from "swr";
import { IUser } from "../../../../types/User";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedFormat: string;
  onFormatChange: (value: string) => void;
  showSavedOnly: boolean;
  onSavedToggle: (show: boolean) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "popularity", label: "By popularity" },
];

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedFormat,
  onFormatChange,
  showSavedOnly = false,
  onSavedToggle,
  selectedSort,
  onSortChange,
}: FilterBarProps) {
  const { data: user } = useSWR<IUser>("/users/self");

  const handleResetFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
    onFormatChange("all");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>

        {user && (
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

        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            onCategoryChange(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {resourceCategories.map((item, i) => (
              <SelectItem key={i} value={item}>
                {capitalize(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedFormat}
          onValueChange={(value) => {
            onFormatChange(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {resourceFormats.map((item, i) => (
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
          <SelectTrigger>
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
          onClick={handleResetFilters}
          className="flex-1 w-full px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
