"use client";

import { Controller, useForm, useFormState } from "react-hook-form";
import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
} from "../../../../../../components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerFormSchema } from "../../../../../../lib/schemas/realestate/seller-form-schema";
import { IOwnerRealestate } from "../../../../../../types/Realestate";
import { forwardRef, useImperativeHandle } from "react";
import { FormHandle } from "../page";
import { Input } from "../../../../../../components/ui/input-listing-variant";
import { Checkbox } from "../../../../../../components/ui/checkbox";
import { Label } from "../../../../../../components/ui/label";

export const Seller = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function Seller({ data }, ref) {
  const form = useForm({
    resolver: zodResolver(sellerFormSchema),
    values: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      company: data?.company || "",
      primaryPhone: data?.primaryPhone || "",
      hidePrimaryPhone: data?.hidePrimaryPhone || false,
      alternativePhone: data?.alternativePhone || "",
      hideAlternativePhone: data?.hideAlternativePhone || false,
      email: data?.email || "",
      hideEmail: data?.hideEmail || false
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
            seller: {
              firstName: values.firstName === "" ? null : values.firstName,
              lastName: values.lastName === "" ? null : values.lastName,
              company: values.company === "" ? null : values.company,
              primaryPhone:
                values.primaryPhone === "" ? null : values.primaryPhone,
              hidePrimaryPhone: values.hidePrimaryPhone,
              alternativePhone:
                values.alternativePhone === "" ? null : values.alternativePhone,
              hideAlternativePhone: values.hideAlternativePhone,
              email: values.email === "" ? null : values.email,
              hideEmail: values.hideEmail
            },
          },
        };
      },
      setError: (fields) => {
        if (fields.includes("firstName"))
          form.setError("firstName", { message: "First Name is required" });
        if (fields.includes("lastName"))
          form.setError("lastName", { message: "Last Name is required" });
        if (fields.includes("email"))
          form.setError("email", { message: "Email is required" });
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">
          Seller Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="First Name *"
          {...form.register("firstName")}
          requiredMark
          error={!!form.formState.errors.firstName}
          errorMessage={form.formState.errors.firstName?.message}
        />

        <Input
          placeholder="Last Name *"
          {...form.register("lastName")}
          requiredMark
          error={!!form.formState.errors.lastName}
          errorMessage={form.formState.errors.lastName?.message}
        />

        <Input
          placeholder="Company Name"
          {...form.register("company")}
          error={!!form.formState.errors.company}
          errorMessage={form.formState.errors.company?.message}
        />

        <Input
          type="tel"
          placeholder="Primary Phone *"
          requiredMark
          {...form.register("primaryPhone")}
          error={!!form.formState.errors.primaryPhone}
          errorMessage={form.formState.errors.primaryPhone?.message}
        />
        <div className="flex items-center space-x-2">
          <Controller
            control={form.control}
            name="hidePrimaryPhone"
            render={({ field }) => (
              <Checkbox
                id="hidePrimaryPhone"
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />
            )}
          />
          <Label htmlFor="hidePrimaryPhone" className="text-sm font-medium mb-0">
            Hide Primary Phone
          </Label>
        </div>

        <Input
          type="tel"
          placeholder="Alternative Phone"
          {...form.register("alternativePhone")}
          error={!!form.formState.errors.alternativePhone}
          errorMessage={form.formState.errors.alternativePhone?.message}
        />
        <div className="flex items-center space-x-2">
          <Controller
            control={form.control}
            name="hideAlternativePhone"
            render={({ field }) => (
              <Checkbox
                id="hideAlternativePhone"
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />
            )}
          />
          <Label htmlFor="hideAlternativePhone" className="text-sm font-medium mb-0">
            Hide Alternative Phone
          </Label>
        </div>

        <Input
          type="email"
          placeholder="Email *"
          requiredMark
          {...form.register("email")}
          error={!!form.formState.errors.email}
          errorMessage={form.formState.errors.email?.message}
        />
        <div className="flex items-center space-x-2">
          <Controller
            control={form.control}
            name="hideEmail"
            render={({ field }) => (
              <Checkbox
                id="hideEmail"
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />
            )}
          />
          <Label htmlFor="hideEmail" className="text-sm font-medium mb-0">
            Hide Email
          </Label>
        </div>
      </CardContent>
    </Card>
  );
});
