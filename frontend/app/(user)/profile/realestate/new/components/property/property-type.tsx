'use client'

import { Controller, useFormContext, useFormState } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import { PROPERTY_TYPES } from "../../../../../../../constants/real-estate-options";
import { Label } from "../../../../../../../components/ui/label";
import { IPropertyForm } from "./property";

export function PropertyType() {
  const { control } = useFormContext<IPropertyForm>();

  const { errors } = useFormState({
    control,
    name: ["propertyType"],
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="propertyType">
        Property Type <span className="text-red-500">*</span>
      </Label>

      <Controller
        control={control}
        name="propertyType"
        render={({ field }) => (
          <Select value={field.value || ""} onValueChange={(e) => {
            field.onChange(e)
            field.onBlur()
          }}>
            <SelectTrigger className={errors.propertyType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
