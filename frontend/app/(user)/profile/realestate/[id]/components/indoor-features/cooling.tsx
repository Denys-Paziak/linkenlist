"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { COOLING_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IIndoorFeaturesForm } from "./indoor-features";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";

export function Cooling() {
  const { register, control, setValue } = useFormContext<IIndoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherCooling"],
  });

  const otherCooling = useWatch({ control, name: "otherCooling" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Cooling
      </h4>
      <Controller
        control={control}
        name="cooling"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {COOLING_OPTIONS.map((cool) => {
                const isDisabled = isNoneSelected && cool !== "None";
                const checked = field.value.includes(cool);

                const checkboxId = `cool-${cool
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={cool}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (cool === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherCooling", "", {
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
                            ? [...current, cool]
                            : current.filter((s: string) => s !== cool);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        {cool}
                      </label>
                    </div>
                    {cool === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other cooling type (40 chars max)"
                          {...register("otherCooling")}
                          error={!!errors.otherCooling}
                          errorMessage={errors.otherCooling?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherCooling.length}/40 characters
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
