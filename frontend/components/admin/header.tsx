"use client";

import useSWR from "swr";
import { HasUnsavedChanges } from "./has-unsaved-changes";
import { SafeLink } from "./safe-link";

export function Header() {
  useSWR("/admin/users/self");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <HasUnsavedChanges />
        </div>
        <SafeLink
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Site
        </SafeLink>
      </div>
    </header>
  );
}
