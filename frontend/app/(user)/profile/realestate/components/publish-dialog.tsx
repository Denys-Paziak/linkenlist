"use client";

import { useEffect, useState } from "react";
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
import { Button } from "../../../../../components/ui/button";
import { fetcherUser } from "../../../../../lib/fetcher";
import {
  EPackageType,
  IRealestateOwnerList,
} from "../../../../../types/Realestate";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

export function PublishDialog({
  listing,
  showDialog,
  handleCancel,
}: {
  listing: Pick<IRealestateOwnerList, "id" | "package" | "expiresAt" | "isExpired">;
  showDialog: boolean;
  handleCancel: () => void;
}) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [errors, setErrors] = useState<string | null>(null);


  const handleSubmit = async () => {
    setErrors(null);
    setStatus("loading");

    try {
      const data = await fetcherUser(`/listings/${listing.id}/publish`, {
        method: "PATCH",
        credentials: "include",
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
      setErrors(err?.message ?? "Failed to publish the listing.");
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
          <DialogTitle>Publish Listing</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleCancel()}>
            Cancel
          </Button>
          <ButtonSubmit
            type="submit"
            status={status}
            statusText={{
              loading: "Publish...",
              success: "Success!",
              error: "Try again",
              disabled: "Disabled",
            }}
            onClick={() => {
              handleSubmit();
            }}
            disabled={status === "loading"}
          >
            Publish
          </ButtonSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
