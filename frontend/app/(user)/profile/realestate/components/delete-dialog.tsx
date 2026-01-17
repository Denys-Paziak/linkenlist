"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../../components/ui/button-submit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import {
  EListingStatus,
  IRealestateOwnerList,
} from "../../../../../types/Realestate";
import { fetcherUser } from "../../../../../lib/fetcher";
import { mutate } from "swr";

export function DeleteDialog({
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
      const data = await fetcherUser(`/listings/${listing.id}`, {
        method: "DELETE",
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
        handleCancel()
        setStatus("idle")
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
          <DialogTitle>Delete Listing</DialogTitle>
          {listing.status === EListingStatus.ACTIVE ? (
            <DialogDescription>
              An active listing cannot be deleted. To delete it, first make the
              listing inactive.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Deleting an listing is irreversible.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleCancel()}>
            Cancel
          </Button>
          <ButtonSubmit
            type="submit"
            status={status}
            statusText={{
              loading: "Delete...",
              success: "Deleted!",
              error: "Try again",
              disabled: "Disabled",
            }}
            onClick={() => {
              handleSubmit();
            }}
            disabled={
              status === "loading" || listing.status === EListingStatus.ACTIVE
            }
          >
            Delete
          </ButtonSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
