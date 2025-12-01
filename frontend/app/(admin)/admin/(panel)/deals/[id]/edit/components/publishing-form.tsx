"use client";

import { Calendar, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../../components/ui/select";
import { Switch } from "../../../../../../../../components/ui/switch";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { IDeal } from "../../../../../../../../types/Deal";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../../../components/ui/button-submit";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dealStatuses,
  publishingFormSchema,
} from "../../../../../../../../lib/schemas/deal/publishing-form-schema";
import { cn, isoToDatetimeLocal, pickDirty } from "../../../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../../../lib/fetcher";

export function PublishingForm() {
  const { id: dealId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IDeal>(
    dealId ? `/admin/deals/${dealId}` : null
  );

  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(publishingFormSchema),
    values: data
      ? {
          status: data.status || dealStatuses[0],
          schedulePublish: isoToDatetimeLocal(data.publishAt) || "",
          scheduleExpire: isoToDatetimeLocal(data.expireAt) || "",
          showComments: data.commentsEnabled ?? true,
        }
      : {
          status: dealStatuses[0],
          schedulePublish: "",
          scheduleExpire: "",
          showComments: true,
        },
    mode: "onBlur",
  });

  const submitForm = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    setStatus("loading");
    try {
      const values = form.getValues();
      const dirty = pickDirty(values, form.formState.dirtyFields);

      await fetcherAdmin(`/admin/deals/${dealId}/change-status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dirty,
          status: values.status,
          schedulePublish: dirty.schedulePublish ? new Date(dirty.schedulePublish as string).toISOString() : undefined,
          scheduleExpire: dirty.scheduleExpire ? new Date(dirty.scheduleExpire as string).toISOString() : undefined,
        }),
      });

      mutate().then(() => {
        setStatus("success");
        form.reset();
      });
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const loading = isValidating || status === "loading";
  const loadError = error ? (error as any)?.message ?? "Failed to load" : null;

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={loading || !data}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Publishing Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadError ? <ErrorAlert message={loadError} /> : null}
            {formError ? <ErrorAlert message={formError} /> : null}
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status *
              </label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      form.setValue("status", value as any, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.status && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dealStatuses.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.status ? (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.status.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Schedule Publish */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Schedule Publish
                </label>
                <input
                  {...form.register("schedulePublish")}
                  type="datetime-local"
                  className={cn(
                    "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                    form.formState.errors.schedulePublish
                      ? "border-destructive focus:border-destructive"
                      : "border-input"
                  )}
                />
                {form.formState.errors.schedulePublish ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.schedulePublish.message}
                  </p>
                ) : null}
              </div>

              {/* Schedule Expire */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Schedule Expire
                </label>
                <input
                  {...form.register("scheduleExpire")}
                  type="datetime-local"
                  className={cn(
                    "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                    form.formState.errors.scheduleExpire
                      ? "border-destructive focus:border-destructive"
                      : "border-input"
                  )}
                />
                {form.formState.errors.scheduleExpire ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.scheduleExpire.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Enable Comments */}
            <div className="flex items-center space-x-2">
              <Controller
                control={form.control}
                name="showComments"
                render={({ field }) => (
                  <>
                    <Switch
                      id="allowIndexing"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                    <label
                      htmlFor="allowIndexing"
                      className="text-sm text-gray-600"
                    >
                      Enable Comments for this Deal
                    </label>
                  </>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <ButtonSubmit
                type="button"
                onClick={() => submitForm()}
                status={status}
                statusText={{
                  loading: "Saving...",
                  success: "Saved",
                  error: "Try again",
                  disabled: "Disabled",
                }}
                className="font-semibold"
                disabled={loading || !data}
              >
                <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                Save Deal
              </ButtonSubmit>
            </div>
          </CardContent>
        </Card>
      </fieldset>
    </form>
  );
}
