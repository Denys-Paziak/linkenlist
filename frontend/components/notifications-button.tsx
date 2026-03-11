"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { ENotificationStatus, INotification } from "../types/Notification";
import { timeAgo } from "../lib/utils";

export function NotificationsButton({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (state: boolean) => void;
}) {
  const params = new URLSearchParams({
    page: String(1),
    limit: String(40),
    status: ENotificationStatus.NEW,
  });

  const key = `/notification?${params.toString()}`;
  const { data } =
    useSWR<[INotification[], number]>(key);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      if (isNotificationsOpen && !target.closest(".notifications-container")) {
        setIsNotificationsOpen(false);
      }

      if (
        isMobileMenuOpen &&
        !target.closest("nav") &&
        !target.closest(".notifications-container")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen, isMobileMenuOpen]);

  return (
    <div className="relative notifications-container">
      <button
        className="max-md:w-full relative px-4 py-2 max-md:px-3 max-md:py-1.5 max-md:hover:bg-white/20 text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md touch-manipulation"
        aria-label="Notifications"
        onClick={() => setIsNotificationsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <p className="hidden max-md:block text-sm">Notifications</p>
        </div>
        {(data?.[1] || 0) > 0 && (
          <span className="absolute -top-1 -right-1 max-md:left-[130px] bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {(data?.[1] || 0) > 9 ? "9+" : data?.[1]}
          </span>
        )}
      </button>

      {isNotificationsOpen && (
        <div className="absolute top-full right-0 max-md:right-auto max-md:left-0  mt-1 w-[20rem] bg-white border border-gray-200 rounded-lg shadow-xl z-[1010] animate-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-bold text-foreground">Notifications</p>
            </div>
            <div className="max-h-[20rem] overflow-y-auto">
              {data?.[0].length ? (
                data?.[0].slice(0, 3).map((item) => (
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-sm text-foreground mb-1">
                      {item.title.length > 70
                        ? `${item.title.substring(0, 70)}...`
                        : item.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.message.length > 230
                        ? `${item.message.substring(0, 230)}...`
                        : item.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-2 text-center">No new messages.</p>
              )}
            </div>
            <div className="border-t border-gray-100">
              <Link
                href="/notifications"
                className="block px-4 py-3 text-sm text-primary hover:bg-secondary transition-colors text-center font-medium"
                onClick={() => setIsNotificationsOpen(false)}
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
