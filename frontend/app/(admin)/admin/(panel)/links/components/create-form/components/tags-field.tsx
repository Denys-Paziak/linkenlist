"use client";

import useSWR from "swr";
import { InputMultiSelect } from "@/components/ui/input-multi-select";
import {
  Controller,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { LinksTag } from "../../../../../../../../types/Link";

type AnyWithTags = FieldValues & { image?: string };

interface TagsFieldProps {
  form: UseFormReturn<AnyWithTags>;
  disabled?: boolean;
}

export function TagsField({ form, disabled }: TagsFieldProps) {
  const { data } = useSWR<LinksTag[]>("/admin/links/tags");

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Tags
      </label>
      <Controller
        name={"tags"}
        control={form.control}
        render={({ field }) => (
          <InputMultiSelect
            disabled={disabled}
            options={data || []}
            ref={field.ref}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder="Select or type tags"
            maxItems={20}
            className={
              form.formState.errors.tags
                ? "border-destructive focus:border-destructive"
                : "border-input"
            }
          />
        )}
      />
      {(() => {
        const msg = getTagsErrorMsg(form.formState.errors.tags);
        return msg ? (
          <p className="mt-1 text-sm text-destructive">{msg}</p>
        ) : null;
      })()}
    </div>
  );
}

function getTagsErrorMsg(e: any): string | undefined {
  if (!e) return;
  if ("message" in e && typeof e.message === "string") return e.message;
  if (Array.isArray(e)) {
    for (const item of e) {
      if (
        item &&
        typeof item === "object" &&
        "message" in item &&
        item.message
      ) {
        return String(item.message);
      }
    }
  }
  return;
}
