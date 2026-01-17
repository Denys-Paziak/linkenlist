import { z } from "zod";

const textOptional = (label: string, max: number) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v.length <= max, {
      message: `${label}: max ${max} characters`,
    });

const arrayOfStrings = z.array(z.string());

export const indoorFeaturesFormSchema = z.object({
  flooring: arrayOfStrings,
  otherFlooring: textOptional("Other flooring type", 40),

  heating: arrayOfStrings,
  otherHeating: textOptional("Other heating type", 40),

  cooling: arrayOfStrings,
  otherCooling: textOptional("Other cooling type", 40),

  appliances: arrayOfStrings,
  otherAppliances: textOptional("Other appliance", 40),

  laundryFeatures: arrayOfStrings,
  otherLaundryFeatures: textOptional("Other laundry feature", 40),

  premiumFeatures: textOptional("Premium features", 20),

  specialFeatures: z
    .array(
      z
        .string()
        .or(z.literal(""))
        .refine((v) => v.length <= 20, {
          message: "Special feature: max 20 characters",
        })
    )
});
