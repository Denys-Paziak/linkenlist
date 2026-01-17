"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { VIEW_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IOutdoorFeaturesForm } from "./outdoor-features";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";

export function View() {
  const { register, control, setValue } =
    useFormContext<IOutdoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherView"],
  });

  const otherView = useWatch({ control, name: "otherView" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        View
      </h4>
      <Controller
        control={control}
        name="view"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {VIEW_OPTIONS.map((view) => {
                const isDisabled = isNoneSelected && view !== "None";
                const checked = field.value.includes(view);

                const checkboxId = `view-${view
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={view}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (view === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherView", "", {
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
                            ? [...current, view]
                            : current.filter((s: string) => s !== view);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        {view}
                      </label>
                    </div>
                    {view === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other view type (40 chars max)"
                          {...register("otherView")}
                          error={!!errors.otherView}
                          errorMessage={errors.otherView?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherView.length}/40 characters
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
