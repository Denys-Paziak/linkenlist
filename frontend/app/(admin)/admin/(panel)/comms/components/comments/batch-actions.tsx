"use client";

import { CheckCircle, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../../../../../../components/ui/card";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../components/ui/button-submit";
import { CommentDeleteDialog } from "./delete-dialog";
import { useEffect, useState } from "react";
import { Button } from "../../../../../../../components/ui/button";
import { fetcherAdmin } from "../../../../../../../lib/fetcher";
import { ECommentStatus } from "../../../../../../../types/Comment";
import { mutate } from "swr";

export function BatchActions({
  selectedComments,
  setSelectedComments,
}: {
  selectedComments: number[];
  setSelectedComments: (value: number[]) => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedComments.length} comment
            {selectedComments.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <ApproveButton
              selectedComments={selectedComments}
              setSelectedComments={setSelectedComments}
            />
            <HideButton
              selectedComments={selectedComments}
              setSelectedComments={setSelectedComments}
            />
            <DeleteButton
              selectedComments={selectedComments}
              handleSuccess={() => setSelectedComments([])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApproveButton({
  selectedComments,
  setSelectedComments,
}: {
  selectedComments: number[];
  setSelectedComments?: (value: number[]) => void;
}) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");

  const approve = async () => {
    setStatus("loading");
    try {
      await fetcherAdmin("/admin/comments/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          commentIds: selectedComments,
          status: ECommentStatus.APPROVED,
        }),
      });

      setStatus("success");
      setSelectedComments?.([]);
      mutate(
        (key) => typeof key === "string" && key.startsWith("/admin/comments")
      );
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
    <ButtonSubmit
      onClick={approve}
      status={status}
      statusText={{
        loading: "Approval...",
        success: "Approved!",
        error: "Try again",
      }}
      disabled={status === "loading"}
      size="sm"
    >
      <CheckCircle className="h-4 w-4 mr-1" />
      Approve
    </ButtonSubmit>
  );
}

export function HideButton({
  selectedComments,
  setSelectedComments,
}: {
  selectedComments: number[];
  setSelectedComments?: (value: number[]) => void;
}) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");

  const hiden = async () => {
    setStatus("loading");
    try {
      await fetcherAdmin("/admin/comments/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          commentIds: selectedComments,
          status: ECommentStatus.HIDDEN,
        }),
      });

      setStatus("success");
      setSelectedComments?.([]);
      mutate(
        (key) => typeof key === "string" && key.startsWith("/admin/comments")
      );
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
    <ButtonSubmit
      size="sm"
      variant="outline"
      status={status}
      statusText={{
        loading: "Hide...",
        success: "Hiden!",
        error: "Try again",
      }}
      disabled={status === "loading"}
      onClick={hiden}
    >
      <Eye className="h-4 w-4 mr-1" />
      Hide
    </ButtonSubmit>
  );
}

export function DeleteButton({
  selectedComments,
  handleSuccess,
}: {
  selectedComments: number[];
  handleSuccess: () => void;
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => setShowDeleteConfirmation(true)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
      <CommentDeleteDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        selectedComments={selectedComments}
        handleSuccess={handleSuccess}
      />
    </>
  );
}
