"use client";

import { X, Search } from "lucide-react";
import { capitalize } from "../../../../lib/utils";
import {
  resourceCategories,
  resourceFormats,
} from "../../../../lib/schemas/resources/basic-form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface MobileFilterDrawer {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  selectedFormat: string;
  onFormatChange: (value: string) => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  selectedFormat,
  onFormatChange,
}: MobileFilterDrawer) {
  const resetFilters = () => {
    onCategoryChange("");
    onSearchChange("");
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
