"use client";

import { Download, Eye, Plus } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import Link from "next/link";
import { AddPropertyDialog } from "./add-property-dialog";
import { useEffect, useState } from "react";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../../../components/ui/button-submit";

export function TopBarActions({
  listingsIdsForExport,
}: {
  listingsIdsForExport: number[];
}) {
  const [showAddPropertyDialog, setShowAddPropertyDialog] =
    useState<boolean>(false);

  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");

  const handleExport = async () => {
    setStatus("loading");
    try {
      const blob = await fetcherAdmin<Blob>("/admin/listings/export-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ listingsIds: listingsIdsForExport }),
        responseType: "blob",
      });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "report.csv";
      a.click();
      URL.revokeObjectURL(a.href);

      setStatus("success");
    } catch (err: any) {
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
    <>
      <div className="flex gap-2">
        <ButtonSubmit
          status={status}
          statusText={{
            loading: "Exporting...",
            success: "Downloaded",
            error: "Try again",
          }}
          disabled={status === "loading"}
          size="sm"
          onClick={handleExport}
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </ButtonSubmit>
        <Link href={"/realestate"} target="_blank">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Public Listings
          </Button>
        </Link>
        <Button onClick={() => setShowAddPropertyDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
      <AddPropertyDialog
        isShow={showAddPropertyDialog}
        onClose={() => setShowAddPropertyDialog(false)}
      />
    </>
  );
}
