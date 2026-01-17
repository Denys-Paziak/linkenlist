"use client";

import { useState } from "react";
import { Button } from "../../../../../../../components/ui/button";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../components/ui/button-submit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../../../../components/ui/dialog";
import { fetcherAdmin } from "../../../../../../../lib/fetcher";

export function DeleteDialog({
  handleCancelDelete,
  handleSuccessDelete,
  commentId,
}: {
  handleCancelDelete: () => void;
  handleSuccessDelete: () => void;
  commentId: number | null;
}) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [errors, setErrors] = useState<string>("");

  const handleConfirmDelete = async () => {
    setStatus("loading");
    setErrors("");

    try {
      const response = await fetcherAdmin("/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          commentIds: [commentId],
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setStatus("success");
      handleSuccessDelete();
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch {
      const msg = "Unable to remove the link.";
      setErrors(msg);
      setStatus("error");
    }
  };

  return (
    <Dialog open={commentId !== null} onOpenChange={() => handleCancelDelete()}>
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
          <DialogTitle>Delete comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleCancelDelete()}>
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
            Delete
          </ButtonSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
