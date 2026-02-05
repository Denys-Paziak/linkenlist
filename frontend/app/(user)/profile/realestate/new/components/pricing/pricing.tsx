"use client";

import {
  Controller,
  FormProvider,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Label } from "../../../../../../../components/ui/label";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { ForSaleFields } from "./for-sale-fields";
import { ForRentFields } from "./for-rent-fields";
import { forwardRef, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { pricingFormSchema } from "../../../../../../../lib/schemas/realestate/pricing-form-schema";
import { FormHandle } from "../../page";
import { IOwnerRealestate } from "../../../../../../../types/Realestate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../components/ui/card";

export type IPricingForm = {
  forSale: boolean;
  forRent: boolean;

  listPrice: string;

  monthlyRent: string;
  securityDeposit: string;
  applicationFee: string;
  dateAvailable: string;
  leaseTerm: string;

  petPolicy: string[];
};

export const Pricing = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function Pricing({ data }, ref) {
  const form = useForm<IPricingForm>({
    resolver: zodResolver(pricingFormSchema),
    values: {
      forSale: data?.forSale || false,
      forRent: data?.forRent || false,

      listPrice: String(data?.listPrice || ""),

      monthlyRent: String(data?.monthlyRent || ""),
      securityDeposit: String(data?.securityDeposit || ""),
      applicationFee: String(data?.applicationFee || ""),
      dateAvailable: data?.dateAvailable
        ? new Date(data.dateAvailable).toISOString().split("T")[0]
        : "",
      leaseTerm: data?.leaseTerm || "month-to-month",

      petPolicy: data?.petPolicy || [],
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
            pricing: {
              forSale: values.forSale,
              forRent: values.forRent,
              listPrice:
                values.listPrice === "" ? null : Number(values.listPrice),
              monthlyRent:
                values.monthlyRent === "" ? null : Number(values.monthlyRent),
              securityDeposit:
                values.securityDeposit === ""
                  ? null
                  : Number(values.securityDeposit),
              applicationFee:
                values.applicationFee === ""
                  ? null
                  : Number(values.applicationFee),
              dateAvailable: values.dateAvailable
                ? new Date(values.dateAvailable)
                : null,
              leaseTerm: values.leaseTerm,
              petPolicy: values?.petPolicy as string[],
            },
          },
        };
      },
      setError: (fields) => {
        if (fields.includes("forSale"))
          form.setError("forSale", { message: "" });
        if (fields.includes("forRent"))
          form.setError("forRent", { message: "" });
        if (fields.includes("listPrice"))
          form.setError("listPrice", { message: "List Price is required" });
        if (fields.includes("monthlyRent"))
          form.setError("monthlyRent", { message: "Monthly Rent is required" });
        if (fields.includes("leaseTerm"))
          form.setError("leaseTerm", { message: "Lease Term is required" });
      },
      resetDirty: () => {
        form.reset(form.getValues(), {
          keepValues: true,
        });
      },
    }),
    [form, isDirty]
  );

  const isForSale = useWatch({ control: form.control, name: "forSale" });
  const isForRent = useWatch({ control: form.control, name: "forRent" });

  const hasErrors = !isForSale && !isForRent;

  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType">
              Listing Type <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Controller
                control={form.control}
                name="forSale"
                render={({ field }) => (
                  <Checkbox
                    id="forSale"
                    checked={!!field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                    className={hasErrors ? "border-red-500" : ""}
                  />
                )}
              />
              <Label htmlFor="forSale" className="text-sm font-medium mb-0">
                For Sale
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                control={form.control}
                name="forRent"
                render={({ field }) => (
                  <Checkbox
                    id="forRent"
                    checked={!!field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                    className={hasErrors ? "border-red-500" : ""}
                  />
                )}
              />
              <Label htmlFor="forRent" className="text-sm font-medium mb-0">
                For Rent
              </Label>
            </div>
          </div>

          {isForSale && <ForSaleFields />}

          {isForRent && <ForRentFields />}
        </CardContent>
      </Card>
    </FormProvider>
  );
});
