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
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../../components/ui/button-submit";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dealStatuses,
  publishingFormSchema,
} from "../../../../../../../../lib/schemas/deal/publishing-form-schema";
import {
  cn,
  isoToDatetimeLocal,
  pickDirty,
} from "../../../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../../../lib/fetcher";
import { Label } from "../../../../../../../../components/ui/label";
import { Input } from "../../../../../../../../components/ui/input";

export function PublishingForm() {
  const { id: dealId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IDeal>(
    dealId ? `/admin/deals/${dealId}` : null
  );

  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
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

      const schedule = (key: "schedulePublish" | "scheduleExpire") => {
        if (dirty[key]) {
          return new Date(dirty[key] as string).toISOString();
        }
        if (dirty[key] === "") {
          return null;
        }
        return undefined;
      };

      await fetcherAdmin(`/admin/deals/${dealId}/change-status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dirty,
          status: values.status,
          schedulePublish: schedule("schedulePublish"),
          scheduleExpire: schedule("scheduleExpire"),
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
              <Label>Status *</Label>
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
                        form.formState.errors.status
                          ? "border-destructive bg-background focus:border-destructive"
                          : "bg-background border border-input"
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
              <Input
                label="Schedule Publish"
                {...form.register("schedulePublish")}
                type="date"
                error={!!form.formState.errors.schedulePublish}
                errorMessage={form.formState.errors.schedulePublish?.message}
              />

              {/* Schedule Expire */}
              <Input
                label="Schedule Expire"
                {...form.register("scheduleExpire")}
                type="date"
                error={!!form.formState.errors.scheduleExpire}
                errorMessage={form.formState.errors.scheduleExpire?.message}
              />
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
                    <Label
                      htmlFor="allowIndexing"
                      className="text-sm mb-0 text-gray-600"
                    >
                      Enable Comments for this Deal
                    </Label>
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
