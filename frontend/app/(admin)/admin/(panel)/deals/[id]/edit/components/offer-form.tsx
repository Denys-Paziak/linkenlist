"use client";

import { CheckCircle, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../../components/ui/card";
import { Switch } from "../../../../../../../../components/ui/switch";
import { Label } from "../../../../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../../components/ui/select";
import { useEffect, useState } from "react";
import {
  ButtonSubitStatus,
  ButtonSubmit,
  renderStatusIcon,
} from "../../../../../../../../components/ui/button-submit";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cadenceOptions,
  dealTypes,
  offerFormSchema,
} from "../../../../../../../../lib/schemas/deal/offer-form-schema";
import { cn, pickDirty } from "../../../../../../../../lib/utils";
import useSWR from "swr";
import { IDeal } from "../../../../../../../../types/Deal";
import { fetcherAdmin } from "../../../../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../../../../components/ui/error-alert";
import { useParams } from "next/navigation";
import { Input } from "../../../../../../../../components/ui/input";

export function OfferForm() {
  const { id: dealId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IDeal>(
    dealId ? `/admin/deals/${dealId}` : null
  );

  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [statusOfferEnabled, setStatusOfferEnabled] =
    useState<ButtonSubitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(offerFormSchema),
    values: data
      ? {
          dealType: data?.dealType || "",
          originalPrice: data?.originalPrice || "",
          yourPrice: data?.yourPrice || "",
          cadencePrice: data?.cadencePrice || cadenceOptions[0],
          promoCode: data?.promoCode || "",
          whereToEnterCode: data?.whereToEnterCode || "",
          validFrom: data?.validFrom || "",
          validUntil: data?.validUntil || "",
          providerDisplayName: data?.providerDisplayName || "",
          ongoingOffer: data?.ongoingOffer || false,
        }
      : {
          dealType: "",
          originalPrice: "",
          yourPrice: "",
          cadencePrice: cadenceOptions[0],
          promoCode: "",
          whereToEnterCode: "",
          validFrom: "",
          validUntil: "",
          providerDisplayName: "",
          ongoingOffer: false,
        },
    mode: "onBlur",
  });

  const calculateSavings = () => {
    const original = (form.watch("originalPrice") as number) || 0;
    const your = (form.watch("yourPrice") as number) || 0;
    if (original > 0 && your >= 0) {
      const savings = original - your;
      const percentage = Math.round((savings / original) * 100);
      return `Save $${savings.toFixed(2)} (${percentage}% off)`;
    }
    return "Enter prices to see savings";
  };

  const submitForm = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    setStatus("loading");
    try {
      const values = form.getValues();
      const dirty = pickDirty(values, form.formState.dirtyFields);

      await fetcherAdmin(`/admin/deals/${dealId}/offer-details`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dirty,
          validFrom: !dirty.ongoingOffer ? dirty.validFrom : undefined,
          validUntil: !dirty.ongoingOffer ? dirty.validUntil : undefined,
          originalPrice: dirty.originalPrice
            ? Number(dirty.originalPrice)
            : undefined,
          yourPrice: dirty.yourPrice ? Number(dirty.yourPrice) : undefined,
        }),
      });

      setStatus("success");
      mutate().then(() => {
        form.reset();
      });
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  const offerEnabled = async () => {
    setFormError(null);

    setStatusOfferEnabled("loading");
    try {
      await fetcherAdmin(`/admin/deals/${dealId}/offer-details/enable`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerEnabled: !data?.offerEnabled,
        }),
      });

      mutate().then(() => {
        setStatusOfferEnabled("success");
        form.reset();
      });
    } catch (err: any) {
      setStatusOfferEnabled("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (statusOfferEnabled === "success" || statusOfferEnabled === "error") {
      const timer = setTimeout(() => setStatusOfferEnabled("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, statusOfferEnabled]);

  const loading = isValidating || status === "loading";
  const loadError = error ? (error as any)?.message ?? "Failed to load" : null;

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Offer Details
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="offer-details-toggle"
                className="text-sm text-gray-600 mb-0"
              >
                Enable Section
              </Label>
              <Switch
                id="offer-details-toggle"
                checked={data?.offerEnabled}
                onCheckedChange={offerEnabled}
              />
              {renderStatusIcon(statusOfferEnabled)}
            </div>
          </CardTitle>
        </CardHeader>
        <fieldset disabled={loading || !data || !data.offerEnabled}>
          <CardContent className="space-y-6">
            {loadError ? <ErrorAlert message={loadError} /> : null}
            {formError ? <ErrorAlert message={formError} /> : null}

            {/* Deal Type */}
            <div>
              <Label>Deal Type *</Label>
              <Controller
                name="dealType"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      form.setValue("dealType", value as any, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.dealType
                          ? "border-destructive bg-background focus:border-destructive"
                          : "bg-background border border-input"
                      )}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dealTypes.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.dealType ? (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.dealType.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Original Price */}
              <Input
                label="Original Price"
                placeholder="99.99"
                type="number"
                {...form.register("originalPrice")}
                error={!!form.formState.errors.originalPrice}
                errorMessage={form.formState.errors.originalPrice?.message}
              />

              {/* Your Price */}
              <Input
                label="Your Price"
                placeholder="49.99"
                type="number"
                {...form.register("yourPrice")}
                error={!!form.formState.errors.yourPrice}
                errorMessage={form.formState.errors.yourPrice?.message}
              />
              {/* Cadence Price */}
              <div className="pt-7">
                <Controller
                  name="cadencePrice"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.cadencePrice
                            ? "border-destructive bg-background focus:border-destructive"
                            : "bg-background border border-input"
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cadenceOptions.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.cadencePrice ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.cadencePrice.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">
                Savings Preview
              </Label>
              <p className="text-lg font-bold text-green-600">
                {calculateSavings()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Promo Code */}
              <Input
                label="Promo Code"
                placeholder="MILITARY50"
                {...form.register("promoCode")}
                error={!!form.formState.errors.promoCode}
                errorMessage={form.formState.errors.promoCode?.message}
              />
              {/* Where to Enter Code */}
              <Input
                label="Where to Enter Code"
                placeholder="At checkout, in the promo code field"
                {...form.register("whereToEnterCode")}
                error={!!form.formState.errors.whereToEnterCode}
                errorMessage={form.formState.errors.whereToEnterCode?.message}
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Controller
                  control={form.control}
                  name="ongoingOffer"
                  render={({ field }) => (
                    <>
                      <Switch
                        id="ongoingOffer"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        disabled={loading || !data}
                      />
                      <Label htmlFor="ongoingOffer" className="mb-0">
                        Ongoing Offer (no expiration)
                      </Label>
                    </>
                  )}
                />
              </div>

              {!form.watch("ongoingOffer") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Valid From */}
                  <Input
                    label="Valid From"
                    {...form.register("validFrom")}
                    type="date"
                    error={!!form.formState.errors.validFrom}
                    errorMessage={form.formState.errors.validFrom?.message}
                  />
                  {/* Valid Until */}
                  <Input
                    label="Valid Until"
                    {...form.register("validUntil")}
                    type="date"
                    error={!!form.formState.errors.validUntil}
                    errorMessage={form.formState.errors.validUntil?.message}
                  />
                </div>
              )}
            </div>

            {/* Provider Display Name*/}
            <Input
              label=" Provider Display Name"
              {...form.register("providerDisplayName")}
              placeholder="Leave blank to use merchant name"
              error={!!form.formState.errors.providerDisplayName}
              errorMessage={form.formState.errors.providerDisplayName?.message}
            />

            <ButtonSubmit
              type="button"
              onClick={() => submitForm()}
              status={status}
              statusText={{
                loading: "Saving...",
                success: "Saved",
                error: "Try again",
                disabled: "Disabled",
              }}
              className="font-semibold"
            >
              <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              Save
            </ButtonSubmit>
          </CardContent>
        </fieldset>
      </Card>
    </form>
  );
}
