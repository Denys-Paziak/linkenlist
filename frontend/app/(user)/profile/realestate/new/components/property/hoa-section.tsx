"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { Label } from "../../../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import {
  HOA_FREQUENCIES,
  SERVICES_INCLUDED,
} from "../../../../../../../constants/real-estate-options";
import { IPropertyForm } from "./property";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function HoaSection() {
  const { control } = useFormContext<IPropertyForm>();

  const hoaPresent = useWatch({ control, name: "hoaPresent" });

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="hoaPresent"
          render={({ field }) => (
            <Checkbox
              id="hoaPresent"
              checked={!!field.value}
              onCheckedChange={(c) => field.onChange(!!c)}
            />
          )}
        />
        <Label htmlFor="hoaPresent" className="mb-0">
          HOA Present
        </Label>
      </div>

      {hoaPresent && <HoaFields />}
    </div>
  );
}

function HoaFields() {
  const { control, register } = useFormContext<IPropertyForm>();

  const { errors } = useFormState({
    control,
    name: ["hoaFee", "otherServicesIncluded", "hoaFrequency"],
  });

  const otherServicesIncluded = useWatch({
    control,
    name: "otherServicesIncluded",
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="HOA Fee (amount) *"
          requiredMark
          {...register("hoaFee")}
          error={!!errors.hoaFee}
          errorMessage={errors.hoaFee?.message}
        />
        <div>
          <Controller
            control={control}
            name="hoaFrequency"
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(e) => {
                  field.onChange(e)
                  field.onBlur()
                }}
              >
                <SelectTrigger className={errors.hoaFrequency ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select frequency *" />
                </SelectTrigger>
                <SelectContent>
                  {HOA_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq} value={freq.toLocaleLowerCase()}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Services Included</Label>

        <Controller
          control={control}
          name="servicesIncluded"
          render={({ field }) => (
            <div>
              {SERVICES_INCLUDED.map((service) => {
                const checked = (field.value ?? []).includes(service);
                return (
                  <div key={service}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service}`}
                        checked={checked}
                        onCheckedChange={() => {
                          const current = field.value ?? [];
                          const next = current.includes(service)
                            ? current.filter((s: string) => s !== service)
                            : [...current, service];
                          field.onChange(next);
                        }}
                      />
                      <Label
                        htmlFor={`service-${service}`}
                        className="text-sm mb-0"
                      >
                        {service}
                      </Label>
                    </div>
                    {service === "Other" && field.value.includes("Other") && (
                      <div className="ml-6 mt-2">
                        <Input
                          placeholder="Specify other outdoor space (40 chars max)"
                          {...register("otherServicesIncluded")}
                          error={!!errors.otherServicesIncluded}
                          errorMessage={errors.otherServicesIncluded?.message}
                          className="bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {otherServicesIncluded.length}/40 characters
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        />
      </div>
    </div>
  );
}
