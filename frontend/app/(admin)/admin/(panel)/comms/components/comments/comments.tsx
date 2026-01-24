"use client";

import {
  ExternalLink,
  Eye,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "../../../../../../../components/ui/card";
import { Button } from "../../../../../../../components/ui/button";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { useEffect, useState } from "react";
import { StatusChip } from "../../../../../../../components/ui/status-chip";
import { Filters } from "./filters";
import useSWR from "swr";
import { ICommentAdmin } from "../../../../../../../types/Comment";
import { useQueryStateWithLocalStorage } from "../../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger, parseAsString } from "nuqs";
import { useDebounce } from "use-debounce";
import { isoToDatetimeLocal } from "../../../../../../../lib/utils";
import { Pagination } from "../../../../../../../components/ui/pagination";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { BatchActions } from "./batch-actions";
import { CommentDetailDialog } from "./detail-dialog";

export function Comments() {
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [selectedCommentDetail, setSelectedCommentDetail] =
    useState<ICommentAdmin | null>(null);

  const [searchQuery] = useQueryStateWithLocalStorage(
    "/admin/comments?search",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );
  const [debouncedSearch] = useDebounce(searchQuery, 700, {
    leading: true,
  });

  const [statusFilter] = useQueryStateWithLocalStorage(
    "/admin/comments?status",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [pageTypeFilter] = useQueryStateWithLocalStorage(
    "/admin/comments?pageType",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    }
  );

  const [page, setPage] = useQueryStateWithLocalStorage(
    "/admin/comments?page",
    {
      defaultValue: 1,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  const [limit, setLimit] = useQueryStateWithLocalStorage(
    "/admin/comments?limit",
    {
      defaultValue: 40,
      parse: (v) => parseAsInteger.parse(v),
      sync: true,
    }
  );

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (debouncedSearch.length >= 2) params.set("search", debouncedSearch);
  if (statusFilter !== "all") params.set("status", statusFilter);
  if (pageTypeFilter !== "all") params.set("pageType", pageTypeFilter);

  const key = `/admin/comments?${params.toString()}`;
  const { data, isLoading, isValidating, error } = useSWR<[ICommentAdmin[], number]>(key);
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
  }, [limit, searchQuery, statusFilter, pageTypeFilter]);

  return (
    <>
      <Filters />

      {selectedComments.length > 0 && (
        <BatchActions selectedComments={selectedComments} setSelectedComments={setSelectedComments} />
      )}

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
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={
                          selectedComments.length === data?.[0]?.length &&
                          data?.[0]?.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedComments(
                              (data?.[0] || []).map((c) => c.id)
                            );
                          } else {
                            setSelectedComments([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-4 text-left font-medium">Date</th>
                    <th className="p-4 text-left font-medium">Page</th>
                    <th className="p-4 text-left font-medium">User</th>
                    <th className="p-4 text-left font-medium">Comment</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.[0]?.map((comment) => (
                    <tr key={comment.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedComments.includes(comment.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedComments([
                                ...selectedComments,
                                comment.id,
                              ]);
                            } else {
                              setSelectedComments(
                                selectedComments.filter(
                                  (id) => id !== comment.id
                                )
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {isoToDatetimeLocal(comment.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusChip text={comment.pageType} status="draft" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {(comment.user.firstName || "") +
                              " " +
                              (comment.user.lastName || "").trim() ||
                              "@" + comment.user.username}
                          </div>
                          <div className="text-sm text-gray-600">
                            {comment.user.privateEmail}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-sm truncate">
                            {comment.body.length > 120
                              ? comment.body.substring(0, 120) + "..."
                              : comment.body}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusChip
                          text={comment.status}
                          status={
                            comment.status === "hidden"
                              ? "expired"
                              : comment.status === "approved"
                              ? "published"
                              : "draft"
                          }
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCommentDetail(comment);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a
                              href={new URL(
                                comment.pageType === "deal"
                                  ? `/deals/${comment.pageDeal.slug}`
                                  : `/resources/${comment.pageResource.slug}`,
                                process.env.NEXT_PUBLIC_SITE_URL
                              ).toString()}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
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

      <CommentDetailDialog
        comment={selectedCommentDetail}
        onClose={() => setSelectedCommentDetail(null)}
      />
    </>
  );
}

export function CommentsButton() {
  const { data } = useSWR<[ICommentAdmin[], number]>(
    "/admin/comments?page=1&limit=1&status=pending"
  );

  return (
    <>
      <MessageSquare className="h-4 w-4" />
      Comments (pending {data?.[1] || 0})
    </>
  );
}
