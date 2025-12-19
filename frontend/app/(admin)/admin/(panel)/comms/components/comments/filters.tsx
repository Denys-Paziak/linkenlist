'use client'

import { Search } from "lucide-react";
import { Card, CardContent } from "../../../../../../../components/ui/card";
import { Input } from "../../../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import { useQueryStateWithLocalStorage } from "../../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsString } from "nuqs";

export function Filters() {
  const [searchQuery, setSearchQuery] = useQueryStateWithLocalStorage(
    "/admin/comments?search",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [statusFilter, setStatusFilter] = useQueryStateWithLocalStorage(
    "/admin/comments?status",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [pageTypeFilter, setPageTypeFilter] = useQueryStateWithLocalStorage(
    "/admin/comments?pageType",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search comments, users, or emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
          <Select value={pageTypeFilter} onValueChange={setPageTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Page Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deal">Deals</SelectItem>
              <SelectItem value="resource">Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
