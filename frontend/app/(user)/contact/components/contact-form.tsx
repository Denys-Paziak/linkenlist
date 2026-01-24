"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { contactFormSchema } from "../../../../lib/schemas/contact-form-schema";
import { Turnstile } from "../../../../components/turnstile";
import Link from "next/link";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../components/ui/button-submit";
import { fetcherUser } from "../../../../lib/fetcher";
import { IUser } from "../../../../types/User";
import useSWR from "swr";
import { ErrorAlert } from "../../../../components/ui/error-alert";

export function ContactForm() {
  const { data: user } = useSWR<IUser>("/users/self");

  const [saveStatus, setSaveStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    values: {
      name: "",
      email: "",
      type: "General Question" as const,
      subject: "",
      message: "",
    },
    mode: "onTouched",
  });

  const messageValue = form.watch("message");
  const messageLen = useMemo(
    () => (messageValue ? messageValue.length : 0),
    [messageValue],
  );

  const handleSubmitAuth = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    setSaveStatus("loading");

    try {
      const values = form.getValues();

      await fetcherUser("/contact-inbox/contact-us/auth", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      setSaveStatus("success");
      form.reset();
    } catch (err) {
      setFormError(
        (err as any).message ||
          "An unexpected error occurred. Please try again.",
      );
      setSaveStatus("error");
    }
  };

  const handleSubmitCaptha = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    setSaveStatus("loading");

    try {
      const values = form.getValues();

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/contact-inbox/contact-us/captcha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "cf-turnstile-response": token || "",
          },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.message);
      }

      setSaveStatus("success");
      form.reset();
    } catch (err) {
      setFormError(
        (err as any).message ||
          "An unexpected error occurred. Please try again.",
      );
      if (window.turnstile?.reset) {
        window.turnstile.reset();
      }
      setSaveStatus("error");
    }
  };

  useEffect(() => {
    if (saveStatus === "success" || saveStatus === "error") {
      const timer = setTimeout(() => setSaveStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        {formError ? <ErrorAlert message={formError} /> : null}

        <form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          className="space-y-6"
        >
          <fieldset
            disabled={saveStatus === "loading"}
            className="mb-1 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  {...form.register("name")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    form.formState.errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {form.formState.errors.name?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  {...form.register("email")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    form.formState.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {form.formState.errors.email?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">
                Message Type *
              </label>
              <select
                {...form.register("type")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  form.formState.errors.type
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="General Question">General Question</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Resource Submission/Update">
                  Resource Submission/Update
                </option>
                <option value="Deal Submission">Deal Submission</option>
                <option value="Partnership Inquiry">Partnership Inquiry</option>
                <option value="Feedback/Suggestion">Feedback/Suggestion</option>
                <option value="Other">Other</option>
              </select>
              {form.formState.errors.type?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">
                Subject *
              </label>
              <input
                type="text"
                placeholder="Brief description of your message"
                {...form.register("subject")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  form.formState.errors.subject
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {form.formState.errors.subject?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">
                Message *
              </label>
              <textarea
                rows={6}
                placeholder="Please provide as much detail as possible..."
                {...form.register("message")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical ${
                  form.formState.errors.message
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="flex items-center justify-between mt-1">
                <div>
                  {form.formState.errors.message?.message && (
                    <p className="text-xs text-red-600">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-[#222222]/60">
                  {messageLen}/1000 characters
                </div>
              </div>
            </div>
          </fieldset>

          {!user && (
            <div className="mx-auto w-fit">
              <Turnstile onToken={(token) => setToken(token)} />
            </div>
          )}

          {saveStatus === "success" && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Thank you for your message! We&apos;ll get back to you soon.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/"
              className="px-6 py-3 border-2 border-[#222222] text-[#222222] rounded-lg hover:bg-[#222222] hover:text-white transition-colors text-center"
            >
              Cancel
            </Link>
            <ButtonSubmit
              type="button"
              status={saveStatus}
              statusText={{
                loading: "Sending...",
                success: "Sent",
                error: "Try again",
              }}
              onClick={() => {
                if (user) {
                  handleSubmitAuth();
                } else {
                  handleSubmitCaptha();
                }
              }}
              className={`flex-1 px-6 py-3 h-full text-base rounded-lg border-2 transition-colors font-medium bg-accent text-white border-accent hover:bg-accent/90 `}
            >
              Send Message
            </ButtonSubmit>
          </div>
        </form>
      </div>
    </div>
  );
}
