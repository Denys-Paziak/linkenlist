"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { Input } from "../../../../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { generalSettingsSchema } from "../../../../../../lib/schemas/general-settings-schema";
import { useEffect, useState } from "react";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";

export function GeneralSettings() {
  const { data, isValidating, mutate } = useSWR<{
    title: string | null;
    description: string | null;
  }>("/setting/general-settings");

  const [statusSave, setStatusSave] = useState<ButtonSubitStatus>("idle");
  const [statusReset, setStatusReset] = useState<ButtonSubitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(generalSettingsSchema),
    values: data
      ? {
          siteName: data.title || "",
          siteDescription: data.description || "",
        }
      : {
          siteName: "",
          siteDescription: "",
        },
    mode: "onBlur",
  });

  const save = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    setStatusSave("loading");
    try {
      const values = form.getValues();

      await fetcherAdmin(`/admin/setting/general-settings`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      await mutate();
      setStatusSave("success");
      form.reset();
    } catch (err: any) {
      setStatusSave("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  const reset = async () => {
    setFormError(null);

    setStatusReset("loading");
    try {
      await fetcherAdmin(`/admin/setting/general-settings/reset`, {
        method: "PUT",
        credentials: "include",
      });

      await mutate();
      setStatusReset("success");
      form.reset();
    } catch (err: any) {
      setStatusReset("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (statusSave === "success" || statusSave === "error") {
      const timer = setTimeout(() => setStatusSave("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (statusReset === "success" || statusReset === "error") {
      const timer = setTimeout(() => setStatusReset("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusSave, statusReset]);

  const loading =
    isValidating || statusSave === "loading" || statusReset === "loading";

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={loading || !data}>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic site configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError ? <ErrorAlert message={formError} /> : null}

            <div>
              <Input
                label="Home Title *"
                placeholder="Enter deal title"
                {...form.register("siteName")}
                error={!!form.formState.errors.siteName}
                errorMessage={form.formState.errors.siteName?.message}
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.watch("siteName")?.length || 0}/100 characters
              </p>
            </div>
            <div>
              <Input
                label="Home Description"
                placeholder="Enter deal title"
                {...form.register("siteDescription")}
                error={!!form.formState.errors.siteDescription}
                errorMessage={form.formState.errors.siteDescription?.message}
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.watch("siteDescription")?.length || 0}/500 characters
              </p>
            </div>

            <div className="flex gap-4">
              <ButtonSubmit
                type="button"
                onClick={save}
                status={statusSave}
                statusText={{
                  loading: "Saving...",
                  success: "Saved",
                  error: "Try again",
                  disabled: "Disabled",
                }}
              >
                Save Changes
              </ButtonSubmit>
              <ButtonSubmit
                type="button"
                onClick={reset}
                status={statusReset}
                statusText={{
                  loading: "Resetting…",
                  success: "Reset",
                  error: "Try again",
                  disabled: "Disabled",
                }}
                variant="outline"
              >
                Reset to Defaults
              </ButtonSubmit>
            </div>
          </CardContent>
        </Card>
      </fieldset>
    </form>
  );
}
