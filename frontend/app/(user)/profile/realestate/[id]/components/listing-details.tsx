"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "../../../../../../components/ui/textarea";
import { useForm, useFormState } from "react-hook-form";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { cn } from "../../../../../../lib/utils";
import { createListingDetailsSchema } from "../../../../../../lib/schemas/realestate/listing-details-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IOwnerRealestate } from "../../../../../../types/Realestate";
import { FormHandle } from "../page";
import { Input } from "../../../../../../components/ui/input-listing-variant";

export const ListingDetails = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function ListingDetails({ data }, ref) {
  const [expandedSections, setExpandedSections] = useState(false);
  const schema = useMemo(
    () => createListingDetailsSchema(data?.package || "basic"),
    [data?.package]
  );

  const form = useForm({
    resolver: zodResolver(schema),
    values: {
      description: data?.description || "",
      virtualTourUrl: data?.virtualTourUrl || "",
    },
    mode: "onBlur",
  });

  const { isDirty } = useFormState({ control: form.control });

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        const ok = await form.trigger();
        if (!ok) {
          setExpandedSections(true)
          return { ok: false as const }
        };

        if (!isDirty) {
          return { ok: true, changed: false as const, data: undefined };
        }

        const values = form.getValues();

        return {
          ok: true as const,
          changed: true as const,
          data: {
            listingDetails: {
              description: values.description === "" ? null : values.description,
              virtualTourUrl: values.virtualTourUrl === "" ? null : values.virtualTourUrl,
            },
          },
        };
      },
      resetDirty: () => {
        form.reset(form.getValues(), {
          keepValues: true,
        });
      },
    }),
    [form, isDirty]
  );

  const wordLimit = getWordLimit(data?.package || "basic");

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50">
      <button
        type="button"
        onClick={() => setExpandedSections((state) => !state)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Listing Details
          </h3>
        </div>
        {expandedSections ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {expandedSections && (
        <div className="px-4 pb-4 border-t border-gray-200 bg-white">
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Textarea
                id="listingDescription"
                placeholder="Describe your property..."
                {...form.register("description")}
                rows={2}
                className={cn(
                  form.formState.errors.description ? "border-destructive" : ""
                )}
                error={!!form.formState.errors.description}
                errorMessage={form.formState.errors.description?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.watch("description").length}/{wordLimit} characters
              </p>
            </div>
            <Input
              placeholder="Virtual Tour URL (Optional)"
              {...form.register("virtualTourUrl")}
              error={!!form.formState.errors.virtualTourUrl}
              errorMessage={form.formState.errors.virtualTourUrl?.message}
            />
          </div>
        </div>
      )}
    </div>
  );
});

function getWordLimit(packageType: string) {
  switch (packageType) {
    case "basic":
      return 4000;
    case "premium":
      return 8000;
    default:
      return 8000;
  }
}
