"use client";

import { CheckCircle, Clock, Eye, Loader2, Mail, Search } from "lucide-react";
import { Card, CardContent } from "../../../../../../../components/ui/card";
import { Input } from "../../../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import { Button } from "../../../../../../../components/ui/button";
import { useEffect, useState } from "react";
import { StatusChip } from "../../../../../../../components/ui/status-chip";
import { ContactDetailDialog } from "./detail-dialog";
import { useQueryStateWithLocalStorage } from "../../../../../../../hooks/use-query-state-with-local-storage";
import { EContactInboxStatus, EContactInboxType, IContactInbox } from "../../../../../../../types/ContactInbox";
import { parseAsInteger, parseAsString } from "nuqs";
import { useDebounce } from "use-debounce";
import useSWR from "swr";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { Pagination } from "../../../../../../../components/ui/pagination";
import { Actions } from "./actions";

export function Contact() {
  const [searchQuery, setSearchQuery] = useQueryStateWithLocalStorage(
    "/admin/contact-inbox?search",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    },
  );
  const [debouncedSearch] = useDebounce(searchQuery, 700, {
    leading: true,
  });

  const [statusFilter, setStatusFilter] = useQueryStateWithLocalStorage(
    "/admin/contact-inbox?status",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    },
  );

  const [page, setPage] = useQueryStateWithLocalStorage(
    "/admin/contact-inbox?page",
    {
      defaultValue: 1,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    },
  );

  const [limit, setLimit] = useQueryStateWithLocalStorage(
    "/admin/contact-inbox?limit",
    {
      defaultValue: 40,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    },
  );

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (debouncedSearch.length >= 2) params.set("search", debouncedSearch);
  if (statusFilter !== "all") params.set("status", statusFilter);

  const key = `/admin/contact-inbox?${params.toString()}`;
  const { data, isLoading, isValidating, error } =
    useSWR<[IContactInbox[], number]>(key);
  const totalPages = Math.ceil((data?.[1] || 0) / limit);

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLimitPageChange = (limit: number) => {
    setLimit(limit);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [limit, searchQuery, statusFilter]);

  return (
    <>
      {/* Contact Messages Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search name, email, or subject..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardContent className="p-0">
          {error ? (
            <div className="p-6">
              <ErrorAlert message="Failed to load data" />
            </div>
          ) : null}
          {data && data[0].length !== 0 ? (
            <div className="overflow-x-auto relative">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium">Date</th>
                    <th className="p-4 text-left font-medium">Type</th>
                    <th className="p-4 text-left font-medium">Name</th>
                    <th className="p-4 text-left font-medium">Email</th>
                    <th className="p-4 text-left font-medium">Subject</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.[0]?.map((message) => (
                    <tr
                      key={message.id}
                      className={`border-b hover:bg-gray-50 ${
                        message.status.toLowerCase() === "resolved"
                          ? "bg-green-50 opacity-75"
                          : ""
                      }`}
                    >
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <StatusChip
                          text={message.type}
                          className={"block w-fit whitespace-nowrap"}
                          status={
                            message.type === EContactInboxType.REPORT ? "expired" : "published"
                          }
                        />
                      </td>
                      <td className="p-4 font-medium">{message.name}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {message.email}
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{message.subject}</div>
                          <div className="text-sm text-gray-600">
                            {message.firstMessage}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusChip
                          text={message.status}
                          status={
                            message.status.toLowerCase() === EContactInboxStatus.NEW
                              ? "expired"
                              : message.status.toLowerCase() === EContactInboxStatus.OPEN
                                ? "scheduled"
                                : "published"
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Actions message={message} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(isLoading || isValidating) && (
                <div className="absolute z-30 flex items-center justify-center inset-0 bg-black/10">
                  <Loader2 className="animate-spin w-14 h-14" />
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="w-full max-h-full h-full flex-grow flex items-center justify-center p-6">
              <Loader2 className="animate-spin w-14 h-14" />
            </div>
          ) : null}
          <Pagination
            handlePageChange={handlePageChange}
            handleLimitPageChange={handleLimitPageChange}
            pagination={{
              limit,
              page,
            }}
            totalPages={totalPages}
            pageSizeOptions={[40, 70, 100]}
            className="py-6 px-8"
          />
        </CardContent>
      </Card>
    </>
  );
}

export function ContactButton() {
  const { data } = useSWR<[IContactInbox[], number]>(
    "/admin/contact-inbox?page=1&limit=1&status=new",
  );

  return (
    <>
      <Mail className="h-4 w-4" />
      Contact Inbox (new {data?.[1] || 0})
    </>
  );
}
