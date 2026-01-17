"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { Construction } from "./construction";
import { NewConstruction } from "./new-construction";
import { LegalRecords } from "./legal-records";
import { zodResolver } from "@hookform/resolvers/zod";
import { constructionFormSchema } from "../../../../../../../lib/schemas/realestate/construction-form-schema";
import { IOwnerRealestate } from "../../../../../../../types/Realestate";
import { FormHandle, otherFieldSplit } from "../../page";

export interface IConstructionForm {
  construction: string[];
  otherConstruction: string;
  newConstruction: boolean;
  builder: string;
  zoning: string;
  parcelApn: string;
  ownershipType: string;
  listingAgreement: string;
  dateOnMarket: string;
}

export const ConstructionAndLegalRecords = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function ConstructionAndLegalRecords({ data }, ref) {
  const [expandedSections, setExpandedSections] = useState(false);

  const form = useForm<IConstructionForm>({
    resolver: zodResolver(constructionFormSchema),
    values: {
      ...otherFieldSplit("construction", data?.construction || undefined),
      newConstruction: data?.newConstruction || false,
      builder: data?.builder || "",
      zoning: data?.zoning || "",
      parcelApn: data?.parcelApn || "",
      ownershipType: data?.ownershipType || "",
      listingAgreement: data?.listingAgreement || "",
      dateOnMarket: data?.dateOnMarket || "",
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
            constructionAndLegalRecords: {
              construction: [
                ...values.construction,
                values.otherConstruction &&
                  "OTHER:::" + values.otherConstruction,
              ].filter(Boolean),
              newConstruction: values.newConstruction,
              builder: values.builder === "" ? null : values.builder,
              zoning: values.zoning === "" ? null : values.zoning,
              parcelApn: values.parcelApn === "" ? null : values.parcelApn,
              ownershipType:
                values.ownershipType === "" ? null : values.ownershipType,
              listingAgreement:
                values.listingAgreement === "" ? null : values.listingAgreement,
              dateOnMarket:
                values.dateOnMarket === "" ? null : values.dateOnMarket,
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
              Construction & Legal Records
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
              <div className="space-y-4">
                <Construction />

                <NewConstruction />
              </div>

              <LegalRecords />
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
});
