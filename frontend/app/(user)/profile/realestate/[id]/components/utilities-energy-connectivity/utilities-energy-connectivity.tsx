"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { Basic } from "./basic";
import { UtilitiesAvailable } from "./utilities-available";
import { EnergyFeatures } from "./energy-features";
import { InternetOptions } from "./internet-options";
import { SmartDevices } from "./smart-devices";
import { zodResolver } from "@hookform/resolvers/zod";
import { utilitiesEnergyConnectivityFormSchema } from "../../../../../../../lib/schemas/realestate/utilities-energy-connectivity-form-schema";
import { IOwnerRealestate } from "../../../../../../../types/Realestate";
import { FormHandle, otherFieldSplit } from "../../page";

export interface IUtilitiesEnergyConnectivityForm {
  water: string;
  sewer: string;
  utilitiesAvailable: string[];
  otherUtilitiesAvailable: string;
  energyFeatures: string[];
  otherEnergyFeatures: string;
  internetOptions: string[];
  otherInternetOptions: string;
  downloadSpeed: string;
  cellularNotes: string;
  smartDevices: string[];
  otherSmartDevices: string;
}

export const UtilitiesEnergyConnectivity = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function UtilitiesEnergyConnectivity({ data }, ref) {
  const [expandedSections, setExpandedSections] = useState(false);
  const form = useForm<IUtilitiesEnergyConnectivityForm>({
    resolver: zodResolver(utilitiesEnergyConnectivityFormSchema),
    values: {
      water: data?.water || "",
      sewer: data?.sewer || "",
      ...otherFieldSplit(
        "utilitiesAvailable",
        data?.utilitiesAvailable || undefined
      ),
      ...otherFieldSplit("energyFeatures", data?.energyFeatures || undefined),
      downloadSpeed: data?.downloadSpeed || "",
      cellularNotes: data?.cellularNotes || "",
      ...otherFieldSplit("internetOptions", data?.internetOptions || undefined),
      ...otherFieldSplit("smartDevices", data?.smartDevices || undefined),
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
            utilitiesEnergyConnectivity: {
              water: values.water === "" ? null : values.water,
              sewer: values.sewer === "" ? null : values.sewer,
              utilitiesAvailable: [
                ...values.utilitiesAvailable,
                values.otherUtilitiesAvailable,
              ].filter(Boolean),
              energyFeatures: [
                ...values.energyFeatures,
                values.otherEnergyFeatures,
              ].filter(Boolean),
              downloadSpeed:
                values.downloadSpeed === "" ? null : values.downloadSpeed,
              cellularNotes:
                values.cellularNotes === "" ? null : values.cellularNotes,
              internetOptions: [
                ...values.internetOptions,
                values.otherInternetOptions,
              ].filter(Boolean),
              smartDevices: [
                ...values.smartDevices,
                values.otherSmartDevices,
              ].filter(Boolean),
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
              Utilities, Energy & Connectivity
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
            <Basic />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-6">
                <UtilitiesAvailable />

                <EnergyFeatures />
              </div>

              <div className="space-y-6">
                <InternetOptions />

                <SmartDevices />
              </div>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
});
