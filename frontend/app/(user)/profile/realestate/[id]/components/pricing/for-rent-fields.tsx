"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Input } from "../../../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import { PetPolicy } from "./pet-policy";
import { IPricingForm } from "./pricing";
import { useEffect, useState } from "react";

export function ForRentFields() {
  const [leaseTermSelect, setLeaseTermSelect] = useState<string>("");
  const { register, control } = useFormContext<IPricingForm>();

  const { errors } = useFormState({
    control,
    name: [
      "monthlyRent",
      "securityDeposit",
      "applicationFee",
      "dateAvailable",
      "leaseTerm",
    ],
  });

  const [dateAvailableFocus, setDateAvailableFocus] = useState<boolean>(false);
  const dateAvailable = useWatch({ control, name: "dateAvailable" });
  const dateAvailableReg = register("dateAvailable");
  const leaseTerm = useWatch({ control, name: "leaseTerm" });

  useEffect(() => {
    if (
      leaseTerm === "month-to-month" ||
      leaseTerm === "6" ||
      leaseTerm === "12" ||
      leaseTerm === "14"
    ) {
      setLeaseTermSelect(leaseTerm);
    } else {
      setLeaseTermSelect("other");
    }
  }, []);

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Monthly Rent"
          {...register("monthlyRent")}
          error={!!errors.monthlyRent}
          errorMessage={errors.monthlyRent?.message}
          className="mt-1"
        />

        <Input
          type="number"
          placeholder="Security Deposit"
          {...register("securityDeposit")}
          error={!!errors.securityDeposit}
          errorMessage={errors.securityDeposit?.message}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Application Fee"
          {...register("applicationFee")}
          error={!!errors.applicationFee}
          errorMessage={errors.applicationFee?.message}
          className="mt-1"
        />

        <div className="relative">
          {!dateAvailable && !dateAvailableFocus ? (
            <p className="absolute bg-background text-black/50 text-[14px] top-4 left-3 pointer-events-none">
              Date Available
            </p>
          ) : null}
          <Input
            type="date"
            {...dateAvailableReg}
            onFocus={() => {
              setDateAvailableFocus(true);
            }}
            onBlur={(e) => {
              setDateAvailableFocus(false);
              dateAvailableReg.onBlur(e);
            }}
            error={!!errors.dateAvailable}
            errorMessage={errors.dateAvailable?.message}
            className="mt-1"
            min={new Date().toLocaleDateString("en-CA")}
          />
        </div>
      </div>

      <div>
        <Controller
          control={control}
          name="leaseTerm"
          render={({ field }) => {
            return (
              <Select
                value={leaseTermSelect}
                onValueChange={(value) => {
                  setLeaseTermSelect(value);
                  field.onChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lease term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month-to-month">Month to Month</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">1 Year</SelectItem>
                  <SelectItem value="24">2 Years</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.leaseTerm ? (
          <p className="mt-1 text-sm text-destructive">
            {errors.leaseTerm.message}
          </p>
        ) : null}
      </div>
      {leaseTermSelect === "other" && (
        <Controller
          control={control}
          name="leaseTerm"
          render={({ field }) => {
            return (
              <Input
                type="number"
                min={1}
                placeholder="Lease term (in months)"
                value={Number(field.value) || 1}
                onChange={(e) => field.onChange(String(e.target.value))}
                error={!!errors.applicationFee}
                errorMessage={errors.applicationFee?.message}
                className="mt-1"
              />
            );
          }}
        />
      )}

      <PetPolicy />
    </div>
  );
}
