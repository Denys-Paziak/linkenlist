"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface UserContextType {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

const Context = createContext<UserContextType | undefined>(undefined);

export function SearchContext({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<string>("");

  return (
    <Context.Provider value={{ query, setQuery }}>
      {children}
    </Context.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}
