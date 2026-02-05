import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../../../../../../../components/ui/label";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { PET_POLICIES } from "../../../../../../../constants/real-estate-options";
import { IPricingForm } from "./pricing";

export function PetPolicy() {
  const { control } = useFormContext<IPricingForm>();

  return (
    <div>
      <Label className="text-sm font-medium">Pet Policy</Label>

      <Controller
        control={control}
        name="petPolicy"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {PET_POLICIES.map((policy) => {
              const checked = (field.value ?? []).includes(policy);

              return (
                <div
                  key={`policy-${policy}`}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`policy-${policy}`}
                    checked={checked}
                    onCheckedChange={(v) => {
                      const isChecked = v === true;

                      if (policy === "No pets") {
                        field.onChange(isChecked ? ["No pets"] : []);
                        return;
                      }

                      const current = field.value.filter(
                        (s: string) => s !== "No pets"
                      );

                      const next = isChecked
                        ? [...current, policy]
                        : current.filter((s: string) => s !== policy);

                      field.onChange(next);
                    }}
                  />
                  <Label htmlFor={`policy-${policy}`} className="text-sm mb-0">
                    {policy}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
