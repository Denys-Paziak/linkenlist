import { z } from "zod";

// ---------- helpers ----------

const isNumeric = (v: string) => {
  return /^-?\d+(\.\d+)?$/.test(v);
};

const isIntegerLike = (v: string) => {
  // Лише цілі числа: 0, 10, -3
  return /^-?\d+$/.test(v);
};

const numberString = (
  label: string,
  opts?: { min?: number; max?: number; decimals?: number }
) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v === "" || isNumeric(v), {
      message: `${label}: enter a number (e.g. 1200 or 1200.5)`,
    })
    .refine((v) => {
      if (v === "" || opts?.decimals === undefined) return true;
      const [, dec = ""] = v.split(".");
      return dec.length <= opts.decimals;
    }, {
      message:
        opts?.decimals === 1
          ? `${label}: use up to 1 decimal place (e.g. 2.5)`
          : `${label}: use up to ${opts?.decimals} decimal places`,
    })
    .refine((v) => v === "" || opts?.min === undefined || Number(v) >= opts.min, {
      message: `${label}: must be at least ${opts?.min}`,
    })
    .refine((v) => v === "" || opts?.max === undefined || Number(v) <= opts.max, {
      message: `${label}: must be at most ${opts?.max}`,
    })

const integerString = (
  label: string,
  opts?: { min?: number; max?: number }
) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v === "" || isIntegerLike(v), {
      message: `${label}: enter a whole number (no decimals)`,
    })
    .refine((v) => v === "" || opts?.min === undefined || Number(v) >= opts.min, {
      message: `${label}: must be at least ${opts?.min}`,
    })
    .refine((v) => v === "" || opts?.max === undefined || Number(v) <= opts.max, {
      message: `${label}: must be at most ${opts?.max}`,
    })

const textOptional = (label: string, max: number) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v.length <= max, {
      message: `${label}: max ${max} characters`,
    })

// ---------- schema ----------

export const propertyFormSchema = z.object({
  // property details
  propertyType: textOptional("Property type", 100),
  bedrooms: integerString("Bedrooms", { min: 0, max: 100 }),

  // ванни часто бувають 1.5, 2.5 — тому 1 знак після коми
  bathroomsFull: numberString("Full baths", { min: 0, max: 999.9, decimals: 1 }),
  bathroomsHalf: numberString("Half baths", { min: 0, max: 999.9, decimals: 1 }),

  interiorSize: integerString("Interior size (sqft)", { min: 0, max: 1_000_000 }),

  yearBuilt: integerString("Year built", { min: 1600, max: 3000 }),
  stories: integerString("Stories / levels", { min: 0, max: 200 }),
  architecturalStyle: textOptional("Architectural style", 255),

  // HOA
  hoaPresent: z.boolean(),
  hoaFee: numberString("HOA fee", { min: 0 }),
  hoaFrequency: textOptional("HOA frequency", 50),
  servicesIncluded: z.array(z.string()),
  otherServicesIncluded: textOptional("Other service", 40),
});
