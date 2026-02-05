'use client'

import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { IIndoorFeaturesForm } from "./indoor-features";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function PremiumFeatures() {
  const { register, control } = useFormContext<IIndoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["premiumFeatures"],
  });

  const premiumFeatures = useWatch({
    control,
    name: "premiumFeatures",
  });

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700">
        Premium Features "premium"
      </h4>

      <div className="space-y-2">
        <Input
          placeholder="Red visibility tag (20 chars max)"
          {...register("premiumFeatures")}
          error={!!errors.premiumFeatures}
          errorMessage={errors.premiumFeatures?.message}
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">
          {premiumFeatures.length}/20 characters
        </p>
      </div>
    </div>
  );
}
