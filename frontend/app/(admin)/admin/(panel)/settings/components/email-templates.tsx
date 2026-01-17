"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { Textarea } from "../../../../../../components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { emailTemplatesSchema } from "../../../../../../lib/schemas/email-templates-schema";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";
import { cn } from "../../../../../../lib/utils";

export function EmailTemplates() {
  const { data, isValidating, mutate } = useSWR<{
    emailVerification: string | null;
    passwordReset: string | null;
  }>("/admin/setting/email-templates");

  const [statusSave, setStatusSave] = useState<ButtonSubmitStatus>("idle");
  const [statusReset, setStatusReset] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(emailTemplatesSchema),
    values: data
      ? {
          emailVerification: data.emailVerification || "",
          passwordReset: data.passwordReset || "",
        }
      : {
          emailVerification: "",
          passwordReset: "",
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

      await fetcherAdmin(`/admin/setting/email-templates`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      await fetcherAdmin(`/admin/setting/email-templates/reset`, {
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
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Customize email templates sent to users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formError ? <ErrorAlert message={formError} /> : null}

            
            <div>
              <Textarea
                label="Email Verification *"
                {...form.register('emailVerification')}
                rows={2}
                className={cn(form.formState.errors.emailVerification ? "border-destructive" : "")}
                error={!!form.formState.errors.emailVerification}
                errorMessage={form.formState.errors.emailVerification?.message}
                placeholder="Please verify your email address..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.watch('emailVerification')?.length || 0}
                /5000 characters
              </p>
            </div>

            <div>
              <Textarea
                label="Password Reset *"
                {...form.register('passwordReset')}
                rows={2}
                className={cn(form.formState.errors.passwordReset ? "border-destructive" : "")}
                error={!!form.formState.errors.passwordReset}
                errorMessage={form.formState.errors.passwordReset?.message}
                placeholder="You requested a password reset..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.watch('passwordReset')?.length || 0}
                /5000 characters
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
