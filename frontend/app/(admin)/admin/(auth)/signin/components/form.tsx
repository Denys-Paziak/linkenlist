"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { cn } from "../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";

export function Form() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});
  const [formData, setFormData] = useState({ email: "", password: "" });

  // --- Validators ---
  const validateField = (
    name: keyof typeof errors,
    value: string
  ): string | undefined => {
    if (name === "email") {
      if (!value.trim()) return "Email is required.";
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!ok) return "Enter a valid email address.";
    }
    if (name === "password") {
      if (!value.trim()) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
      if (value.length > 64)
        return "The password must consist of no more than 64 characters.";
    }
    return undefined;
  };

  const validateForm = (data = formData) => {
    return {
      email: validateField("email", data.email),
      password: validateField("password", data.password),
    } as Partial<typeof errors>;
  };

  // --- Handlers ---
  const handleBlur = (field: keyof typeof formData) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((e) => ({ ...e, [field]: err }));
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((s) => ({ ...s, [field]: value }));

      if (touched[field]) {
        const err = validateField(field, value);
        setErrors((e) => ({ ...e, [field]: err }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((e) => ({ ...e, form: undefined }));

    const v = validateForm();
    if (v.email || v.password) {
      setErrors((e) => ({ ...e, ...v }));
      setTouched({ email: true, password: true });
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/admin/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setStatus("success");
      router.push("/admin");
    } catch {
      const msg = "Login failed. Please check your credentials and try again.";
      setErrors((e) => ({ ...e, form: msg }));
      setStatus("error");
    }
  };

  // --- Error flags
  const emailHasError = touched.email && Boolean(errors.email);
  const passwordHasError = touched.password && Boolean(errors.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      {errors.form ? <ErrorAlert message={errors.form} /> : null}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          onBlur={() => handleBlur("email")}
          aria-invalid={emailHasError || undefined}
          aria-describedby={emailHasError ? "email-error" : undefined}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors",
            emailHasError
              ? "border-destructive focus:border-destructive"
              : "border-gray-300 focus:border-primary"
          )}
          placeholder="Enter your email"
        />
        {emailHasError ? (
          <p id="email-error" className="mt-1 text-sm text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange("password")}
            onBlur={() => handleBlur("password")}
            aria-invalid={passwordHasError || undefined}
            aria-describedby={passwordHasError ? "password-error" : undefined}
            className={cn(
              "w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none transition-colors",
              passwordHasError
                ? "border-destructive focus:border-destructive"
                : "border-gray-300 focus:border-primary"
            )}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            disabled={status === "loading"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-foreground/50" />
            ) : (
              <Eye className="h-5 w-5 text-foreground/50" />
            )}
          </button>
        </div>
        {passwordHasError ? (
          <p id="password-error" className="mt-1 text-sm text-destructive">
            {errors.password}
          </p>
        ) : null}
      </div>

      <ButtonSubmit
        type="submit"
        status={status}
        statusText={{
          loading: "Signing in...",
          success: "Welcome!",
          error: "Try again",
        }}
        className="w-full font-bold py-3 "
        disabled={status === "loading"}
      >
        Sign In
      </ButtonSubmit>
    </form>
  );
}
