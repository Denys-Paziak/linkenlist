"use client";

import { useState } from "react";
import { Button } from "../../../../../../../../components/ui/button";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../../../components/ui/button-submit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../../../../../components/ui/dialog";
import { ILink } from "../../../../../../../../types/Link";
import { fetcherAdmin } from "../../../../../../../../lib/fetcher";

export function DeleteDialog({
  showDeleteDialog,
  handleCancelDelete,
  handleSuccessDelete,
  itemToDelete,
}: {
  showDeleteDialog: boolean;
  handleCancelDelete: () => void;
  handleSuccessDelete: () => void;
  itemToDelete: ILink;
}) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [errors, setErrors] = useState<string>("");
  const [deleteMode, setDeleteMode] = useState<"soft" | "hard">("soft");

  const handleConfirmDelete = async (method: "soft" | "hard") => {
    setStatus("loading");
    setErrors("");
    setDeleteMode(method);

    try {
      const response = await fetcherAdmin("/admin/links/" + itemToDelete.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          method,
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

  const softMode: ButtonSubitStatus = deleteMode === "soft" ? status : "idle";
  const hardMode: ButtonSubitStatus = deleteMode === "hard" ? status : "idle";

  return (
    <Dialog open={showDeleteDialog} onOpenChange={() => handleCancelDelete()}>
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
          <DialogTitle>Delete link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{itemToDelete?.title}"? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleCancelDelete()}>
            Cancel
          </Button>
          <ButtonSubmit
            type="submit"
            status={softMode}
            statusText={{
              loading: "Archiving...",
              success: "Archived!",
              error: "Try again",
            }}
            variant="secondary"
            onClick={() => {
              handleConfirmDelete("soft");
            }}
            disabled={status === "loading"}
          >
            Archive
          </ButtonSubmit>
          <ButtonSubmit
            type="submit"
            status={hardMode}
            statusText={{
              loading: "Delete...",
              success: "Deleted!",
              error: "Try again",
            }}
            variant="destructive"
            onClick={() => {
              handleConfirmDelete("hard");
            }}
            disabled={status === "loading"}
          >
            Delete
          </ButtonSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
