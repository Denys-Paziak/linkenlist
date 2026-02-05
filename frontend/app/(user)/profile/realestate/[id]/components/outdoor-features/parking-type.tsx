"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { PARKING_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IOutdoorFeaturesForm } from "./outdoor-features";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function ParkingType() {
  const { register, control, setValue } =
    useFormContext<IOutdoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherParkingType"],
  });

  const otherParkingType = useWatch({ control, name: "otherParkingType" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Parking Type
      </h4>
      <Controller
        control={control}
        name="parkingType"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {PARKING_OPTIONS.map((parking) => {
                const isDisabled = isNoneSelected && parking !== "None";
                const checked = field.value.includes(parking);

                const checkboxId = `parking-${parking
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={parking}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (parking === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherParkingType", "", {
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
                            ? [...current, parking]
                            : current.filter((s: string) => s !== parking);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""}`}
                      >
                        {parking}
                      </label>
                    </div>
                    {parking === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other parking type (40 chars max)"
                          {...register("otherParkingType")}
                          error={!!errors.otherParkingType}
                          errorMessage={errors.otherParkingType?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherParkingType.length}/40 characters
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
