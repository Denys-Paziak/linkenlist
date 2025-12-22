import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().max(100, "Max 100 characters"),
  date: z.string().max(50, "Max 50 characters"),
  location: z.string().max(100, "Max 100 characters"),
  comment: z.string().max(500, "Max 500 characters"),
});

export const homepageTestimonialsSchema = z.object({
  testimonials: z
    .array(testimonialSchema)
});

export type HomepageTestimonialsForm = z.infer<
  typeof homepageTestimonialsSchema
>;
