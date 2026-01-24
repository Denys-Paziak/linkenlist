"use client";

import { Bell, Calendar, X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { timeAgo } from "../../../../lib/utils";
import { INotification } from "../../../../types/Notification";

export function NotificationDialog({
  closeModal,
  notification,
}: {
  closeModal: () => void;
  notification: INotification;
}) {
  return (
    <div
      className={
        "fixed inset-0 bg-black bg-opacity-50  items-center justify-center z-[10003] p-4 flex"
      }
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {notification.title}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {timeAgo(notification.createdAt)}{", "}
                {notification.sender ? notification.sender?.firstName + " " + notification.sender?.lastName : "System"}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {notification.message}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={closeModal}>Close</Button>
        </div>
      </div>
    </div>
  );
}
