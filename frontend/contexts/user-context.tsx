"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SWRConfig } from "swr";
import { fetcherUser } from "../lib/fetcher";

interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
  favorites: number[];
  showDisclaimer: boolean;
  registrationDate: string;
  notifications: number;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  login: (email: string, name: string) => void;
  logout: () => void;
  toggleFavorite: (resourceId: number) => void;
  updateSettings: (settings: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john.doe@example.com",
    isLoggedIn: true, // Set to true for demo purposes
    favorites: [1, 3, 9], // MyPay, SGLI, TRICARE
    showDisclaimer: true,
    registrationDate: "2024-01-15",
    notifications: 2,
  });

  const login = (email: string, name: string) => {
    setUser((prev) => ({
      ...prev,
      email,
      name,
      isLoggedIn: true,
      registrationDate: new Date().toISOString().split("T")[0],
    }));
  };

  const logout = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
      favorites: [],
      notifications: 0,
    }));
  };

  const toggleFavorite = (resourceId: number) => {
    setUser((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(resourceId)
        ? prev.favorites.filter((id) => id !== resourceId)
        : [...prev.favorites, resourceId],
    }));
  };

  const updateSettings = (settings: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...settings }));
  };

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
        dedupingInterval: 2000
      }}
    >
      <UserContext.Provider
        value={{ user, setUser, login, logout, toggleFavorite, updateSettings }}
      >
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
