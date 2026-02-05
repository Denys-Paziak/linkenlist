'use client'

import {
  Controller,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { IConstructionForm } from "./construction-and-legal-records";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function NewConstruction() {
  const { register, control } = useFormContext<IConstructionForm>();

  const { errors } = useFormState({
    control,
    name: ["builder"],
  });

  return (
    <>
      <div className="space-y-2">
        <Controller
          control={control}
          name="newConstruction"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newConstruction"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
              <label htmlFor="newConstruction" className="text-sm font-medium">
                New Construction
              </label>
            </div>
          )}
        />
      </div>

      <Input
        placeholder="Builder Name"
        {...register("builder")}
        error={!!errors.builder}
        errorMessage={errors.builder?.message}
        className="bg-gray-50"
      />
    </>
  );
}
