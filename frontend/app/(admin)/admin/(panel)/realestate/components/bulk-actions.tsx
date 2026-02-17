"use client";

import { CheckCircle, XCircle, Calendar } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import { IRealestateAdminList } from "../../../../../../types/Realestate";
import { useEffect, useState } from "react";
import { ExpirationDialog } from "./expiration-dialog";
import { BulkRejectDialog } from "./bulk-reject-dialog";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { mutate } from "swr";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";

export function BulkActions({
  selectedListings,
}: {
  selectedListings: IRealestateAdminList[];
}) {
  const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false);
  const [showExpirationDialog, setShowExpirationDialog] = useState(false);

  const [statusBulkApprove, setStatusBulkApprove] =
    useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const handleBulkApprove = async () => {
    setFormError(null);
    setStatusBulkApprove("loading");
    try {
      await fetcherAdmin("/admin/listings/bulk-approve", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          listingsIds: selectedListings.map((item) => item.id),
        }),
      });

      setStatusBulkApprove("success");
      mutate(
        (key) => typeof key === "string" && key.startsWith("/admin/listings"),
        undefined,
        { revalidate: true },
      );
    } catch (err: any) {
      setFormError(err?.message ?? "Approve failed");
      setStatusBulkApprove("error");
    }
  };

  useEffect(() => {
    if (statusBulkApprove === "success" || statusBulkApprove === "error") {
      const timer = setTimeout(() => setStatusBulkApprove("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusBulkApprove]);

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        <ButtonSubmit
          status={statusBulkApprove}
          statusText={{
            loading: "Approval...",
            success: "Approved!",
            error: "Try again",
          }}
          disabled={statusBulkApprove === "loading"}
          size="sm"
          onClick={handleBulkApprove}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Approve
        </ButtonSubmit>
        {formError ? <ErrorAlert message={formError} /> : null}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowBulkRejectDialog(true)}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExpirationDialog(true)}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Adjust Expiration
        </Button>
      </div>

      <ExpirationDialog
        isShow={showExpirationDialog}
        onClose={() => setShowExpirationDialog(false)}
        selectedListings={selectedListings}
      />

      <BulkRejectDialog
        isShow={showBulkRejectDialog}
        onClose={() => setShowBulkRejectDialog(false)}
        selectedListings={selectedListings}
      />
    </>
  );
}
