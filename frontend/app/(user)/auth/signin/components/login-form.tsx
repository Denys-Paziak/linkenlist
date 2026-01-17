"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../components/ui/button-submit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "../../../../../lib/schemas/user-login-schema";
import { ErrorAlert } from "../../../../../components/ui/error-alert";
import { mutate } from "swr";
import { Input } from "../../../../../components/ui/input";

export function LoginFrom({ token }: { token: string | null }) {
  const router = useRouter();

  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");

  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(userLoginSchema),
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
        process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "cf-turnstile-response": token || "",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.message);
      }

      setStatus("success");
      router.push("/");
      mutate("/users/self");
    } catch (err) {
      setFormError(
        (err as any).message ||
          "Login failed. Please check your credentials and try again."
      );
      if (window.turnstile?.reset) {
        window.turnstile.reset();
      }
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
          error={!!form.formState.errors.password}
          errorMessage={form.formState.errors.password?.message}
        />
        <ButtonSubmit
          type="button"
          status={status}
          statusText={{
            loading: "Signing in...",
            success: "Welcome!",
            error: "Try again",
          }}
          onClick={handleSubmit}
          className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
        >
          Sign In
        </ButtonSubmit>
      </fieldset>
    </form>
  );
}
