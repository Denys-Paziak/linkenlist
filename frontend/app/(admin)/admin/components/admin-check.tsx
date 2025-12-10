"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export function AdminCheck({ children }: { children: JSX.Element }) {
  const { error, data } = useSWR("/admin/users/self");
  const router = useRouter();

  if (error) {
    router.push("/admin/signin");
  }

  if (data) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <Loader2 className="animate-spin w-12 h-12" />
    </div>
  );
}
