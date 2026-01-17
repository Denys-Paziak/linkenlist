"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";
import { LAUNDRY_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IIndoorFeaturesForm } from "./indoor-features";

export function LaundryFeatures() {
  const { register, control, setValue } = useFormContext<IIndoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherLaundryFeatures"],
  });

  const otherLaundryFeatures = useWatch({
    control,
    name: "otherLaundryFeatures",
  });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Laundry Features
      </h4>
      <Controller
        control={control}
        name="laundryFeatures"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {LAUNDRY_OPTIONS.map((laundry) => {
                const isDisabled = isNoneSelected && laundry !== "None";
                const checked = field.value.includes(laundry);

                const checkboxId = `laundry-${laundry
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={laundry}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (laundry === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherLaundryFeatures", "", {
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
                            ? [...current, laundry]
                            : current.filter((s: string) => s !== laundry);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        {laundry}
                      </label>
                    </div>
                    {laundry === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other laundry feature (40 chars max)"
                          {...register("otherLaundryFeatures")}
                          error={!!errors.otherLaundryFeatures}
                          errorMessage={errors.otherLaundryFeatures?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherLaundryFeatures.length}/40 characters
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
