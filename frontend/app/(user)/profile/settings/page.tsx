"use client";

import { AccountInformation } from "./components/account-information";
import { PublicProfile } from "./components/public-profile";
import { DisplayPreferences } from "./components/display-preferences";
import { AccountActions } from "./components/account-actions";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { IUser } from "../../../../types/User";
import { useEffect } from "react";

export default function SettingsPage() {
  const { data, error, isLoading, isValidating } = useSWR<IUser>("/users/self");

  const router = useRouter();

  useEffect(() => {
    if (error || (!data && !(isLoading || isValidating))) {
      router.push("/auth/signin?tab=login");
      return;
    }
  }, [data, error])

  return (
    <main className="flex-grow w-full px-6 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#222222] mb-2">Settings</h1>
          <p className="text-[#222222]/70">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          <AccountInformation user={data} />

          <PublicProfile user={data} />

          <DisplayPreferences user={data} />

          <AccountActions />
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-[#222222]/70 hover:text-primary text-sm font-medium transition-colors"
          >
            ← Back to LinkEnlist Home
          </a>
        </div>
      </div>
    </main>
  );
}
