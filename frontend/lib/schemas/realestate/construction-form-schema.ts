import { z } from "zod";

const textOptional = (label: string, max: number) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v.length <= max, {
      message: `${label}: max ${max} characters`,
    });

const dateStringOptional = (label: string) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), {
      message: `${label}: choose a valid date`,
    });

export const constructionFormSchema = z.object({
  construction: z.array(z.string()),
  otherConstruction: textOptional("Other construction type", 40),

  newConstruction: z.boolean(),
  builder: textOptional("Builder name", 255),

  zoning: textOptional("Zoning", 100),
  parcelApn: textOptional("Parcel / APN", 50),

  ownershipType: textOptional("Ownership type", 100),
  listingAgreement: textOptional("Listing agreement", 100),

  dateOnMarket: dateStringOptional("Date on market"),
});
