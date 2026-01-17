"use client";

import { useEffect, useState } from "react";
import { Label } from "../../../../../../components/ui/label";
import { Button } from "../../../../../../components/ui/button";
import { DialogFooter } from "../../../../../../components/ui/dialog";
import { Input } from "../../../../../../components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { IUserTable } from "../../../../../../types/User";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";

export function ResetPasswordForm({
  onCancel,
  user,
}: {
  onCancel: () => void;
  user: IUserTable;
}) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        password: z
          .string()
          .trim()
          .min(1, "Password is required.")
          .min(8, "Password must be at least 8 characters.")
          .max(64, "The password must consist of no more than 64 characters."),
      })
    ),
    values: {
      password: "",
    },
    mode: "onBlur",
  });

  const submitForm = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    setStatus("loading");
    try {
      const values = form.getValues();

      await fetcherAdmin(`/admin/users/${user.id}/reset-password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temporaryPassword: values.password,
        }),
      });

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        setStatus("idle");
        onCancel();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const loading = status === "loading";

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={loading} className="space-y-4">
        {formError ? <ErrorAlert message={formError} /> : null}

        <div>
          <Label>Temporary Password</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              {...form.register("password")}
              placeholder="Enter temporary password"
              error={!!form.formState.errors.password}
              errorMessage={form.formState.errors.password?.message}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.setValue("password", generatePassword(), {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              Generate
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
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
          >
            Set Password
          </ButtonSubmit>
        </DialogFooter>
      </fieldset>
    </form>
  );
}

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
