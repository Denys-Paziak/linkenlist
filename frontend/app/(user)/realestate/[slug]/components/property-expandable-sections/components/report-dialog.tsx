"use client";

import { useEffect, useState } from "react";
import { Turnstile } from "../../../../../../../components/turnstile";
import { Button } from "../../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../../../components/ui/dialog";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../../../../components/ui/button-submit";
import useSWR from "swr";
import { IUser } from "../../../../../../../types/User";
import { fetcherUser } from "../../../../../../../lib/fetcher";
import { IRealestate } from "../../../../../../../types/Realestate";
import { renderAddress } from "../../../../../../../components/realestate-card";

export function ReportDialog({
  isShow,
  onClose,
  listing
}: {
  isShow: boolean;
  onClose: () => void;
   listing: IRealestate;
}) {
  const { data: user } = useSWR<IUser>("/users/self");

  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const handleSubmitAuth = async () => {
    setFormError(null);

    if (!reason) {
      setFormError("Please select a reason for reporting.");
      return;
    }

    if (!details) {
      setFormError("Please provide additional details.");
      return;
    }

    setStatus("loading");

    try {
      await fetcherUser('/contact-inbox/listing-report/auth', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason,
          message: details,
          listingId: listing.id,
          listingAddress: renderAddress(listing)
        }),
      });

      setStatus("success");
      setReason("")
      setDetails("")
    } catch (err) {
      setFormError(
        (err as any).message ||
          "An unexpected error occurred. Please try again.",
      );
      setStatus("error");
    }
  };

  const handleSubmitCaptha = async () => {
    setFormError(null);

    if (!reason) {
      setFormError("Please select a reason for reporting.");
      return;
    }

    if (!details) {
      setFormError("Please provide additional details.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/contact-inbox/listing-report/captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cf-turnstile-response": token || "",
        },
        body: JSON.stringify({
          reason,
          message: details,
          listingId: listing.id,
          listingAddress: renderAddress(listing)
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.message);
      }

      setStatus("success");
      setReason("")
      setDetails("")
    } catch (err) {
      setFormError(
        (err as any).message ||
          "An unexpected error occurred. Please try again.",
      );
      if (window.turnstile?.reset) {
        window.turnstile.reset();
      }
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <Dialog open={isShow} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report this listing</DialogTitle>
        </DialogHeader>
        {formError ? <ErrorAlert message={formError} /> : null}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for reporting
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a reason</option>
              <option value="Incorrect information">Incorrect information</option>
              <option value="Spam or duplicate">Spam or duplicate</option>
              <option value="Inappropriate content">Inappropriate content</option>
              <option value="Fraudulent listing">Fraudulent listing</option>
              <option value="Other reason">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional details
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Please provide more details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          {!user && (
            <div className="mx-auto w-fit">
              <Turnstile onToken={(token) => setToken(token)} />
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <ButtonSubmit
              type="button"
              status={status}
              statusText={{
                loading: "Submitting...",
                success: "Report submitted",
                error: "Try again",
              }}
              onClick={() => {
                if (user) {
                  handleSubmitAuth();
                } else {
                  handleSubmitCaptha();
                }
              }}
            >
              Submit Report
            </ButtonSubmit>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
