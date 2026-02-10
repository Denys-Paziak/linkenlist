"use client";

import { useForm, useFormState } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { US_STATES } from "../../../../../../constants/real-estate-options";
import { forwardRef, useImperativeHandle, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationFormSchema } from "../../../../../../lib/schemas/realestate/location-form-schema";
import { IOwnerRealestate } from "../../../../../../types/Realestate";
import { FormHandle } from "../page";
import { Input } from "../../../../../../components/ui/input-listing-variant";

export const Location = forwardRef<
  FormHandle,
  {
    data?: IOwnerRealestate;
  }
>(function Location({ data }, ref) {
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const form = useForm({
    resolver: zodResolver(locationFormSchema),
    values: {
      street: data?.street || "",
      unit: data?.unit || "",
      zip: data?.zip || "",
      state: data?.state || "",
      city: data?.city || "",
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
            location: {
              street: values.street === "" ? null : values.street,
              unit: values.unit === "" ? null : values.unit,
              zip: values.zip === "" ? null : values.zip,
              state: values.state === "" ? null : values.state,
              city: values.city === "" ? null : values.city,
            },
          },
        };
      },
      setError: (fields) => {
        if (fields.includes("street"))
          form.setError("street", { message: "Street is required" });
        if (fields.includes("zip"))
          form.setError("zip", { message: "ZIP is required" });
        if (fields.includes("state"))
          form.setError("state", { message: "State is required" });
        if (fields.includes("city"))
          form.setError("city", { message: "City is required" });
      },
      resetDirty: () => {
        form.reset(form.getValues(), {
          keepValues: true,
        });
      },
    }),
    [form, isDirty]
  );

  const filteredStates = US_STATES.filter((state) =>
    state.toLowerCase().includes(form.watch("state").toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">
          Location Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Street Address *"
          requiredMark
          {...form.register("street")}
          error={!!form.formState.errors.street}
          errorMessage={form.formState.errors.street?.message}
        />

        <Input
          placeholder="Unit/Apt"
          {...form.register("unit")}
          error={!!form.formState.errors.unit}
          errorMessage={form.formState.errors.unit?.message}
        />

        <Input
          placeholder="ZIP code *"
          requiredMark
          {...form.register("zip")}
          error={!!form.formState.errors.zip}
          errorMessage={form.formState.errors.zip?.message}
        />

        <div className="space-y-2 relative">
          {(() => {
            const { onBlur, ...stateRegister } = form.register("state");

            return (
              <Input
                placeholder="Type to search states..."
                requiredMark
                {...stateRegister}
                onFocus={() => setShowStateDropdown(true)}
                onBlur={(e) => {
                  onBlur(e);
                  setShowStateDropdown(false);
                }}
                error={!!form.formState.errors.state}
                errorMessage={form.formState.errors.state?.message}
              />
            );
          })()}

          {showStateDropdown && filteredStates.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredStates.map((state) => (
                <div
                  key={state}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onPointerDown={() => {
                    form.setValue("state", state, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    setShowStateDropdown(false);
                  }}
                >
                  {state}
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          placeholder="City"
          requiredMark
          {...form.register("city")}
          error={!!form.formState.errors.city}
          errorMessage={form.formState.errors.city?.message}
        />
      </CardContent>
    </Card>
  );
});
