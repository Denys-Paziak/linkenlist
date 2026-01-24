"use client";

import { ExternalLink, Reply } from "lucide-react";
import { Button } from "../../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../../../components/ui/dialog";
import { Label } from "../../../../../../../components/ui/label";
import { Textarea } from "../../../../../../../components/ui/textarea";
import { useEffect, useState } from "react";
import { ICommentAdmin } from "../../../../../../../types/Comment";
import { cn, isoToDatetimeLocal } from "../../../../../../../lib/utils";
import { ApproveButton, DeleteButton, HideButton } from "./batch-actions";
import { mutate } from "swr";
import { fetcherAdmin } from "../../../../../../../lib/fetcher";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCommentSchema } from "../../../../../../../lib/schemas/post-comment-schema";

export function CommentDetailDialog({
  comment,
  onClose,
}: {
  comment: ICommentAdmin | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!comment} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comment Details</DialogTitle>
        </DialogHeader>
        {comment && (
          <div className="space-y-6">
            {/* Comment ID and deep link URL for quick navigation */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">Comment ID</Label>
                <div className="flex items-center gap-2">
                  <p className="font-mono">#{comment.id}</p>
                </div>
              </div>
              <div>
                <Label className="font-medium">Page {comment.pageType}:</Label>
                <div className="flex items-center gap-2">
                  <p>
                    {comment.pageType === "deal"
                      ? comment.pageDeal.title
                      : comment.pageResource.title}
                  </p>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Comment Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">User</Label>
                <p>
                  {(comment.user.firstName || "") +
                    " " +
                    (comment.user.lastName || "").trim() ||
                    "@" + comment.user.username}{" "}
                  ({comment.user.privateEmail})
                </p>
              </div>
              <div>
                <Label className="font-medium">Joined Date</Label>
                <p>{isoToDatetimeLocal(comment.user.createdAt)}</p>
              </div>
            </div>

            {/* Comment Text */}
            <div className="space-y-2">
              <Label>Comment</Label>
              <div className="p-3 border rounded-md bg-gray-50 text-sm">
                {comment.body}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ApproveButton selectedComments={[comment?.id || 0]} />
              <HideButton selectedComments={[comment?.id || 0]} />
              <DeleteButton
                selectedComments={[comment?.id || 0]}
                handleSuccess={onClose}
              />
            </div>

            <ReplyForm comment={comment} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReplyForm({ comment }: { comment: ICommentAdmin }) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(postCommentSchema),
    values: { body: "" },
    mode: "onBlur",
  });

  const submitForm = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    setStatus("loading");
    try {
      const values = form.getValues();

      await fetcherAdmin(`/admin/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          pageType: comment.pageType,
          pageId:
            comment.pageType === "deal"
              ? comment.pageDeal.id
              : comment.pageResource.id,
          parentId: comment.id,
        }),
      });

      mutate(
        (key) => typeof key === "string" && key.startsWith("/admin/comments")
      );
      setStatus("success");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="space-y-2 border-t pt-4">
      <fieldset disabled={status === "loading"}>
        {formError ? <ErrorAlert message={formError} /> : null}

        <div>
          <Textarea
            label="Reply as LinkEnlist"
            placeholder="Type your reply..."
            {...form.register("body")}
            rows={2}
            className={cn(
              "bg-transparent",
              form.formState.errors.body ? "border-destructive " : ""
            )}
            error={!!form.formState.errors.body}
            errorMessage={form.formState.errors.body?.message}
          />
          <p className="text-sm text-gray-500 mt-1">
            {form.watch("body")?.length || 0}/1000 characters
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <ButtonSubmit
            type="button"
            onClick={submitForm}
            status={status}
            size="sm"
            statusText={{
              loading: "Posting...",
              success: "Posted",
              error: "Try again",
              disabled: "Disabled",
            }}
            className="bg-[#003366] hover:bg-[#003366]/90 text-white"
          >
            <Reply className="h-4 w-4 mr-1" />
            Send Reply
          </ButtonSubmit>
        </div>
      </fieldset>
    </div>
  );
}
