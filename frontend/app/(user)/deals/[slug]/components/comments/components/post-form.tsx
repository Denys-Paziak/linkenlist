"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../../../../../components/ui/button";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../components/ui/button-submit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCommentSchema } from "../../../../../../../lib/schemas/post-comment-schema";
import { fetcherUser } from "../../../../../../../lib/fetcher";
import { Textarea } from "../../../../../../../components/ui/textarea";
import { cn } from "../../../../../../../lib/utils";
import { ECommentPageType, IComment } from "../../../../../../../types/Comment";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { SWRInfiniteKeyedMutator } from "swr/infinite";

export function PostForm({
  dealId,
  mutate,
}: {
  dealId: number;
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

      const createdComment = await fetcherUser(`/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          pageType: ECommentPageType.DEAL,
          pageId: dealId,
        }),
      });

      mutate(
        (pages) => {
          if (!pages || pages.length === 0) {
            return pages;
          }

          const [firstPage, ...rest] = pages;
          const [firstItems, total] = firstPage;

          const alreadyExists = firstItems.some(
            (c) => c.id === createdComment.id
          );
          if (alreadyExists) return pages;

          return [
            [
              [
                {
                  ...createdComment,
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
    <div className="mb-8 pb-6 border-b border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4">Leave a comment</h4>
      <div className="space-y-4">
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
          <div className="flex items-center gap-3 mt-2">
            <ButtonSubmit
              type="button"
              onClick={submitForm}
              status={status}
              statusText={{
                loading: "Posting...",
                success: "Posted",
                error: "Try again",
                disabled: "Disabled",
              }}
              className="bg-[#003366] hover:bg-[#003366]/90 text-white"
            >
              Post Comment
            </ButtonSubmit>
            <Button
              variant="outline"
              onClick={() => {
                form.reset();
              }}
              className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
