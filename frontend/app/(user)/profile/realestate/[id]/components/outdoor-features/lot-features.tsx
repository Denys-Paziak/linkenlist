"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { LOT_FEATURES } from "../../../../../../../constants/real-estate-options";
import { IOutdoorFeaturesForm } from "./outdoor-features";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function LotFeatures() {
  const { register, control, setValue } =
    useFormContext<IOutdoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherLotFeatures"],
  });

  const otherLotFeatures = useWatch({ control, name: "otherLotFeatures" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Lot Features
      </h4>
      <Controller
        control={control}
        name="lotFeatures"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {LOT_FEATURES.map((feature) => {
                const isDisabled = isNoneSelected && feature !== "None";
                const checked = field.value.includes(feature);

                const checkboxId = `lot-${feature
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={feature} className="mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (feature === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherLotFeatures", "", {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            } else {
                              field.onChange([]);
                            }
                            return;
                          }

                          const current = field.value.filter(
                            (s: string) => s !== "None"
                          );

                          const next = isChecked
                            ? [...current, feature]
                            : current.filter((s: string) => s !== feature);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""
                          }`}
                      >
                        {feature}
                      </label>
                    </div>
                    {feature === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other lot feature (40 chars max)"
                          {...register("otherLotFeatures")}
                          error={!!errors.otherLotFeatures}
                          errorMessage={errors.otherLotFeatures?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherLotFeatures.length}/40 characters
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
}
