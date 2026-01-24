"use client";

import { useEffect, useState } from "react";
import { Bell, Calendar, Filter, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationDialog } from "./components/notification-dialog";
import { NotificationsHeader } from "./components/notifications-header";
import {
  ENotificationStatus,
  INotification,
} from "../../../types/Notification";
import { useQueryStateWithLocalStorage } from "../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger, parseAsString } from "nuqs";
import { useDebounce } from "use-debounce";
import useSWR, { mutate as mutateGlobal } from "swr";
import { Pagination } from "../../../components/ui/pagination";
import { ErrorAlert } from "../../../components/ui/error-alert";
import { timeAgo } from "../../../lib/utils";
import { fetcherUser } from "../../../lib/fetcher";
import { IUser } from "../../../types/User";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const userStatus = useSWR<IUser>("/users/self");

  const router = useRouter();

  useEffect(() => {
    if (userStatus.error || (!userStatus.data && !(userStatus.isLoading || userStatus.isValidating))) {
      router.push("/auth/signin?tab=login");
      return;
    }
  }, [userStatus.data, userStatus.error])

  const [notificationSelect, setNotificationSelect] =
    useState<INotification | null>(null);

  const [searchQuery, setSearchQuery] = useQueryStateWithLocalStorage(
    "/notifications?search",
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
    "/notifications?status",
    {
      defaultValue: "all",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    },
  );

  const [page, setPage] = useQueryStateWithLocalStorage("/notifications?page", {
    defaultValue: 1,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [limit, setLimit] = useQueryStateWithLocalStorage(
    "/notifications?limit",
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

  const key = `/notification?${params.toString()}`;
  const { data, isLoading, isValidating, error, mutate } =
    useSWR<[INotification[], number]>(key);
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

  const openNotification = async (notification: INotification) => {
    setNotificationSelect(notification);
    mutate(
      [
        data?.[0].map((item) => {
          if (item.id !== notification.id) {
            return item;
          } else {
            return {
              ...item,
              status: ENotificationStatus.READ,
            };
          }
        }) || [],
        data?.[1] || 0,
      ],
      {
        revalidate: false,
      },
    );
    try {
      await fetcherUser(`/notification/${notification.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: ENotificationStatus.READ,
        }),
      });

      const params = new URLSearchParams({
        page: String(1),
        limit: String(40),
        status: ENotificationStatus.NEW,
      });

      mutateGlobal(`/notification?${params.toString()}`);
    } catch {}
  };

  return (
    <>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <NotificationsHeader />

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="new">Unread Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-4 flex flex-col justify-between min-h-[400px]">
          {error ? (
            <div className="p-6">
              <ErrorAlert message="Failed to load data" />
            </div>
          ) : null}
          {data && data[0].length !== 0 ? (
            <div className="overflow-x-auto relative space-y-4">
              {data[0].map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white border rounded-lg p-6 transition-all hover:shadow-md cursor-pointer ${
                    notification.status !== ENotificationStatus.READ
                      ? "border-l-4 border-l-primary bg-primary/5"
                      : "border-gray-200"
                  }`}
                  onClick={() => openNotification(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">
                          {notification.title.length > 70
                            ? `${notification.title.substring(0, 70)}...`
                            : notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {timeAgo(notification.createdAt)}
                          </p>
                          {notification.status !== ENotificationStatus.READ && (
                            <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                              New
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {notification.message.length > 230
                          ? `${notification.message.substring(0, 230)}...`
                          : notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No notifications found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
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
            pageSizeOptions={[40, 70, 100]}
            className="py-6 px-8"
          />
        </div>
      </main>

      {notificationSelect && (
        <NotificationDialog
          closeModal={() => setNotificationSelect(null)}
          notification={notificationSelect}
        />
      )}
    </>
  );
}
