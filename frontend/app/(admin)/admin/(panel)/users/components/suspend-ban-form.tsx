"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../../../../components/ui/button";
import { DialogFooter } from "../../../../../../components/ui/dialog";
import { Textarea } from "../../../../../../components/ui/textarea";
import { Label } from "../../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { cn } from "../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { IUserTable } from "../../../../../../types/User";
import { KeyedMutator } from "swr";

export function SuspendBanForm({
  onCancel,
  user,
  mutate,
}: {
  onCancel: () => void;
  user: IUserTable;
  mutate: KeyedMutator<[IUserTable[], number]>;
}) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        duration: z.string().trim().min(1, "Duration is required."),
        reason: z.string().trim().min(1, "Reason is required."),
      })
    ),
    values: {
      duration: "7",
      reason: "",
    },
    mode: "onBlur",
  });

  const block = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    setStatus("loading");
    try {
      const values = form.getValues();

      await fetcherAdmin(`/admin/users/${user.id}/ban-user`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          values.duration === "permanent"
            ? {
                permanent: true,
                reason: values.reason,
              }
            : {
                duration: Number(values.duration),
                reason: values.reason,
              }
        ),
      });

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  const unblock = async () => {
    setFormError(null);

    setStatus("loading");
    try {
      await fetcherAdmin(`/admin/users/${user.id}/unban-user`, {
        method: "PATCH",
        credentials: "include",
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
        onCancel()
        mutate();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const loading = status === "loading";

  const isBaned =
    user?.banExpirationDate &&
    new Date(user?.banExpirationDate).getTime() > new Date().getTime();

  if (isBaned) {
    return (
      <fieldset disabled={loading}>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <ButtonSubmit
            type="button"
            onClick={unblock}
            status={status}
            statusText={{
              loading: "Unblocking...",
              success: "Unblocked",
              error: "Try again",
              disabled: "Disabled",
            }}
            className="font-semibold"
          >
            Unblock User
          </ButtonSubmit>
        </DialogFooter>
      </fieldset>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={loading} className="space-y-4">
        {formError ? <ErrorAlert message={formError} /> : null}
        <div>
          <Label htmlFor="duration">Duration *</Label>
          <Controller
            name="duration"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={(value) => {
                  form.setValue("duration", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger
                  className={cn(
                    form.formState.errors.duration
                      ? "border-destructive bg-background focus:border-destructive"
                      : "bg-background border border-input"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label>Reason *</Label>
          <Textarea
            {...form.register("reason")}
            error={!!form.formState.errors.reason}
            errorMessage={form.formState.errors.reason?.message}
            placeholder="Explain the reason for suspension..."
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <ButtonSubmit
            type="button"
            onClick={block}
            status={status}
            statusText={{
              loading: "Suspension...",
              success: "Suspended",
              error: "Try again",
              disabled: "Disabled",
            }}
            className="font-semibold"
          >
            Suspend User
          </ButtonSubmit>
        </DialogFooter>
      </fieldset>
    </form>
  );
}
