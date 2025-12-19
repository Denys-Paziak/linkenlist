import z from "zod";

export const postCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment body is required")
    .max(1000, "Comment body must be at most 1000 characters long"),
});
