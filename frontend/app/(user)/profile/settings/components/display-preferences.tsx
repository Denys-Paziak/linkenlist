"use client";

import { useEffect, useState } from "react";
import {
  ButtonSubitStatus,
  renderStatusIcon,
} from "../../../../../components/ui/button-submit";
import { Switch } from "../../../../../components/ui/switch";
import { IUser } from "../../../../../types/User";
import { fetcherUser } from "../../../../../lib/fetcher";
import { mutate } from "swr";
import { ErrorAlert } from "../../../../../components/ui/error-alert";

export function DisplayPreferences({ user }: { user?: IUser }) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const switchFooterDisclaimer = async () => {
    setFormError(null);

    setStatus("loading");
    try {
      await fetcherUser(`/users/self/switch-footer-disclaimer`, {
        method: "PATCH",
        credentials: "include",
      });

      mutate("/users/self").then(() => {
        setStatus("success");
      });
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const loading = !user || status === "loading";

  return (
    <div className="bg-white rounded-xl border border-primary/30 p-6">
      <h2 className="text-xl font-bold text-[#222222] mb-4">
        Display Preferences
      </h2>
      <div className="space-y-4">
        {formError ? <ErrorAlert message={formError} /> : null}
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <fieldset
            disabled={loading}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0"
          >
            <div className="flex-1">
              <label className="text-[#222222] font-medium block">
                Show footer disclaimer
              </label>
              <p className="text-sm text-[#222222]/70 mt-1">
                Display disclaimer about government affiliation in footer
              </p>
            </div>
            {renderStatusIcon(status)}
            <Switch
              id="switch-footer-disclaimer"
              checked={user?.footerDisclaimer}
              onCheckedChange={switchFooterDisclaimer}
            />
          </fieldset>
        </form>
      </div>
    </div>
  );
}
