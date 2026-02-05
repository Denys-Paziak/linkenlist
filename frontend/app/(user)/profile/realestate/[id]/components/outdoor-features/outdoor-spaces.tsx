import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { OUTDOOR_SPACES_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IOutdoorFeaturesForm } from "./outdoor-features";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function OutdoorSpaces() {
  const { register, control, setValue } =
    useFormContext<IOutdoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["otherOutdoorSpaces"],
  });

  const otherOutdoorSpaces = useWatch({ control, name: "otherOutdoorSpaces" });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
        Outdoor Spaces
      </h4>
      <Controller
        control={control}
        name="outdoorSpaces"
        render={({ field }) => {
          const isNoneSelected = field.value.includes("None");

          return (
            <div>
              {OUTDOOR_SPACES_OPTIONS.map((space) => {
                const isDisabled = isNoneSelected && space !== "None";
                const checked = field.value.includes(space);

                const checkboxId = `outdoor-${space
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={space}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(v) => {
                          const isChecked = v === true;

                          if (space === "None") {
                            if (isChecked) {
                              field.onChange(["None"]);

                              setValue("otherOutdoorSpaces", "", {
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
                            ? [...current, space]
                            : current.filter((s: string) => s !== space);

                          field.onChange(next);
                        }}
                      />
                      <label
                        htmlFor={checkboxId}
                        className={`text-sm font-medium ${isDisabled ? "text-gray-400" : ""
                          }`}
                      >
                        {space}
                      </label>
                    </div>
                    {space === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other outdoor space (40 chars max)"
                          {...register("otherOutdoorSpaces")}
                          error={!!errors.otherOutdoorSpaces}
                          errorMessage={errors.otherOutdoorSpaces?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherOutdoorSpaces.length}/40 characters
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
