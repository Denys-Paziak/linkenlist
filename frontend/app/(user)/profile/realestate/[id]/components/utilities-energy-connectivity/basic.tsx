"use client";

import { Controller, useFormContext, useFormState } from "react-hook-form";
import { Input } from "../../../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import {
  WATER_OPTIONS,
  SEWER_OPTIONS,
} from "../../../../../../../constants/real-estate-options";
import { IUtilitiesEnergyConnectivityForm } from "./utilities-energy-connectivity";

export function Basic() {
  const { register, control } =
    useFormContext<IUtilitiesEnergyConnectivityForm>();

  const { errors } = useFormState({
    control,
    name: ["downloadSpeed", "cellularNotes"],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div className="space-y-6">
        <Controller
          control={control}
          name="water"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Water" />
              </SelectTrigger>
              <SelectContent>
                {WATER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          control={control}
          name="sewer"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Sewer" />
              </SelectTrigger>
              <SelectContent>
                {SEWER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-6">
        <Input
          placeholder="Typical Download Speed (Mbps)"
          {...register("downloadSpeed")}
          error={!!errors.downloadSpeed}
          errorMessage={errors.downloadSpeed?.message}
          className="bg-gray-50"
        />

        <Input
          placeholder="Cellular Notes"
          {...register("cellularNotes")}
          error={!!errors.cellularNotes}
          errorMessage={errors.cellularNotes?.message}
          className="bg-gray-50"
        />
      </div>
    </div>
  );
}
