import { z } from "zod";

// helpers
const textOptional = (label: string, max: number) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v.length <= max, {
      message: `${label}: max ${max} characters`,
    })

const intStringOptional = (
  label: string,
  opts?: { min?: number; max?: number }
) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v === "" || /^-?\d+$/.test(v), {
      message: `${label}: enter a whole number (no decimals)`,
    })
    .refine((v) => v === "" || opts?.min === undefined || Number(v) >= opts.min, {
      message: `${label}: must be at least ${opts?.min}`,
    })
    .refine((v) => v === "" || opts?.max === undefined || Number(v) <= opts.max, {
      message: `${label}: must be at most ${opts?.max}`,
    })

export const outdoorFeaturesFormSchema = z.object({
  outdoorSpaces: z.array(z.string()),
  otherOutdoorSpaces: textOptional("Other outdoor space", 40),

  fencing: z.array(z.string()),
  otherFencing: textOptional("Other fencing type", 40),

  view: z.array(z.string()),
  otherView: textOptional("Other view type", 40),

  parkingType: z.array(z.string()),
  otherParkingType: textOptional("Other parking type", 40),

  lotFeatures: z.array(z.string()),
  otherLotFeatures: textOptional("Other lot feature", 40),

  poolType: textOptional("Pool type", 100),

  garageSpaces: intStringOptional("Garage spaces", { min: 0, max: 999 }),
  drivewaySpaces: intStringOptional("Driveway spaces", { min: 0, max: 999 }),

  lotSize: textOptional("Lot size", 100),
});