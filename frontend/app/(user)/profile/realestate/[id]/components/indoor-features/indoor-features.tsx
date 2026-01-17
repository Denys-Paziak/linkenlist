"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { Flooring } from "./flooring";
import { Heating } from "./heating";
import { Cooling } from "./cooling";
import { Appliances } from "./appliances";
import { LaundryFeatures } from "./laundry-features";
import { PremiumFeatures } from "./premium-features";
import { SpecialFeatures } from "./special-features";
import { zodResolver } from "@hookform/resolvers/zod";
import { indoorFeaturesFormSchema } from "../../../../../../../lib/schemas/realestate/indoor-features-form-schema";
import {
  EPackageType,
  IOwnerRealestate,
} from "../../../../../../../types/Realestate";
import { FormHandle, otherFieldSplit } from "../../page";

export interface IIndoorFeaturesForm {
  flooring: string[];
  otherFlooring: string;
  heating: string[];
  otherHeating: string;
  cooling: string[];
  otherCooling: string;
  appliances: string[];
  otherAppliances: string;
  laundryFeatures: string[];
  otherLaundryFeatures: string;
  premiumFeatures: string;
  specialFeatures: string[];
}

export const IndoorFeatures = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function IndoorFeatures({ data }, ref) {
  const [expandedSections, setExpandedSections] = useState(false);

  const form = useForm<IIndoorFeaturesForm>({
    resolver: zodResolver(indoorFeaturesFormSchema),
    values: {
      ...otherFieldSplit("flooring", data?.flooring || undefined),
      ...otherFieldSplit("heating", data?.heating || undefined),
      ...otherFieldSplit("cooling", data?.cooling || undefined),
      ...otherFieldSplit("appliances", data?.appliances || undefined),
      ...otherFieldSplit("laundryFeatures", data?.laundryFeatures || undefined),
      premiumFeatures: data?.premiumFeatures || "",
      specialFeatures: data?.specialFeatures || ["", "", "", ""],
    },
    mode: "onBlur",
  });

  const { isDirty } = useFormState({ control: form.control });

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        if (!isDirty) {
          return { ok: true, changed: false as const, data: undefined };
        }

        const ok = await form.trigger();
        if (!ok) return { ok: false as const };

        const values = form.getValues();

        return {
          ok: true as const,
          changed: true as const,
          data: {
            indoorFeatures: {
              flooring: [
                ...values.flooring,
                values.otherFlooring && "OTHER:::" + values.otherFlooring,
              ].filter(Boolean),
              heating: [
                ...values.heating,
                values.otherHeating && "OTHER:::" + values.otherHeating,
              ].filter(Boolean),
              cooling: [
                ...values.cooling,
                values.otherCooling && "OTHER:::" + values.otherCooling,
              ].filter(Boolean),
              appliances: [
                ...values.appliances,
                values.otherAppliances && "OTHER:::" + values.otherAppliances,
              ].filter(Boolean),
              laundryFeatures: [
                ...values.laundryFeatures,
                values.otherLaundryFeatures &&
                  "OTHER:::" + values.otherLaundryFeatures,
              ].filter(Boolean),
              premiumFeatures:
                values.premiumFeatures === "" ? null : values.premiumFeatures,
              specialFeatures: values.specialFeatures.map((item) =>
                item === "" ? null : item
              ),
            },
          },
        };
      },
      resetDirty: () => {
        form.reset(form.getValues(), {
          keepValues: true,
        });
      },
    }),
    [form, isDirty]
  );

  return (
    <FormProvider {...form}>
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <button
          type="button"
          onClick={() => setExpandedSections((state) => !state)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Indoor Features & Extra
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              These fields are not required to place your order and may be
              completed at a later date in your account
            </p>
          </div>
          {expandedSections ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-6">
                <Flooring />

                <Heating />

                <Cooling />
              </div>

              <div className="space-y-6">
                <Appliances />

                <LaundryFeatures />

                {data?.package === EPackageType.PREMIUM && <PremiumFeatures />}

                <SpecialFeatures />
              </div>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
});
