"use client";

import { fetcherUser } from "../../../../../../../lib/fetcher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCommentSchema } from "../../../../../../../lib/schemas/post-comment-schema";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { Textarea } from "../../../../../../../components/ui/textarea";
import { useEffect, useState } from "react";
import { ECommentPageType, IComment } from "../../../../../../../types/Comment";
import { cn } from "../../../../../../../lib/utils";
import { Button } from "../../../../../../../components/ui/button";
import { SWRInfiniteKeyedMutator } from "swr/infinite";

export function ReplyForm({
  dealId,
  comment,
  setReplyingComment,
  mutate,
}: {
  dealId: number;
  comment: IComment;
  setReplyingComment: (id: number | null) => void;
  mutate: SWRInfiniteKeyedMutator<[IComment[], number][]>;
}) {
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

      const createdReply = (await fetcherUser(`/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          pageType: ECommentPageType.DEAL,
          pageId: dealId,
          parentId: comment.id,
        }),
      })) as IComment;

      mutate(
        (pages) => {
          if (!pages || pages.length === 0) {
            return pages;
          }

          const [firstPage, ...rest] = pages;
          const [firstItems, total] = firstPage;

          const alreadyExists = firstItems.some(
            (c) => c.id === createdReply.id
          );
          if (alreadyExists) return pages;

          return [
            [
              [
                {
                  ...createdReply,
                  liked: false,
                  likesCount: 0,
                  disliked: false,
                  dislikesCount: 0,
                },
                ...firstItems,
              ],
              total + 1,
            ],
            ...rest,
          ];
        },
        {
          revalidate: false,
          rollbackOnError: true,
        }
      );

      setStatus("success");
      form.reset();
      setReplyingComment(null);
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  const cancelEdit = () => {
    form.reset();
    setReplyingComment(null);
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div>
      <fieldset disabled={status === "loading"}>
        {formError ? <ErrorAlert message={formError} /> : null}

        <div>
          <Textarea
            placeholder="Share your thoughts about this deal..."
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

        <div className="flex items-center gap-2 mt-2">
          <ButtonSubmit
            size="sm"
            type="button"
            onClick={submitForm}
            status={status}
            statusText={{
              loading: "Saving...",
              success: "Saved",
              error: "Try again",
              disabled: "Disabled",
            }}
            className="bg-[#003366] hover:bg-[#003366]/90 text-white text-xs px-3 py-1"
          >
            Reply
          </ButtonSubmit>

          <Button
            size="sm"
            variant="outline"
            onClick={cancelEdit}
            className="text-xs px-3 py-1 bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </fieldset>
    </div>
  );
}
