"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { SWRConfig } from "swr";
import { fetcherUser } from "../lib/fetcher";
import Script from "next/script";

interface UserContextType {
  showLoginModal: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  return (
    <SWRConfig
      value={{
        fetcher: fetcherUser,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        keepPreviousData: true,
        shouldRetryOnError: false,
        errorRetryCount: 0,
        dedupingInterval: 2000,
      }}
    >
      <UserContext.Provider
        value={{ showLoginModal, setShowLoginModal }}
      >
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => {
            (window as any).turnstileLoaded = true;
          }}
          defer
        />
        {children}
      </UserContext.Provider>
    </SWRConfig>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
