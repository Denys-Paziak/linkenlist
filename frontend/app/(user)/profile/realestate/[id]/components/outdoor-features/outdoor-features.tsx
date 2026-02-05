"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  FormProvider,
  useForm,
  useFormState,
} from "react-hook-form";
import { OutdoorSpaces } from "./outdoor-spaces";
import { Fencing } from "./fencing";
import { View } from "./view";
import { ParkingType } from "./parking-type";
import { LotFeatures } from "./lot-features";
import { AdditionalDetails } from "./additional-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { outdoorFeaturesFormSchema } from "../../../../../../../lib/schemas/realestate/outdoor-features-form-schema";
import { IOwnerRealestate } from "../../../../../../../types/Realestate";
import { FormHandle, otherFieldSplit } from "../../page";

export interface IOutdoorFeaturesForm {
  outdoorSpaces: string[];
  otherOutdoorSpaces: string;
  fencing: string[];
  otherFencing: string;
  view: string[];
  otherView: string;
  parkingType: string[];
  otherParkingType: string;
  poolType: string;
  garageSpaces: string;
  drivewaySpaces: string;
  lotSize: string;
  lotFeatures: string[];
  otherLotFeatures: string;
}

export const OutdoorFeatures = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function OutdoorFeatures({ data }, ref) {
  const [expandedSections, setExpandedSections] = useState(true);

  const form = useForm<IOutdoorFeaturesForm>({
    resolver: zodResolver(outdoorFeaturesFormSchema),
    values: {
      ...otherFieldSplit("outdoorSpaces", data?.outdoorSpaces || undefined),
      poolType: data?.poolType || "",
      ...otherFieldSplit("fencing", data?.fencing || undefined),
      ...otherFieldSplit("view", data?.view || undefined),
      ...otherFieldSplit("parkingType", data?.parkingType || undefined),
      garageSpaces: data?.garageSpaces || "",
      drivewaySpaces: data?.drivewaySpaces || "",
      lotSize: data?.lotSize || "",
      ...otherFieldSplit("lotFeatures", data?.lotFeatures || undefined),
    },
    mode: "onBlur",
  });

  const { isDirty } = useFormState({ control: form.control });

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        const ok = await form.trigger();
        if (!ok) return { ok: false as const };

        if (!isDirty) {
          return { ok: true, changed: false as const, data: undefined };
        }

        const values = form.getValues();

        return {
          ok: true as const,
          changed: true as const,
          data: {
            outdoorFeatures: {
              outdoorSpaces: [
                ...values.outdoorSpaces,
                values.otherOutdoorSpaces &&
                "OTHER:::" + values.otherOutdoorSpaces,
              ].filter(Boolean),
              poolType: values.poolType === "" ? null : values.poolType,
              fencing: [
                ...values.fencing,
                values.otherFencing && "OTHER:::" + values.otherFencing,
              ].filter(Boolean),
              view: [...values.view, values.otherView].filter(Boolean),
              parkingType: [
                ...values.parkingType,
                values.otherParkingType && "OTHER:::" + values.otherParkingType,
              ].filter(Boolean),
              garageSpaces:
                values.garageSpaces === "" ? null : values.garageSpaces,
              drivewaySpaces:
                values.drivewaySpaces === "" ? null : values.drivewaySpaces,
              lotFeatures: [
                ...values.lotFeatures,
                values.otherLotFeatures && "OTHER:::" + values.otherLotFeatures,
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
              Outdoor Features
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
                <OutdoorSpaces />

                <Fencing />

                <View />
              </div>

              <div className="space-y-6">
                <ParkingType />

                <LotFeatures />

                <AdditionalDetails />
              </div>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
});
