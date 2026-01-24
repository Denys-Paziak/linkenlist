import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  type: z.enum(
    [
      "General Question",
      "Technical Issue",
      "Resource Submission/Update",
      "Deal Submission",
      "Partnership Inquiry",
      "Feedback/Suggestion",
      "Other",
    ],
    { message: "Message type is required" }
  ),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be 1000 characters or less"),
});