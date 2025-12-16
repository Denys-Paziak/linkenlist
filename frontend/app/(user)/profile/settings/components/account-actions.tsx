"use client";

import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../components/ui/button-submit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAccountSchema } from "../../../../../lib/schemas/delete-account-schema";
import { fetcherUser } from "../../../../../lib/fetcher";
import { mutate } from "swr";
import { cn } from "../../../../../lib/utils";
import { ErrorAlert } from "../../../../../components/ui/error-alert";
import { changePasswordSchema } from "../../../../../lib/schemas/change-password-schema";
import { changeEmailSchema } from "../../../../../lib/schemas/change-email-schema";
import { Input } from "../../../../../components/ui/input";

export function AccountActions() {
  const [isAccountActionsOpen, setIsAccountActionsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-primary/30 p-6">
      <button
        onClick={() => setIsAccountActionsOpen(!isAccountActionsOpen)}
        className="w-full flex items-center justify-between text-xl font-bold text-[#222222] hover:text-primary transition-colors"
      >
        <span>Account Actions</span>
        {isAccountActionsOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {isAccountActionsOpen && (
        <div className="space-y-4 mt-4  animate-in slide-in-from-top-2 duration-200">
          <ChangeEmail
            activeAction={activeAction}
            setActiveAction={setActiveAction}
          />

          <ChangePassword
            activeAction={activeAction}
            setActiveAction={setActiveAction}
          />

          <div className="border-t border-gray-200 my-4"></div>

          <DeleteAccount
            activeAction={activeAction}
            setActiveAction={setActiveAction}
          />
        </div>
      )}
    </div>
  );
}

function ChangeEmail({
  activeAction,
  setActiveAction,
}: {
  activeAction: string | null;
  setActiveAction: (value: string | null) => void;
}) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(changeEmailSchema),
    values: { currentPassword: "", newEmail: "" },
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

      await fetcherUser(`/users/self/change-email`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      setStatus("success");
      form.reset();
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

  return (
    <div className="border border-primary/30 rounded-lg p-4">
      <button
        onClick={() =>
          setActiveAction(activeAction === "email" ? null : "email")
        }
        className="w-full flex items-center gap-3 text-left font-medium text-[#222222] hover:text-primary transition-colors"
      >
        <Mail className="h-5 w-5" />
        Change Email
      </button>

      {activeAction === "email" && (
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <fieldset
            disabled={status === "loading"}
            className="mt-4 space-y-3 border-t border-primary/20 pt-4"
          >
            <Input
              label="Current Password"
              placeholder="Enter current password"
              type="password"
              {...form.register("currentPassword")}
              error={!!form.formState.errors.currentPassword}
              errorMessage={form.formState.errors.currentPassword?.message}
            />
            <Input
              label="New Email"
              placeholder="Enter new email address"
              type="email"
              {...form.register("newEmail")}
              error={!!form.formState.errors.newEmail}
              errorMessage={form.formState.errors.newEmail?.message}
            />
            <ButtonSubmit
              type="button"
              onClick={() => submitForm()}
              status={status}
              statusText={{
                loading: "Send...",
                success: "Sent",
                error: "Try again",
                disabled: "Disabled",
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Send email
            </ButtonSubmit>
            {formError ? <ErrorAlert message={formError} /> : null}
          </fieldset>
        </form>
      )}
    </div>
  );
}

function ChangePassword({
  activeAction,
  setActiveAction,
}: {
  activeAction: string | null;
  setActiveAction: (value: string | null) => void;
}) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    values: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
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

      await fetcherUser(`/users/self/change-password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      setStatus("success");
      form.reset();
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

  return (
    <div className="border border-primary/30 rounded-lg p-4">
      <button
        onClick={() =>
          setActiveAction(activeAction === "password" ? null : "password")
        }
        className="w-full flex items-center gap-3 text-left font-medium text-[#222222] hover:text-primary transition-colors"
      >
        <Lock className="h-5 w-5" />
        Change Password
      </button>

      {activeAction === "password" && (
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <fieldset
            disabled={status === "loading"}
            className="mt-4 space-y-3 border-t border-primary/20 pt-4"
          >
            {formError ? <ErrorAlert message={formError} /> : null}
            <Input
              label="Current Password"
              placeholder="Enter current password"
              type="password"
              {...form.register("currentPassword")}
              error={!!form.formState.errors.currentPassword}
              errorMessage={form.formState.errors.currentPassword?.message}
            />
            <Input
              label="New Password"
              placeholder="Enter new password"
              type="password"
              {...form.register("newPassword")}
              onBlur={() => {
                form.trigger("newPassword");
                if (form.watch("confirmNewPassword")) {
                  form.trigger("confirmNewPassword");
                }
              }}
              error={!!form.formState.errors.newPassword}
              errorMessage={form.formState.errors.newPassword?.message}
            />
            <Input
              label="Confirm New Password"
              placeholder="Confirm new password"
              type="password"
              {...form.register("confirmNewPassword")}
              error={!!form.formState.errors.confirmNewPassword}
              errorMessage={form.formState.errors.confirmNewPassword?.message}
            />
            <ButtonSubmit
              type="button"
              onClick={() => submitForm()}
              status={status}
              statusText={{
                loading: "Changes...",
                success: "Changed",
                error: "Try again",
                disabled: "Disabled",
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Change Password
            </ButtonSubmit>
          </fieldset>
        </form>
      )}
    </div>
  );
}

function DeleteAccount({
  activeAction,
  setActiveAction,
}: {
  activeAction: string | null;
  setActiveAction: (value: string | null) => void;
}) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(deleteAccountSchema),
    values: { password: "" },
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

      await fetcherUser(`/users/self`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      setStatus("success");
      form.reset();
      mutate("/users/self", () => null, { revalidate: false });
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

  return (
    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
      <button
        onClick={() =>
          setActiveAction(activeAction === "delete" ? null : "delete")
        }
        className="w-full flex items-center gap-3 text-left font-medium text-red-600 hover:text-red-700 transition-colors"
      >
        <Trash2 className="h-5 w-5" />
        Delete Account
      </button>

      {activeAction === "delete" && (
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <fieldset
            disabled={status === "loading"}
            className="mt-4 space-y-3 border-t border-red-200 pt-4"
          >
            {formError ? <ErrorAlert message={formError} /> : null}

            <p className="text-sm text-red-600">
              This action cannot be undone. This will permanently delete your
              account and remove all your data.
            </p>
            <Input
              label="Current Password"
              placeholder="Enter current password"
              type="password"
              {...form.register("password")}
              error={!!form.formState.errors.password}
              errorMessage={form.formState.errors.password?.message}
            />
            <ButtonSubmit
              type="button"
              onClick={() => submitForm()}
              status={status}
              statusText={{
                loading: "Deletion...",
                success: "Deleted",
                error: "Try again",
                disabled: "Disabled",
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Delete
            </ButtonSubmit>
          </fieldset>
        </form>
      )}
    </div>
  );
}
