"use client";

import { useForm, useFormState } from "react-hook-form";
import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
} from "../../../../../../components/ui/card";
import { Input } from "../../../../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerFormSchema } from "../../../../../../lib/schemas/realestate/seller-form-schema";
import { IOwnerRealestate } from "../../../../../../types/Realestate";
import { forwardRef, useImperativeHandle } from "react";
import { FormHandle } from "../page";

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
      alternativePhone: data?.alternativePhone || "",
      email: data?.email || "",
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
            seller: {
              firstName: values.firstName === "" ? null : values.firstName,
              lastName: values.lastName === "" ? null : values.lastName,
              company: values.company === "" ? null : values.company,
              primaryPhone:
                values.primaryPhone === "" ? null : values.primaryPhone,
              alternativePhone:
                values.alternativePhone === "" ? null : values.alternativePhone,
              email: values.email === "" ? null : values.email,
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
          error={!!form.formState.errors.firstName}
          errorMessage={form.formState.errors.firstName?.message}
        />

        <Input
          placeholder="Last Name *"
          {...form.register("lastName")}
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
          {...form.register("primaryPhone")}
          error={!!form.formState.errors.primaryPhone}
          errorMessage={form.formState.errors.primaryPhone?.message}
        />

        <Input
          type="tel"
          placeholder="Alternative Phone"
          {...form.register("alternativePhone")}
          error={!!form.formState.errors.alternativePhone}
          errorMessage={form.formState.errors.alternativePhone?.message}
        />

        <Input
          type="email"
          placeholder="Email *"
          {...form.register("email")}
          error={!!form.formState.errors.email}
          errorMessage={form.formState.errors.email?.message}
        />
      </CardContent>
    </Card>
  );
});
