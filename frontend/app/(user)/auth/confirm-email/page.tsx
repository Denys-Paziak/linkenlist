"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { Check, X } from "lucide-react";

export default function ConfirmEmail() {
  const [message] = useQueryState("message");

  if (message) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
            <X className="w-10 h-10 text-red-600"/>
          </div>

          <h1 className="text-2xl font-semibold text-red-700">
            Confirmation Failed
          </h1>

          <p className="text-foreground/70 text-sm">
            {message}
          </p>

          <Link
            href="./signin?tab=register"
            className="inline-block w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
          >
            Try Again
          </Link>

          <p className="text-xs text-foreground/50">
            You can request a new confirmation link by registering again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
          <Check className="w-10 h-10 text-green-600"/>
        </div>

        <h1 className="text-2xl font-semibold text-foreground">
          Email Confirmed
        </h1>

        <p className="text-foreground/70 text-sm">
          Your email address has been successfully verified. You can now log
          into your account.
        </p>

        <Link
          href="/profile"
          className="inline-block w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
        >
          Go to Profile
        </Link>

        <p className="text-xs text-foreground/50">
          If the login doesn’t work, try refreshing the page.
        </p>
      </div>
    </div>
  );
}
