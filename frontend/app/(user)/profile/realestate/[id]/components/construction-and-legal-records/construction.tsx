"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { CONSTRUCTION_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IConstructionForm } from "./construction-and-legal-records";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function Construction() {
  const { register, control, setValue } = useFormContext<IConstructionForm>();

  const { errors } = useFormState({
    control,
    name: ["otherConstruction"],
  });

  const otherConstruction = useWatch({ control, name: "otherConstruction" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Construction
      </h4>
      <Controller
        control={control}
        name="construction"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {CONSTRUCTION_OPTIONS.map((construction) => {
                const isDisabled = isNoneSelected && construction !== "None";
                const checked = field.value.includes(construction);

                const checkboxId = `construction-${construction
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={construction}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (construction === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherConstruction", "", {
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
                            ? [...current, construction]
                            : current.filter((s: string) => s !== construction);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className="text-sm font-medium"
                      >
                        {construction}
                      </label>
                    </div>
                    {construction === "Other" &&
                      field.value.includes("Other") && (
                        <div className="ml-6 mt-2">
                          <Input
                            placeholder="Specify other construction type (40 chars max)"
                            {...register("otherConstruction")}
                            error={!!errors.otherConstruction}
                            errorMessage={errors.otherConstruction?.message}
                            className="bg-gray-50 text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {otherConstruction.length}/40 characters
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
