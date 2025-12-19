"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../../../components/ui/dialog";
import { useEffect, useState } from "react";
import { fetcherAdmin } from "../../../../../../../lib/fetcher";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../../components/ui/button-submit";
import { mutate } from "swr";

export function CommentDeleteDialog({
  open,
  onOpenChange,
  selectedComments,
  handleSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedComments: number[];
  handleSuccess: () => void;
}) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [errors, setErrors] = useState<string>("");

  const handleConfirmDelete = async () => {
    setStatus("loading");
    setErrors("");

    try {
      await fetcherAdmin("/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          commentIds: selectedComments,
        }),
      });

      setStatus("success");
      handleSuccess();
      mutate(
        (key) => typeof key === "string" && key.startsWith("/admin/comments")
      );
    } catch (err: any) {
      setErrors(err?.message ?? "Unable to remove comments.");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Are you sure you want to delete {selectedComments.length} comment
            {selectedComments.length !== 1 ? "s" : ""}? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <ButtonSubmit
              type="submit"
              status={status}
              statusText={{
                loading: "Delete...",
                success: "Deleted!",
                error: "Try again",
              }}
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={status === "loading"}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </ButtonSubmit>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
