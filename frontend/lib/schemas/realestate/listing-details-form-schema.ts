import { z } from "zod";

type PackageType = "basic" | "premium" | string;

function getDescriptionLimit(packageType: PackageType) {
  return packageType === "basic" ? 4000 : 8000;
}

const ALLOWED_VIRTUAL_TOUR_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "matterport.com",
  "vimeo.com",
];

function isAllowedDomain(hostname: string) {
  return ALLOWED_VIRTUAL_TOUR_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

export const createListingDetailsSchema = (packageType: PackageType) => {
  const descriptionLimit = getDescriptionLimit(packageType);

  return z.object({
    title: z
      .string()
      .trim()
      .min(1, "This field is required. Please fill out this field to continue.")
      .refine((v) => v.length <= 100, {
        message: "Listing title: max 100 characters",
      }),

    description: z
      .string()
      .or(z.literal(""))
      .refine((v) => v.length <= descriptionLimit, {
        message: `Listing description: max ${descriptionLimit} characters for your package`,
      }),

    virtualTourUrl: z
      .string()
      .or(z.literal(""))
      .refine(
        (v) => {
          if (v === "") return true;

          try {
            const url = new URL(v);

            if (!["http:", "https:"].includes(url.protocol)) {
              return false;
            }

            return isAllowedDomain(url.hostname.toLowerCase());
          } catch {
            return false;
          }
        },
        {
          message:
            "Virtual tour URL: only YouTube, Matterport, Vimeo links are allowed",
        }
      ),
  });
};
