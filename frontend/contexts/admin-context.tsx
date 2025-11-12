"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SWRConfig } from "swr";
import { fetcherAdmin } from "../lib/fetcher";

interface AdminContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  showModalUnsavedChanges: boolean;
  setShowModalUnsavedChanges: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showModalUnsavedChanges, setShowModalUnsavedChanges] = useState(false);

  return (
    <SWRConfig
      value={{
        fetcher: fetcherAdmin,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        keepPreviousData: true,
        shouldRetryOnError: false,
        errorRetryCount: 0,
        dedupingInterval: 2000
      }}
    >
      <AdminContext.Provider
        value={{
          hasUnsavedChanges,
          setHasUnsavedChanges,
          showModalUnsavedChanges,
          setShowModalUnsavedChanges,
        }}
      >
        {children}
      </AdminContext.Provider>
    </SWRConfig>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}
