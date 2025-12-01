import { z } from "zod";

export const resourceStatuses = [
  "draft",
  "scheduled",
  "published",
  "expired",
  "archived",
];

function toDateOrUndefined(value: unknown) {
  if (value == null || value === "") return undefined;
  if (value instanceof Date) return value;

  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }

  return undefined;
}

export const publishingFormSchema = z
  .object({
    status: z.string().min(1, "Deal status is required"),

    schedulePublish: z.preprocess(toDateOrUndefined, z.date().optional()),

    scheduleExpire: z.preprocess(toDateOrUndefined, z.date().optional()),

    showComments: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const { schedulePublish, scheduleExpire } = data;

    // Аналог DatesOrder: якщо хоч одна не задана/не валідна — пропускаємо
    if (!schedulePublish || !scheduleExpire) return;

    if (schedulePublish > scheduleExpire) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduleExpire"],
        message:
          "scheduleExpire must be the same day or later than schedulePublish",
      });
    }
  });

export type PublishingFormInputType = z.input<typeof publishingFormSchema>;
