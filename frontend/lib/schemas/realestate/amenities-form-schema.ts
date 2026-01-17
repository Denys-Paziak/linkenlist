import { z } from "zod";

const textOptional = (label: string, max: number) =>
  z
    .string()
    .or(z.literal(""))
    .refine((v) => v.length <= max, {
      message: `${label}: max ${max} characters`,
    });

export const amenitiesFormSchema = z.object({
  subdivisionName: z
    .string()
    .or(z.literal(""))
    .refine((v) => v.length <= 255, {
      message: "Subdivision / Community name: max 255 characters",
    }),

  communityFeatures: z.array(z.string()),
  otherCommunityFeatures: textOptional("Other community features", 40),
});
