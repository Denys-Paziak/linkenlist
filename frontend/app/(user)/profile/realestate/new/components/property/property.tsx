"use client";

import {
  FormProvider,
  useForm,
  useFormState,
} from "react-hook-form";
import { PropertyType } from "./property-type";
import { HoaSection } from "./hoa-section";
import { forwardRef, useImperativeHandle } from "react";
import { FormHandle, otherFieldSplit } from "../../page";
import { IOwnerRealestate } from "../../../../../../../types/Realestate";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema } from "../../../../../../../lib/schemas/realestate/property-form-schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../components/ui/card";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export type IPropertyForm = {
  propertyType: string;
  bedrooms: string;
  bathroomsFull: string;
  bathroomsHalf: string;
  interiorSize: string;
  yearBuilt: string;
  stories: string;
  architecturalStyle: string;

  hoaPresent: boolean;
  hoaFee: string;
  hoaFrequency: string;
  servicesIncluded: string[];
  otherServicesIncluded: string;
};

export const Property = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function Property({ data }, ref) {
  const form = useForm<IPropertyForm>({
    resolver: zodResolver(propertyFormSchema),
    values: {
      propertyType: data?.propertyType || "",
      bedrooms: String(data?.bedrooms ?? ""),
      bathroomsFull: String(data?.bathroomsFull ?? ""),
      bathroomsHalf: String(data?.bathroomsHalf ?? ""),
      interiorSize: String(data?.interiorSize ?? ""),
      yearBuilt: String(data?.yearBuilt || ""),
      stories: String(data?.stories || ""),
      architecturalStyle: data?.architecturalStyle || "",

      hoaPresent: data?.hoaPresent || false,
      hoaFee: String(data?.hoaFee || ""),
      hoaFrequency: data?.hoaFrequency || "",
      ...otherFieldSplit(
        "servicesIncluded",
        data?.servicesIncluded || undefined
      ),
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
            property: {
              propertyType: values.propertyType,
              bedrooms: values.bedrooms === "" ? null : Number(values.bedrooms),
              bathroomsFull:
                values.bathroomsFull === ""
                  ? null
                  : Number(values.bathroomsFull),
              bathroomsHalf:
                values.bathroomsHalf === ""
                  ? null
                  : Number(values.bathroomsHalf),
              interiorSize:
                values.interiorSize === "" ? null : Number(values.interiorSize),
              yearBuilt:
                values.yearBuilt === "" ? null : Number(values.yearBuilt),
              stories: values.stories === "" ? null : Number(values.stories),
              architecturalStyle:
                values.architecturalStyle === ""
                  ? null
                  : values.architecturalStyle,
              hoaPresent: values.hoaPresent,
              hoaFee: values.hoaFee === "" ? null : Number(values.hoaFee),
              hoaFrequency:
                values.hoaFrequency === "" ? null : values.hoaFrequency,
              servicesIncluded: [
                ...values.servicesIncluded,
                values.otherServicesIncluded &&
                "OTHER:::" + values.otherServicesIncluded,
              ].filter(Boolean),
            },
          },
        };
      },
      setError: (fields) => {
        if (fields.includes("propertyType"))
          form.setError("propertyType", {
            message: "Property Type is required",
          });
        if (fields.includes("bedrooms"))
          form.setError("bedrooms", { message: "Bedrooms is required" });
        if (fields.includes("bathroomsFull"))
          form.setError("bathroomsFull", {
            message: "Bathrooms Full is required",
          });
        if (fields.includes("bathroomsHalf"))
          form.setError("bathroomsHalf", {
            message: "Bathrooms Half is required",
          });
        if (fields.includes("interiorSize"))
          form.setError("interiorSize", {
            message: "Interior Size is required",
          });
        if (fields.includes("hoaFee"))
          form.setError("hoaFee", {
            message: "Either fill in the HOA Fee or turn off HOA Present",
          });
        if (fields.includes("hoaFrequency"))
          form.setError("hoaFrequency", {
            message: "Either fill in the HOA Frequency or turn off HOA Present",
          });
      },
      resetDirty: () => {
        form.reset(form.getValues(), {
          keepValues: true,
        });
      },
    }),
    [form, isDirty]
  );

  const { errors } = useFormState({
    control: form.control,
    name: [
      "bedrooms",
      "bathroomsFull",
      "bathroomsHalf",
      "interiorSize",
      "yearBuilt",
      "stories",
      "architecturalStyle",
    ],
  });

  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Property
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PropertyType />

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="Bedrooms *"
              requiredMark
              {...form.register("bedrooms")}
              error={!!errors.bedrooms}
              errorMessage={errors.bedrooms?.message}
            />

            <Input
              type="number"
              placeholder="Full Baths *"
              requiredMark
              {...form.register("bathroomsFull")}
              error={!!errors.bathroomsFull}
              errorMessage={errors.bathroomsFull?.message}
            />

            <Input
              type="number"
              placeholder="Half Baths *"
              requiredMark
              {...form.register("bathroomsHalf")}
              error={!!errors.bathroomsHalf}
              errorMessage={errors.bathroomsHalf?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Interior Size (sqft) *"
              requiredMark
              {...form.register("interiorSize")}
              error={!!errors.interiorSize}
              errorMessage={errors.interiorSize?.message}
            />

            <Input
              type="number"
              placeholder="Year Built"
              {...form.register("yearBuilt")}
              error={!!errors.yearBuilt}
              errorMessage={errors.yearBuilt?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Stories / Levels"
              {...form.register("stories")}
              error={!!errors.stories}
              errorMessage={errors.stories?.message}
            />

            <Input
              placeholder="Architectural Style"
              {...form.register("architecturalStyle")}
              error={!!errors.architecturalStyle}
              errorMessage={errors.architecturalStyle?.message}
            />
          </div>
          <HoaSection />
        </CardContent>
      </Card>
    </FormProvider>
  );
});
