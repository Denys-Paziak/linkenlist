"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { HEATING_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IIndoorFeaturesForm } from "./indoor-features";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function Heating() {
  const { register, control, setValue } = useFormContext<IIndoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherHeating"],
  });

  const otherHeating = useWatch({ control, name: "otherHeating" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Heating
      </h4>
      <Controller
        control={control}
        name="heating"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {HEATING_OPTIONS.map((heat) => {
                const isDisabled = isNoneSelected && heat !== "None";
                const checked = field.value.includes(heat);

                const checkboxId = `heat-${heat
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={heat}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (heat === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherHeating", "", {
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
                            ? [...current, heat]
                            : current.filter((s: string) => s !== heat);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""
                          }`}
                      >
                        {heat}
                      </label>
                    </div>
                    {heat === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other heating type (40 chars max)"
                          {...register("otherHeating")}
                          error={!!errors.otherHeating}
                          errorMessage={errors.otherHeating?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherHeating.length}/40 characters
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
