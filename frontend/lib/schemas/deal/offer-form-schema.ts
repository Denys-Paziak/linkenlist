import { z } from "zod";

export const dealTypes = [
  "Percentage Off",
  "Fixed Amount Off",
  "Special Price",
  "Free Item/Service",
  "Buy One Get One",
];

export const cadenceOptions = ["one-time", "month", "year", "week", "day"];

export const offerFormSchema = z
  .object({
    dealType: z.string().min(1, "Deal type is required"),

    originalPrice: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.coerce
        .number({
          error: "Original price is required",
        })
        .min(0, "Original price must be at least 0")
        .max(9999999999.99, "Original price must be at most 9999999999.99")
        .refine((v) => Number.isInteger(v * 100), {
          message: "Original price can have at most 2 decimal places",
        })
    ),

    yourPrice: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.coerce
        .number({
          error: "Your price is required",
        })
        .min(0, "Your price must be at least 0")
        .max(9999999999.99, "Your price must be at most 9999999999.99")
        .refine((v) => Number.isInteger(v * 100), {
          message: "Your price can have at most 2 decimal places",
        })
    ),

    cadencePrice: z.string().min(1, "Cadence price is required").optional(),

    promoCode: z
      .string()
      .max(120, "Promo code must be no longer than 120 characters")
      .optional(),

    whereToEnterCode: z
      .string()
      .max(200, "'Where to Enter Code' must be no longer than 200 characters")
      .optional(),

    ongoingOffer: z.boolean().optional(),

    // умисно робимо просто optional, а умови — в superRefine
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),

    providerDisplayName: z
      .string()
      .min(1, "Provider display name is required")
      .max(120, "Provider display name must be no longer than 120 characters")
  })
  .superRefine((data, ctx) => {
    const { originalPrice, yourPrice, ongoingOffer, validFrom, validUntil } =
      data;

    // === YourPriceNotGreaterThanOriginal ===
    if (
      yourPrice != null &&
      originalPrice != null &&
      yourPrice > originalPrice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Your price cannot be greater than original price",
        path: ["yourPrice"],
      });
    }

    // === ValidateIf(o => o.ongoingOffer === false) + IsDefined + IsISO8601 + DatesOrder ===
    if (ongoingOffer === false) {
      // validFrom required
      if (!validFrom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid from is required when ongoing offer is false",
          path: ["validFrom"],
        });
      } else {
        // формат ISO YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(validFrom)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Valid from must be a valid ISO date (YYYY-MM-DD)",
            path: ["validFrom"],
          });
        }
      }

      // validUntil required
      if (!validUntil) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid until is required when ongoing offer is false",
          path: ["validUntil"],
        });
      } else {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(validUntil)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Valid until must be a valid ISO date (YYYY-MM-DD)",
            path: ["validUntil"],
          });
        }
      }

      // Перевірка порядку дат (DatesOrder)
      if (validFrom && validUntil) {
        const from = Date.parse(validFrom);
        const until = Date.parse(validUntil);

        if (!Number.isNaN(from) && !Number.isNaN(until) && from > until) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Valid until must be the same day or later than valid from",
            path: ["validUntil"],
          });
        }
      }
    }
  });

export type OfferFormSchemaType = z.infer<typeof offerFormSchema>;
