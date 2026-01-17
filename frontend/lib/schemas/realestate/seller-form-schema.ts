import { z } from "zod";

const nameField = z
  .string()
  .max(150, "Max 150 characters")

const companyField = z
  .string()
  .max(255, "Max 255 characters")

const e164Phone = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "Phone must be in E.164 format, e.g. +14155552671")
  .or(z.literal(""))

const emailField = z
  .string()
  .email("Invalid email")
  .max(255, "Max 255 characters")
  .or(z.literal(""))

export const sellerFormSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  company: companyField,
  primaryPhone: e164Phone,
  alternativePhone: e164Phone,
  email: emailField,
});
