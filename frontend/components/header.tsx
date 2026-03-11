"use client";

import type React from "react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Settings, LogOut, Home } from "lucide-react";
import { useScrollManager } from "@/lib/scroll-manager";
import { ButtonSubmitStatus, renderStatusIcon } from "./ui/button-submit";
import { fetcherUser } from "../lib/fetcher";
import useSWR, { mutate } from "swr";
import { IUser } from "../types/User";
import { NotificationsButton } from "./notifications-button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const scrollManager = useScrollManager();

  const { data: user } = useSWR<IUser>("/users/self");

  useEffect(() => {
    if (isMobileMenuOpen) {
      scrollManager.freezeBackground();
    } else {
      scrollManager.unfreezeBackground();
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      scrollManager.unfreezeBackground();
    };
  }, [isMobileMenuOpen, scrollManager]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen &&
        !(event.target as Element).closest(".profile-dropdown-container")
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <header className="bg-primary shadow-sm border-b border-primary-foreground sticky top-0 z-[1000]">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-base font-bold text-white hover:text-white/80 transition-colors cursor-pointer">
                LinkEnlist.com
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md"
            >
              Home
            </Link>
            <Link
              href="/realestate"
              className="px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md"
            >
              Real Estate
            </Link>
            <Link
              href="/links"
              className="px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md"
            >
              Links
            </Link>
            <Link
              href="/deals"
              className="px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md"
            >
              Deals
            </Link>
            <Link
              href="/resources"
              className="px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md"
            >
              Resources
            </Link>

            {/* Auth-aware section */}
            {user ? (
              <div className="flex items-center space-x-1">
                <div className="relative profile-dropdown-container">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md font-bold"
                  >
                    Profile
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[1010] animate-in slide-in-from-top-2 duration-200">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-bold text-foreground">
                            {user.username || "john_doe"}
                          </p>
                        </div>
                        <Link
                          href="/profile/realestate"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Home className="h-4 w-4" />
                          My Real Estate
                        </Link>
                        <Link
                          href="/realestate/packages"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Home className="h-4 w-4" />
                          Post Real Estate
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <LogOutButton />
                      </div>
                    </div>
                  )}
                </div>

                <NotificationsButton
                  isMobileMenuOpen={isMobileMenuOpen}
                  setIsMobileMenuOpen={(state) => setIsMobileMenuOpen(state)}
                />
              </div>
            ) : (
              <Link
                href="/auth/signin?tab=login"
                className="px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md font-bold"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-14 bg-black/50 z-[999] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <nav className="fixed top-14 left-0 right-0 bg-primary border-t border-gray-200 z-[1000] md:hidden shadow-lg">
              <div className="py-3 px-4">
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Home
                  </Link>
                  <Link
                    href="/realestate"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Real Estate
                  </Link>
                  <Link
                    href="/links"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Links
                  </Link>
                  <Link
                    href="/deals"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Deals
                  </Link>
                  <Link
                    href="/resources"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Resources
                  </Link>

                  {/* Mobile Auth Section */}
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-t border-gray-200 mt-2">
                        <p className="text-sm font-bold text-white">
                          {user.username || "john_doe"}
                        </p>
                      </div>
                      <NotificationsButton
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={(state) =>
                          setIsMobileMenuOpen(state)
                        }
                      />
                      <Link
                        href="/profile/realestate"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Home className="h-4 w-4" />
                        My Real Estate
                      </Link>
                      <Link
                        href="/realestate/packages"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Home className="h-4 w-4" />
                        Post Real Estate
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <LogOutButton />
                    </>
                  ) : (
                    <Link
                      href="/auth/signin?tab=login"
                      className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors text-left rounded font-bold"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}

function LogOutButton() {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");

  const handleLogout = async () => {
    setStatus("loading");
    try {
      await fetcherUser(`/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setStatus("success");
      mutate("/users/self", () => null, { revalidate: false });
      clearFavoritesFromLocalStorage();
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors text-left rounded max-md:text-white max-md:hover:bg-white/20 max-md:hover:text-white max-md:px-3 max-md:py-1.5"
    >
      {status === "idle" ? (
        <LogOut className="h-4 w-4" />
      ) : (
        renderStatusIcon(status, "h-4 w-4")
      )}
      Log Out
    </button>
  );
}

function clearFavoritesFromLocalStorage(): void {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes("favorites")) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
