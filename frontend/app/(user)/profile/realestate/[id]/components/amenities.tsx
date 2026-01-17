"use clinet";

import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Input } from "../../../../../../components/ui/input";
import { Checkbox } from "../../../../../../components/ui/checkbox";
import { COMMUNITY_FEATURES } from "../../../../../../constants/real-estate-options";
import { Label } from "../../../../../../components/ui/label";
import { Controller, useForm, useFormState, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amenitiesFormSchema } from "../../../../../../lib/schemas/realestate/amenities-form-schema";
import { IOwnerRealestate } from "../../../../../../types/Realestate";
import { FormHandle, otherFieldSplit } from "../page";

export const Amenities = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function Amenities({ data }, ref) {
  const [expandedSections, setExpandedSections] = useState(false);

  const form = useForm({
    resolver: zodResolver(amenitiesFormSchema),
    values: {
      subdivisionName: data?.subdivisionName || "",
      ...otherFieldSplit(
        "communityFeatures",
        data?.communityFeatures || undefined
      ),
    },
    mode: "onBlur",
  });

  const { isDirty, errors } = useFormState({ control: form.control });

  const otherCommunityFeatures = useWatch({
    control: form.control,
    name: "otherCommunityFeatures",
  });

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        if (!isDirty) {
          return { ok: true, changed: false as const, data: undefined };
        }

        const ok = await form.trigger();
        if (!ok) return { ok: false as const };

        const values = form.getValues();

        return {
          ok: true as const,
          changed: true as const,
          data: {
            amenities: {
              subdivisionName: values.subdivisionName,
              communityFeatures: [
                ...values.communityFeatures,
                values.otherCommunityFeatures &&
                  "OTHER:::" + values.otherCommunityFeatures,
              ].filter(Boolean),
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

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50">
      <button
        type="button"
        onClick={() => setExpandedSections((state) => !state)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
          <p className="text-sm text-gray-600 mt-1">
            These fields are not required to place your order and may be
            completed at a later date in your account
          </p>
        </div>
        {expandedSections ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {expandedSections && (
        <div className="px-4 pb-4 border-t border-gray-200 bg-white">
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Subdivision / Community Name"
                  {...form.register("subdivisionName")}
                  error={!!errors.subdivisionName}
                  errorMessage={errors.subdivisionName?.message}
                />
              </div>
              <div className="space-y-2">
                <Label>Community Features</Label>
                <Controller
                  control={form.control}
                  name="communityFeatures"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {COMMUNITY_FEATURES.map((feature) => {
                        const checked = (field.value ?? []).includes(feature);

                        return (
                          <div key={feature}>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`community-${feature}`}
                                checked={checked}
                                onCheckedChange={() => {
                                  const current = field.value ?? [];
                                  const next = current.includes(feature)
                                    ? current.filter(
                                        (s: string) => s !== feature
                                      )
                                    : [...current, feature];
                                  field.onChange(next);
                                }}
                              />
                              <Label
                                htmlFor={`community-${feature}`}
                                className="text-sm mb-0"
                              >
                                {feature}
                              </Label>
                            </div>
                            {feature === "Other" &&
                              field.value.includes("Other") && (
                                <div className="ml-6 mt-2">
                                  <Input
                                    placeholder="Specify other outdoor space (40 chars max)"
                                    {...form.register("otherCommunityFeatures")}
                                    error={!!errors.otherCommunityFeatures}
                                    errorMessage={
                                      errors.otherCommunityFeatures?.message
                                    }
                                    className="bg-gray-50 text-sm"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    {otherCommunityFeatures.length}/40 characters
                                  </p>
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
