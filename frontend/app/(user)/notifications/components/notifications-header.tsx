"use client";

import { Bell } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { fetcherUser } from "../../../../lib/fetcher";
import { useEffect, useState } from "react";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../components/ui/button-submit";
import { mutate } from "swr";
import { ErrorAlert } from "../../../../components/ui/error-alert";

export function NotificationsHeader() {
  const [saveStatus, setSaveStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const markAllAsRead = async () => {
    setSaveStatus("loading");

    try {
      await fetcherUser(`/notification/read-all`, {
        method: "PATCH",
        credentials: "include",
      });

      setSaveStatus("success");
      mutate(
        (key) => typeof key === "string" && key.startsWith("/notification"),
      );
    } catch (err: any) {
      setFormError(err?.message ?? "Unable to remove comments.");
      setSaveStatus("error");
    }
  };

  useEffect(() => {
    if (saveStatus === "success" || saveStatus === "error") {
      const timer = setTimeout(() => setSaveStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-muted-foreground">
              Stay updated with system notifications and important updates
            </p>
          </div>
        </div>
        <ButtonSubmit
          type="button"
          onClick={markAllAsRead}
          variant="outline"
          size="sm"
          status={saveStatus}
          statusText={{
            loading: "Marking...",
            success: "All read",
            error: "Try again",
            disabled: "Disabled",
          }}
        >
          Mark All as Read
        </ButtonSubmit>
      </div>

      {formError ? <ErrorAlert message={formError} /> : null}
    </>
  );
}
