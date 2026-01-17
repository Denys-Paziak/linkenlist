"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { IIndoorFeaturesForm } from "./indoor-features";
import { FLOORING_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";

export function Flooring() {
  const { register, control, setValue } = useFormContext<IIndoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherFlooring"],
  });

  const otherFlooring = useWatch({ control, name: "otherFlooring" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Flooring
      </h4>
      <Controller
        control={control}
        name="flooring"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {FLOORING_OPTIONS.map((floor) => {
                const isDisabled = isNoneSelected && floor !== "None";
                const checked = field.value.includes(floor);

                const checkboxId = `floor-${floor
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={floor}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                           if (floor === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherFlooring", "", {
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
                            ? [...current, floor]
                            : current.filter((s: string) => s !== floor);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        {floor}
                      </label>
                    </div>
                    {floor === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other flooring type (40 chars max)"
                          {...register("otherFlooring")}
                          error={!!errors.otherFlooring}
                          errorMessage={errors.otherFlooring?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherFlooring.length}/40 characters
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
