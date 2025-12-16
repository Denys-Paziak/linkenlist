"use client";

import { useEffect, useState } from "react";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "../../../../../../lib/schemas/admin-login-schema";
import { Input } from "../../../../../../components/ui/input";

export function Form() {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");

  const [formError, setFormError] = useState<string | null>(null);
  console.log(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  console.log(process.env.NEXT_PUBLIC_API_URL)
  const form = useForm({
    resolver: zodResolver(adminLoginSchema),
    values: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) return;

    setStatus("loading");

    try {
      const values = form.getValues();

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/admin/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setStatus("success");
      window.location.href = "/admin";
    } catch {
      setFormError(
        "Login failed. Please check your credentials and try again."
      );
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={status === "loading"} className="space-y-3">
        {formError ? <ErrorAlert message={formError} /> : null}

        <Input
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          {...form.register("email")}
          error={!!form.formState.errors.email}
          errorMessage={form.formState.errors.email?.message}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
          {...form.register("password")}
          error={!!form.formState.errors.email}
          errorMessage={form.formState.errors.email?.message}
        />

        <ButtonSubmit
          type="button"
          status={status}
          statusText={{
            loading: "Signing in...",
            success: "Welcome!",
            error: "Try again",
          }}
          className="w-full font-bold py-3 "
          onClick={handleSubmit}
        >
          Sign In
        </ButtonSubmit>
      </fieldset>
    </form>
  );
}
