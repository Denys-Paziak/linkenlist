"use client";

import { useState, useEffect } from "react";
import { mutate } from "swr";
import { Button } from "../../../../../components/ui/button";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../components/ui/button-submit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { fetcherUser } from "../../../../../lib/fetcher";
import {
  EListingStatus,
  EPackageType,
  IRealestateOwnerList,
} from "../../../../../types/Realestate";

export function DeactivateDialog({
  listing,
  showDialog,
  handleCancel,
}: {
  listing: IRealestateOwnerList;
  showDialog: boolean;
  handleCancel: () => void;
}) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [errors, setErrors] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrors(null);
    setStatus("loading");

    try {
      const data = await fetcherUser(`/listings/${listing.id}/deactivate`, {
        method: "PATCH",
        credentials: "include",
      });

      if (data.url) {
        window.location.href = data.url;
      }

      setStatus("success");
      mutate(
        (key) => typeof key === "string" && key.startsWith("/listings/my?")
      );
    } catch (err: any) {
      setErrors(err?.message ?? "Unable to save the listing.");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        handleCancel();
        setStatus("idle");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <Dialog open={showDialog} onOpenChange={() => handleCancel()}>
      <DialogContent>
        {errors ? (
          <div
            className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-2.5"
            role="alert"
          >
            {errors}
          </div>
        ) : null}
        <DialogHeader>
          <DialogTitle>Deactivate Listing</DialogTitle>
          <DialogDescription>
            After deactivating the listing, users will not be able to view it
            and it will disappear from search results.
            <br />
            {listing.package === EPackageType.BASIC && listing.status === EListingStatus.ACTIVE && (
                <b>With the basic package, the listing will be checked again before being republished.</b>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleCancel()}>
            Cancel
          </Button>
          <ButtonSubmit
            type="submit"
            status={status}
            statusText={{
              loading: "Deactivate...",
              success: "Deactivated!",
              error: "Try again",
              disabled: "Disabled",
            }}
            onClick={() => {
              handleSubmit();
            }}
          >
            Deactivate
          </ButtonSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
