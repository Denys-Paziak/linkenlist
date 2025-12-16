"use client";

import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { IUser } from "../types/User";

export function UserCheck({ children }: { children: JSX.Element }) {
  const { isLoading } = useSWR<IUser>("/users/self");

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }
  return <>{children}</>;
}
