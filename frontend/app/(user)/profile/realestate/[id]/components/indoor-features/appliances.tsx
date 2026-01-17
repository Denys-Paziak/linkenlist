'use client'

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";
import { APPLIANCES_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IIndoorFeaturesForm } from "./indoor-features";

export function Appliances() {
  const { register, control, setValue } = useFormContext<IIndoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherAppliances"],
  });

  const otherAppliances = useWatch({ control, name: "otherAppliances" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Appliances
      </h4>
      <Controller
        control={control}
        name="appliances"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {APPLIANCES_OPTIONS.map((appliance) => {
                const isDisabled = isNoneSelected && appliance !== "None";
                const checked = field.value.includes(appliance);

                const checkboxId = `appliance-${appliance
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={appliance}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (appliance === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherAppliances", "", {
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
                            ? [...current, appliance]
                            : current.filter((s: string) => s !== appliance);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        {appliance}
                      </label>
                    </div>
                    {appliance === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other appliance (40 chars max)"
                          {...register("otherAppliances")}
                          error={!!errors.otherAppliances}
                          errorMessage={errors.otherAppliances?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherAppliances.length}/40 characters
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
