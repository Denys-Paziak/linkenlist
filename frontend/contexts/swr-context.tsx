"use client";

import { SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

export function SWRProvider({ children, role }: { children: React.ReactNode, role: "admin" | "user" }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher(role),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        keepPreviousData: true,
        shouldRetryOnError: false,
        errorRetryCount: 0,
      }}
    >
      {children}
    </SWRConfig>
  );
}
