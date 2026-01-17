import { Controller, useFormContext, useFormState } from "react-hook-form";
import { Input } from "../../../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import { POOL_OPTIONS } from "../../../../../../../constants/real-estate-options";
import { IOutdoorFeaturesForm } from "./outdoor-features";

export function AdditionalDetails() {
  const { register, control } = useFormContext<IOutdoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["garageSpaces", "drivewaySpaces", "lotSize"],
  });

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700">
        Additional Details
      </h4>

      <div className="space-y-2">
        <Controller
          control={control}
          name="poolType"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pool Type" />
              </SelectTrigger>
              <SelectContent>
                {POOL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            placeholder="Garage Spaces"
            {...register("garageSpaces")}
            error={!!errors.garageSpaces}
            errorMessage={errors.garageSpaces?.message}
            className="bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Driveway Spaces"
            {...register("drivewaySpaces")}
            error={!!errors.drivewaySpaces}
            errorMessage={errors.drivewaySpaces?.message}
            className="bg-gray-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Lot Size (e.g., 0.25 acres, 10,000 sqft)"
          {...register("lotSize")}
          error={!!errors.lotSize}
          errorMessage={errors.lotSize?.message}
          className="bg-gray-50"
        />
      </div>
    </div>
  );
}
