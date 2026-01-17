'use client'

import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { Input } from "../../../../../../../components/ui/input";
import { IIndoorFeaturesForm } from "./indoor-features";

export function SpecialFeatures() {
  const { register, control } = useFormContext<IIndoorFeaturesForm>();

  const { errors } = useFormState({
    control,
    name: ["specialFeatures"],
  });

  const specialFeatures = useWatch({
    control,
    name: "specialFeatures",
  });

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700">Special Features</h4>
      <p className="text-xs text-gray-600">
        Add up to 4 special features (20 characters each)
      </p>

      {Array.from({ length: 4 }).map((_, i) => {
        const err = errors.specialFeatures?.[i];

        return (
          <div key={i} className="space-y-2">
            <Input
              placeholder={`Special feature ${i + 1} (20 chars max)`}
              {...register(`specialFeatures.${i}`)}
              error={!!err}
              errorMessage={err?.message}
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              {(specialFeatures?.[i]?.length || 0)}/20 characters
            </p>
          </div>
        );
      })}
    </div>
  );
}
