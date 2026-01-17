import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { IUtilitiesEnergyConnectivityForm } from "./utilities-energy-connectivity";
import { UTILITIES_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Input } from "../../../../../../../components/ui/input";

export function UtilitiesAvailable() {
  const { register, control, setValue } =
    useFormContext<IUtilitiesEnergyConnectivityForm>();

  const { errors } = useFormState({
    control,
    name: ["otherUtilitiesAvailable"],
  });

  const otherUtilitiesAvailable = useWatch({
    control,
    name: "otherUtilitiesAvailable",
  });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Utilities Available
      </h4>
      <Controller
        control={control}
        name="utilitiesAvailable"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {UTILITIES_OPTIONS.map((utility) => {
                const isDisabled = isNoneSelected && utility !== "None";
                const checked = field.value.includes(utility);

                const checkboxId = `utility-${utility
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={utility}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (utility === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherUtilitiesAvailable", "", {
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
                            ? [...current, utility]
                            : current.filter((s: string) => s !== utility);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={`utility-${utility.toLowerCase()}`}
                        className={`text-sm font-medium ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        {utility}
                      </label>
                    </div>
                    {utility === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other utility (40 chars max)"
                          {...register("otherUtilitiesAvailable")}
                          error={!!errors.otherUtilitiesAvailable}
                          errorMessage={errors.otherUtilitiesAvailable?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherUtilitiesAvailable.length}/40 characters
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
