"use client";

import { Calendar } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import {
  EPackageType,
  IRealestateOwnerList,
} from "../../../../../types/Realestate";
import { capitalize } from "../../../../../lib/utils";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import { ButtonSubmitStatus } from "../../../../../components/ui/button-submit";
import { fetcherUser } from "../../../../../lib/fetcher";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";

export function ExpirationDialog({
  listing,
  showDialog,
  handleCancel,
}: {
  listing: IRealestateOwnerList;
  showDialog: boolean;
  handleCancel: () => void;
}) {
  const pricesData = useSWR<
    {
      id: string;
      price: number;
      currency: string;
      period: number | null;
    }[]
  >("/payments/prices");

  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [errors, setErrors] = useState<string | null>(null);

  const handleExtendListing = async (priceId: string) => {
    setErrors(null);
    setStatus("loading");

    try {
      const data = await fetcherUser(`/listings/${listing.id}/extend`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        handleCancel();
        mutate(
          (key) => typeof key === "string" && key.startsWith("/listings/my?"),
        );
      }

      setStatus("success");
    } catch (err: any) {
      setErrors(err?.message ?? "The listing term could not be extended.");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const statusUI =
    status === "loading"
      ? {
          text: "Processing…",
          Icon: Loader2,
          badgeClass: "bg-gray-100 text-gray-800",
        }
      : status === "success"
        ? {
            text: "Done",
            Icon: CheckCircle2,
            badgeClass: "bg-green-100 text-green-800",
          }
        : status === "error"
          ? {
              text: "Something went wrong",
              Icon: XCircle,
              badgeClass: "bg-red-100 text-red-800",
            }
          : null;

  const isBusy = status === "loading";

  return (
    <Dialog
      open={showDialog}
      onOpenChange={() => {
        handleCancel();
        setErrors(null);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {errors ? (
          <div
            className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-2.5"
            role="alert"
          >
            {errors}
          </div>
        ) : null}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Listing Expiration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Listing Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              {listing.title ?? ""}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {listing.unit +
                " " +
                listing.street +
                ", " +
                listing.city +
                ", " +
                listing.state +
                " " +
                listing.zip}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Plan: {capitalize(listing.package)}
              </span>
              {listing.expiresAt && (
                <span className="text-sm font-medium text-gray-700">
                  Expires:
                  {" " +
                    new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(listing.expiresAt))}
                </span>
              )}
            </div>
          </div>

          {/* Extension Options */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 ">Extension Options</h4>
            {statusUI ? (
              <div className="flex items-center justify-between">
                <Badge className={statusUI.badgeClass}>
                  <statusUI.Icon
                    className={`h-4 w-4 mr-1.5 ${
                      status === "loading" ? "animate-spin" : ""
                    }`}
                  />
                  {statusUI.text}
                </Badge>

                {isBusy ? (
                  <span className="text-xs text-muted-foreground">
                    Please do not close this window…
                  </span>
                ) : null}
              </div>
            ) : null}
            <div className="space-y-3">
              {pricesData.data?.map((item, i) => {
                if (!item.period) {
                  return null;
                }

                return (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full justify-between p-4 h-auto bg-transparent"
                    onClick={() => handleExtendListing(item.id)}
                    disabled={!pricesData.data || isBusy}
                  >
                    <span>Premium: extend {item.period} days</span>
                    <span className="font-semibold ">
                      {pricesData.data ? (
                        "$" + item.price.toLocaleString("en-US")
                      ) : (
                        <span className="text-red-700">
                          Unable to get price.
                        </span>
                      )}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                handleCancel();
                setErrors(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
