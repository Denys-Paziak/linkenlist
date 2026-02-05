"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { SMART_DEVICES } from "../../../../../../../constants/real-estate-options";
import { IUtilitiesEnergyConnectivityForm } from "./utilities-energy-connectivity";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";

export function SmartDevices() {
  const { register, control, setValue } =
    useFormContext<IUtilitiesEnergyConnectivityForm>();

  const { errors } = useFormState({
    control,
    name: ["otherSmartDevices"],
  });

  const otherSmartDevices = useWatch({
    control,
    name: "otherSmartDevices",
  });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Smart Devices
      </h4>
      <Controller
        control={control}
        name="energyFeatures"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {SMART_DEVICES.map((device) => {
                const isDisabled = isNoneSelected && device !== "None";
                const checked = field.value.includes(device);

                const checkboxId = `smart-${device
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={device} className="mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (device === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherSmartDevices", "", {
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
                            ? [...current, device]
                            : current.filter((s: string) => s !== device);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""
                          }`}
                      >
                        {device}
                      </label>
                    </div>
                    {device === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other smart device (40 chars max)"
                          {...register("otherSmartDevices")}
                          error={!!errors.otherSmartDevices}
                          errorMessage={errors.otherSmartDevices?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherSmartDevices.length}/40 characters
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
