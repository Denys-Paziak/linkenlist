import { z } from "zod";

export const publicProfileSchema = z.object({
  avatar: z.string(),

  firstName: z
    .string()
    .trim()
    .max(150, "First Name must be at most 150 characters long")
    .optional(),

  lastName: z
    .string()
    .trim()
    .max(150, "Last Name must be at most 150 characters long")
    .optional(),

  professionalTitle: z
    .string()
    .trim()
    .max(255, "Professional Title must be at most 255 characters long")
    .optional(),

  company: z
    .string()
    .trim()
    .max(255, "Company must be at most 255 characters long")
    .optional(),

  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{7,14}$/,
      "Phone must be in E.164 format, e.g. +14155552671",
    )
    .or(z.literal("")),

  publicEmail: z
    .string()
    .trim()
    .max(255, "Public Email must be at most 255 characters long")
    .optional()
    .refine(
      (val) =>
        !val || val.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Public Email must be a valid email" },
    ),

  isPrivate: z.boolean(),
});
