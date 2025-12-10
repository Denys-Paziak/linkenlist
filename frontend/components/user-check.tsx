"use client";

import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { useUser } from "../contexts/user-context";
import { useEffect } from "react";

export function UserCheck({ children }: { children: JSX.Element }) {
  const { data, isLoading } = useSWR("/users/self");
  const { setUser } = useUser();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }
  return <>{children}</>;
}
