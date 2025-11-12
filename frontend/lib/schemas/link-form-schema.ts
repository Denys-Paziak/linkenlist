import { z } from "zod";

export const updateFormSchema = z.object({
  image: z
    .string()
    .url("Enter a valid URL")
    .regex(
      /\.(png|jpe?g|webp)(\?|#|$)/i,
      "Image URL must end with .png, .jpg, .jpeg or .webp"
    )
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(1, "Title is required")
    .max(140, "Title must be between 1 and 140 characters"),

  description: z
    .string()
    .max(500, "Description must be no longer than 500 characters")
    .optional()
    .or(z.literal("")),

  url: z
    .string()
    .min(1, "URL is required")
    .url("Enter a valid URL")
    .refine(
      (val) => val.startsWith("https://") || val.startsWith("http://"),
      "URL must start with http:// or https://"
    ),

  category: z.string().min(1, "Category is required"),

  branches: z.array(z.string()).min(1, "At least one branch is required"),

  tags: z
    .array(
      z
        .string()
        .min(2, "Each tag must be at least 2 characters long")
        .max(30, "Each tag must be no longer than 30 characters")
    )
    .min(1, "At least one tag is required")
    .max(10, "You can specify up to 10 tags"),

  verified: z.boolean(),
});

export const createFormSchema = updateFormSchema.omit({ verified: true });

export type UpdateLinkFormData = z.infer<typeof updateFormSchema>;
export type CreateLinkFormData = z.infer<typeof createFormSchema>;

export const categories = [
  "Base/Installation",
  "Benefits & DEERS",
  "Career & Benefits",
  "Education & Training",
  "Family & Support",
  "Finance & Pay",
  "General Support",
  "HR & Personnel",
  "Health & Fitness",
  "Housing & Relocation",
  "ID/CAC & RAPIDS",
  "Identity & Access",
  "Leadership & Policy",
  "Leadership & Strategy",
  "Leave & Absence",
  "Medical & Dental",
  "Medical/TRICARE",
  "Pay & Benefits",
  "Personnel/Records",
  "Portal & Access",
  "Public Info",
  "Reference",
  "Resources",
  "Resources & Tools",
  "Security & Clearances",
  "Transition/Retirement",
  "Travel/Finance",
] as const;

export const branchesOptions = [
  "Army",
  "Navy",
  "Air Force",
  "Marines",
  "Space Force",
  "Coast Guard",
  "DoD-wide",
] as const;
