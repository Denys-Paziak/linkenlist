import { z } from "zod";

const nameField = z
  .string()
  .trim()
  .min(1, "This field is required. Please fill out this field to continue.")
  .max(150, "Max 150 characters");

const companyField = z.string().max(255, "Max 255 characters");

const emailField = z
  .string()
  .trim()
  .min(1, "This field is required. Please fill out this field to continue.")
  .email("Invalid email")
  .max(255, "Max 255 characters");

export const sellerFormSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  company: companyField,
  primaryPhone: z
    .string()
    .trim()
    .min(1, "This field is required. Please fill out this field to continue.")
    .regex(
      /^\+[1-9]\d{7,14}$/,
      "Phone must be in E.164 format, e.g. +14155552671",
    ),
  hidePrimaryPhone: z.boolean(),
  alternativePhone: z
    .string()
    .regex(
      /^\+[1-9]\d{7,14}$/,
      "Phone must be in E.164 format, e.g. +14155552671",
    )
    .or(z.literal("")),
  hideAlternativePhone: z.boolean(),
  email: emailField,
  hideEmail: z.boolean(),
});
