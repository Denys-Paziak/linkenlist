"use client";

import { useState, useEffect } from "react";
import { mutate } from "swr";
import { Button } from "../../../../../../components/ui/button";
import { ButtonSubmitStatus, ButtonSubmit } from "../../../../../../components/ui/button-submit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../../../../components/ui/dialog";
import { fetcherUser } from "../../../../../../lib/fetcher";
import { IRealestateOwnerList, EPackageType } from "../../../../../../types/Realestate";

export function PublishDialog({
  listing,
  showDialog,
  handleCancel,
  isSaved
}: {
  listing: Pick<IRealestateOwnerList, "id" | "package" | "expiresAt" | "isExpired">;
  showDialog: boolean;
  handleCancel: () => void;
  isSaved: boolean
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
          {listing.package === EPackageType.BASIC && (
            <DialogDescription>
              Before publishing listings from the Basic package, they undergo
              moderation. Once approved by the administrator, the ad is
              automatically published. After that, without re-moderation, you
              can only edit Seller Information and Pricing. If you need to change other information in the ad, you need to deactivate it.
            </DialogDescription>
          )}
          {listing.package === EPackageType.PREMIUM &&
            listing.expiresAt &&
            !listing.isExpired ? null : (
            <DialogDescription>
              The announcement will be published after successful payment.
            </DialogDescription>
          )}
          {
            isSaved
              ? null
              : <DialogDescription>
                Save your changes before publishing.
              </DialogDescription>
          }
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
              success: "Published",
              error: "Try again",
              disabled: "Disabled",
            }}
            onClick={() => {
              handleSubmit();
            }}
            disabled={status === "loading" || !isSaved}
          >
            Publish
          </ButtonSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
