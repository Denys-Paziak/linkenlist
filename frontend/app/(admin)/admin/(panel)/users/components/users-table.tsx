"use client";

import { Eye, Loader2, Search } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { Input } from "../../../../../../components/ui/input";
import { StatusChip } from "../../../../../../components/ui/status-chip";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import { useQueryStateWithLocalStorage } from "../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger, parseAsString } from "nuqs";
import { useDebounce } from "use-debounce";
import useSWR from "swr";
import { IUserTable } from "../../../../../../types/User";
import { Pagination } from "../../../../../../components/ui/pagination";
import { isoToDatetimeLocal } from "../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";

export function UsersTable() {
  const [_, setUser] = useQueryStateWithLocalStorage("/admin/users?user", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [searchQuery, setSearchQuery] = useQueryStateWithLocalStorage(
    "/admin/users?search",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );
  const [debouncedSearch] = useDebounce(searchQuery, 700, {
    leading: true,
  });

  const [page, setPage] = useQueryStateWithLocalStorage("/admin/deals?page", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [limit, setLimit] = useQueryStateWithLocalStorage(
    "/admin/users?limit",
    {
      defaultValue: 9,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  const [status, setStatus] = useQueryStateWithLocalStorage(
    "/admin/users?status",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (debouncedSearch.length >= 2) params.set("search", debouncedSearch);
  if (status !== "all") {
    if (status === "active") {
      params.set("banned", "");
    }
    if (status === "suspended") {
      params.set("banned", "true");
    }
  }

  const key = `/admin/users?${params.toString()}`;
  const { data, isValidating, error } = useSWR<[IUserTable[], number]>(
    key,
    {
      revalidateIfStale: true,
    }
  );
  const totalPages = Math.ceil((data?.[1] || 0) / limit);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleLimitPageChange = (limit: number) => {
    setLimit(limit);
    if (page !== 1) {
      setPage(1);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                placeholder="Search by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({data?.[1] || 0})</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        {error ? (
          <div className="p-6 pt-0">
            <ErrorAlert message="Failed to load data" />
          </div>
        ) : null}
        <CardContent>
          {data && data[0].length !== 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Listings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data[0].map((user) => {
                  const idBaned =
                    user.banExpirationDate &&
                    new Date(user.banExpirationDate).getTime() >
                      new Date().getTime();

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.privateEmail}</TableCell>
                      <TableCell>
                        {isoToDatetimeLocal(user.createdAt, false)}
                      </TableCell>
                      <TableCell>
                        {isoToDatetimeLocal(user.lastActivity, false)}
                      </TableCell>
                      <TableCell>{user.listings.length}</TableCell>
                      <TableCell>
                        <StatusChip
                          status={idBaned ? "expired" : "published"}
                          text={idBaned ? "Suspended" : "Active"}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUser(user.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : isValidating ? (
            <div className="w-full max-h-full py-5 h-full flex-grow flex items-center justify-center">
              <Loader2 className="animate-spin w-14 h-14" />
            </div>
          ) : (
            <div className="w-full max-h-full py-5 h-full flex-grow flex items-center justify-center">
              No deals found
            </div>
          )}

          <Pagination
            handlePageChange={handlePageChange}
            handleLimitPageChange={handleLimitPageChange}
            pagination={{
              limit,
              page,
            }}
            totalPages={totalPages}
            className="pb-8 px-6"
          />
        </CardContent>
      </Card>
    </>
  );
}
