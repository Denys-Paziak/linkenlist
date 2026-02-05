"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { IConstructionForm } from "./construction-and-legal-records";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import {
  LISTING_AGREEMENTS,
  OWNERSHIP_TYPES,
} from "../../../../../../../constants/real-estate-options";
import { useState } from "react";
import { Input } from "../../../../../../../components/ui/input-listing-variant";

export function LegalRecords() {
  const { register, control } = useFormContext<IConstructionForm>();

  const { errors } = useFormState({
    control,
    name: ["zoning", "parcelApn", "dateOnMarket"],
  });

  const [dateOnMarketFocus, setDateOnMarketFocus] = useState<boolean>(false);
  const dateOnMarket = useWatch({ control, name: "dateOnMarket" });
  const dateOnMarketReg = register("dateOnMarket")

  return (
    <div className="space-y-4">
      <Input
        placeholder="Zoning (e.g., Residential)"
        {...register("zoning")}
        error={!!errors.zoning}
        errorMessage={errors.zoning?.message}
        className="bg-gray-50"
      />

      <Input
        placeholder="Parcel/APN (e.g., 123-456-789)"
        {...register("parcelApn")}
        error={!!errors.parcelApn}
        errorMessage={errors.parcelApn?.message}
        className="bg-gray-50"
      />

      <Controller
        control={control}
        name="ownershipType"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Ownership Type" />
            </SelectTrigger>
            <SelectContent>
              {OWNERSHIP_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="listingAgreement"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Listing Agreement" />
            </SelectTrigger>
            <SelectContent>
              {LISTING_AGREEMENTS.map((agreement) => (
                <SelectItem key={agreement} value={agreement}>
                  {agreement}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <div className="relative">
        {!dateOnMarket && !dateOnMarketFocus ? (
          <p className="absolute bg-background text-black/50 text-[14px] top-3 left-3 pointer-events-none">
            Date on Market
          </p>
        ) : null}
        <Input
          type="date"
          {...dateOnMarketReg}
          onFocus={() => {
            setDateOnMarketFocus(true)
          }}
          onBlur={(e) => {
            setDateOnMarketFocus(false)
            dateOnMarketReg.onBlur(e)
          }}
          error={!!errors.dateOnMarket}
          errorMessage={errors.dateOnMarket?.message}
          className="bg-gray-50"
        />
      </div>
    </div>
  );
}
