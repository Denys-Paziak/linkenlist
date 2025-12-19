"use client";

import { fetcherUser } from "../../../../../../../lib/fetcher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCommentSchema } from "../../../../../../../lib/schemas/post-comment-schema";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { Textarea } from "../../../../../../../components/ui/textarea";
import { useEffect, useState } from "react";
import { IComment } from "../../../../../../../types/Comment";
import { cn } from "../../../../../../../lib/utils";
import { Button } from "../../../../../../../components/ui/button";
import { SWRInfiniteKeyedMutator } from "swr/infinite";

function patchCommentInPages(
  draft: [IComment[], number][] | undefined,
  id: number,
  patch: (c: IComment) => IComment
) {
  if (!draft) return draft;

  for (let p = 0; p < draft.length; p++) {
    const [items, total] = draft[p];

    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) continue;

    const nextDraft = draft.slice();
    const nextItems = items.slice();
    nextItems[idx] = patch(nextItems[idx]);
    nextDraft[p] = [nextItems, total];

    return nextDraft;
  }

  return draft;
}

export function EditForm({
  comment,
  setEditingComment,
  mutate,
}: {
  comment: IComment;
  setEditingComment: (id: number | null) => void;
  mutate: SWRInfiniteKeyedMutator<[IComment[], number][]>;
}) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(postCommentSchema),
    values: { body: comment.body },
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

      await fetcherUser(`/comments/${comment.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      mutate(
        (draft) =>
          patchCommentInPages(draft, comment.id, (c) => ({
            ...c,
            body: values.body,
          })),
        { revalidate: false }
      );

      setStatus("success");
      form.reset({ body: values.body });
      setEditingComment(null);
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  const cancelEdit = () => {
    form.reset();
    setEditingComment(null);
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="mb-2">
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
            Save
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
