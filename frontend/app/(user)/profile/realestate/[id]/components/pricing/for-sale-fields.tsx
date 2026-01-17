"use client";

import { useFormContext, useFormState } from "react-hook-form";
import { Input } from "../../../../../../../components/ui/input";
import { IPricingForm } from "./pricing";

export function ForSaleFields() {
  const { register, control } = useFormContext<IPricingForm>();

  const { errors } = useFormState({
    control,
    name: ["listPrice"],
  });

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50/30">
      <Input
        type="number"
        placeholder="List Price"
        {...register("listPrice")}
        error={!!errors.listPrice}
        errorMessage={errors.listPrice?.message}
        className="mt-1"
      />
    </div>
  );
}
