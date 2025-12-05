"use client";

import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { useUser } from "../contexts/user-context";

export function UserCheck({ children }: { children: JSX.Element }) {
  const { data, isValidating } = useSWR("/users/self");
  const { setUser } = useUser();

  if (data) {
    setUser(data);
  }

  if (isValidating) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }
  return <>{children}</>;
}
