import { z } from "zod";

const textOptional = (label: string, max: number) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v.length <= max, {
      message: `${label}: max ${max} characters`,
    })

export const utilitiesEnergyConnectivityFormSchema = z.object({
  water: textOptional("Water", 100),
  sewer: textOptional("Sewer", 100),

  utilitiesAvailable: z.array(z.string()),
  otherUtilitiesAvailable: textOptional("Other utility", 40),

  energyFeatures: z.array(z.string()),
  otherEnergyFeatures: textOptional("Other energy feature", 40),

  internetOptions: z.array(z.string()),
  otherInternetOptions: textOptional("Other internet option", 40),

  downloadSpeed: textOptional("Typical download speed", 50),
  cellularNotes: textOptional("Cellular notes", 255),

  smartDevices: z.array(z.string()),
  otherSmartDevices: textOptional("Other smart device", 40),
});
