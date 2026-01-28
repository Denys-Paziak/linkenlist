"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../../../../components/ui/button";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../../../components/ui/button-submit";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { mutate } from "swr";
import { Label } from "../../../../../../components/ui/label";
import { ArrowUpDown } from "lucide-react";
import { Input } from "../../../../../../components/ui/input";

export function AddPropertyDialog({
  isShow,
  onClose,
}: {
  isShow: boolean;
  onClose: () => void;
}) {
  const [username, setUsername] = useState<string | null>(null);
  const [packageType, setPackageType] = useState<string>("premium");

  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const handleBulkReject = async () => {
    setFormError(null);
    setStatus("loading");
    try {
      await fetcherAdmin("/admin/listings/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          package: packageType,
        }),
      });

      setStatus("success");
      setUsername(null);
      setPackageType("premium");
      mutate(
        (key) => typeof key === "string" && key.startsWith("/admin/listings"),
      );
    } catch (err: any) {
      setFormError(err?.message ?? "Reject failed");
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Enter username and select a package to create an listing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {formError ? <ErrorAlert message={formError} /> : null}
        </div>

        <div className="flex gap-2">
          <div>
            <Input
              label="Username"
              placeholder="Enter username"
              value={username || ""}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
          </div>
          <div className="pb-4">
            <Label htmlFor="package-select" className="text-sm font-medium">
              Package
            </Label>
            <select
              id="package-select"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              className="flex h-10 w-full  rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-[200px]"
            >
              <option value="premium">Premium</option>
              <option value="basic">Basic</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <ButtonSubmit
            status={status}
            statusText={{
              loading: "Creation...",
              success: "Created",
              error: "Try again",
            }}
            disabled={status === "loading"}
            size="sm"
            onClick={handleBulkReject}
          >
            Create
          </ButtonSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
