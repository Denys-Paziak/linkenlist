"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { INTERNET_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IUtilitiesEnergyConnectivityForm } from "./utilities-energy-connectivity";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";

export function InternetOptions() {
  const { register, control, setValue } =
    useFormContext<IUtilitiesEnergyConnectivityForm>();

  const { errors } = useFormState({
    control,
    name: ["otherInternetOptions"],
  });

  const otherInternetOptions = useWatch({
    control,
    name: "otherInternetOptions",
  });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Internet Options
      </h4>
      <Controller
        control={control}
        name="energyFeatures"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {INTERNET_OPTIONS.map((option) => {
                const isDisabled = isNoneSelected && option !== "None";
                const checked = field.value.includes(option);

                const checkboxId = `internet-${option
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={option}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (option === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherInternetOptions", "", {
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
                            ? [...current, option]
                            : current.filter((s: string) => s !== option);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={`internet-${option.toLowerCase()}`}
                        className={`text-sm font-medium ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        {option}
                      </label>
                    </div>
                    {option === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other internet option (40 chars max)"
                          {...register("otherInternetOptions")}
                          error={!!errors.otherInternetOptions}
                          errorMessage={errors.otherInternetOptions?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherInternetOptions.length}/40 characters
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
