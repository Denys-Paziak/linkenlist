'use client'

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { FENCING_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IOutdoorFeaturesForm } from "./outdoor-features";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";

export function Fencing() {
  const { register, control, setValue } = useFormContext<IOutdoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherFencing"],
  });

  const otherFencing = useWatch({ control, name: "otherFencing" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Fencing
      </h4>
      <Controller
        control={control}
        name="fencing"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {FENCING_OPTIONS.map((fence) => {
                const isDisabled = isNoneSelected && fence !== "None";
                const checked = field.value.includes(fence);

                const checkboxId = `fence-${fence
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={fence}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (fence === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherFencing", "", {
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
                            ? [...current, fence]
                            : current.filter((s: string) => s !== fence);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        {fence}
                      </label>
                    </div>
                    {fence === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other fencing type (40 chars max)"
                          {...register("otherFencing")}
                          error={!!errors.otherFencing}
                          errorMessage={errors.otherFencing?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherFencing.length}/40 characters
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
