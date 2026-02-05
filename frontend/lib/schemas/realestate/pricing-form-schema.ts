import { z } from "zod";

// ---------- helpers ----------

const isNumeric = (v: string) => {
  return /^-?\d+(\.\d+)?$/.test(v);
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
    .refine(
      (v) => {
        if (v === "" || opts?.decimals === undefined) return true;
        const [, dec = ""] = v.split(".");
        return dec.length <= opts.decimals;
      },
      {
        message:
          opts?.decimals === 1
            ? `${label}: use up to 1 decimal place (e.g. 2.5)`
            : `${label}: use up to ${opts?.decimals} decimal places`,
      }
    )
    .refine(
      (v) => v === "" || opts?.min === undefined || Number(v) >= opts.min,
      {
        message: `${label}: must be at least ${opts?.min}`,
      }
    )
    .refine(
      (v) => v === "" || opts?.max === undefined || Number(v) <= opts.max,
      {
        message: `${label}: must be at most ${opts?.max}`,
      }
    );

const textOptional = (label: string, max: number) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v.length <= max, {
      message: `${label}: max ${max} characters`,
    });

const dateString = (label: string) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), {
      message: `${label}: choose a valid date`,
    });

// ---------- schema ----------

export const pricingFormSchema = z.object({
  forSale: z.boolean(),
  forRent: z.boolean(),

  // sale
  listPrice: numberString("List price", { min: 0 }),

  // rent
  monthlyRent: numberString("Monthly rent", { min: 0 }),
  securityDeposit: numberString("Security deposit", { min: 0 }),
  applicationFee: numberString("Application fee", { min: 0 }),
  dateAvailable: z.string(),
  leaseTerm: textOptional("Lease term", 50),

  petPolicy: z.array(z.string()),
}).superRefine((data, ctx) => {
  if (data.forSale) {
    const listPrice = data.listPrice?.trim() ?? "";
    if (!listPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This field is required. Please fill out this field to continue.",
        path: ["listPrice"],
      });
    }
  }
  if (data.forRent) {
    const leaseTerm = data.leaseTerm?.trim() ?? "";
    if (!leaseTerm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This field is required. Please fill out this field to continue.",
        path: ["leaseTerm"],
      });
    }
    const monthlyRent = data.monthlyRent?.trim() ?? "";
    if (!monthlyRent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This field is required. Please fill out this field to continue.",
        path: ["monthlyRent"],
      });
    }
  }
});
