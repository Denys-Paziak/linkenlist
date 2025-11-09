"use client"

import type React from "react"

import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { useState, useEffect } from "react"
import { Menu, X, Star, Bell, ChevronDown, Settings, LogOut, Home } from "lucide-react"
import { useScrollManager } from "@/lib/scroll-manager"

interface HeaderProps {
  onSubmitLink?: () => void
  onClearSearch?: () => void
}

export function Header({ onSubmitLink, onClearSearch }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { user, logout, updateSettings } = useUser()
  const scrollManager = useScrollManager()

  useEffect(() => {
    if (isMobileMenuOpen) {
      scrollManager.freezeBackground()
    } else {
      scrollManager.unfreezeBackground()
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      scrollManager.unfreezeBackground()
    }
  }, [isMobileMenuOpen, scrollManager])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      // Handle notifications dropdown
      if (isNotificationsOpen && !target.closest(".notifications-container")) {
        setIsNotificationsOpen(false)
      }

      // Handle mobile menu - only close if not clicking on notifications
      if (isMobileMenuOpen && !target.closest("nav") && !target.closest(".notifications-container")) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isNotificationsOpen, isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileMenuOpen && !(event.target as Element).closest(".profile-dropdown-container")) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const handleLogout = () => {
    logout()
    setIsProfileMenuOpen(false)
    window.location.href = "/"
  }

  const handleHomeClick = (e: React.MouseEvent) => {
    // If we're already on the home page and have a clear function, clear the search
    if (window.location.pathname === "/" && onClearSearch) {
      e.preventDefault()
      onClearSearch()
    }
  }

  const handleNavClick = (href: string, callback?: () => void) => {
    // Check if it's a hash link
    if (href.startsWith("#")) {
      scrollManager.scrollToHash(href)
      return
    }

    // Execute callback if provided
    if (callback) {
      callback()
    }
  }

  // Common hover and focus classes for navigation items
  const navItemClasses =
    "px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md"

  return (
    <header className="bg-primary shadow-sm border-b border-primary-foreground sticky top-0 z-[1000]">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={handleHomeClick}>
              <h1 className="text-base font-bold text-white hover:text-white/80 transition-colors cursor-pointer">
                LinkEnlist.com
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className={navItemClasses} onClick={handleHomeClick}>
              Home
            </Link>
            <Link href="/realestate" className={navItemClasses} onClick={() => handleNavClick("/realestate")}>
              Real Estate
            </Link>
            <Link href="/links" className={navItemClasses} onClick={() => handleNavClick("/links")}>
              Links
            </Link>
            <Link href="/deals" className={navItemClasses} onClick={() => handleNavClick("/deals")}>
              Deals
            </Link>
            <Link href="/resources" className={navItemClasses} onClick={() => handleNavClick("/resources")}>
              Resources
            </Link>

            {/* Auth-aware section */}
            {user.isLoggedIn ? (
              <div className="flex items-center space-x-1">
                {/* Profile Dropdown */}
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
                          <p className="text-sm font-bold text-foreground">{user.username || "john_doe"}</p>
                        </div>
                        <Link
                          href="/profile/realestate"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => handleNavClick("/profile/realestate", () => setIsProfileMenuOpen(false))}
                        >
                          <Home className="h-4 w-4" />
                          My Real Estate
                        </Link>
                        <Link
                          href="/realestate/packages"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => handleNavClick("/realestate/packages", () => setIsProfileMenuOpen(false))}
                        >
                          <Home className="h-4 w-4" />
                          Post Real Estate
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => handleNavClick("/profile/settings", () => setIsProfileMenuOpen(false))}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsProfileMenuOpen(false)
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors text-left rounded"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notification Bell */}
                <div className="relative notifications-container">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsNotificationsOpen(!isNotificationsOpen)
                      // Mark all as read when opened
                      if (!isNotificationsOpen && user.notifications > 0) {
                        // In a real app, this would call an API to mark notifications as read
                        // For demo, we'll just update the context
                        updateSettings({ notifications: 0 })
                      }
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="relative px-4 py-2 text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md touch-manipulation"
                    aria-label="Notifications"
                    role="button"
                  >
                    <Bell className="h-4 w-4" />
                    {user.notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {user.notifications}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-1 w-[20rem] bg-white border border-gray-200 rounded-lg shadow-xl z-[1010] animate-in slide-in-from-top-2 duration-200">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-bold text-foreground">Notifications</p>
                        </div>
                        <div className="max-h-[20rem] overflow-y-auto">
                          <div className="px-4 py-3 border-b border-gray-100 hover:bg-secondary cursor-pointer">
                            <p className="font-medium text-sm text-foreground mb-1">New Military Discount Available</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              Adobe Creative Cloud is now offering 60% off for military members. Check out the deals
                              page for more information.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                          </div>
                          <div className="px-4 py-3 border-b border-gray-100 hover:bg-secondary cursor-pointer">
                            <p className="font-medium text-sm text-foreground mb-1">System Maintenance Complete</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              Scheduled maintenance has been completed. All services are now running normally.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                          </div>
                          <div className="px-4 py-3 hover:bg-secondary cursor-pointer">
                            <p className="font-medium text-sm text-foreground mb-1">Welcome to LinkEnlist!</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              Thank you for joining LinkEnlist. Explore our directory of military resources and bookmark
                              your favorites.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                          </div>
                        </div>
                        <div className="border-t border-gray-100">
                          <Link
                            href="/notifications"
                            className="block px-4 py-3 text-sm text-primary hover:bg-secondary transition-colors text-center font-medium"
                            onClick={() => handleNavClick("/notifications", () => setIsNotificationsOpen(false))}
                          >
                            View All Notifications
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button onClick={() => (window.location.href = "/signin")} className={`${navItemClasses} font-bold`}>
                Sign In
              </button>
            )}

            <button
              onClick={() => {
                // Add to favorites functionality
                if (typeof window !== "undefined") {
                  try {
                    // Try to add bookmark programmatically (works in some browsers)
                    if (window.sidebar && window.sidebar.addPanel) {
                      // Firefox
                      window.sidebar.addPanel("LinkEnlist - Military Resources", window.location.href, "")
                    } else if (window.external && window.external.AddFavorite) {
                      // Internet Explorer
                      window.external.AddFavorite(window.location.href, "LinkEnlist - Military Resources")
                    } else {
                      // For other browsers, show instructions
                      alert(
                        "To bookmark this page:\n\nPress Ctrl+D (Windows/Linux) or Cmd+D (Mac)\n\nOr use your browser's bookmark button in the address bar.",
                      )
                    }
                  } catch (e) {
                    // Fallback: show instructions
                    alert(
                      "To bookmark this page:\n\nPress Ctrl+D (Windows/Linux) or Cmd+D (Mac)\n\nOr use your browser's bookmark button in the address bar.",
                    )
                  }
                }
              }}
              className="px-4 py-2 text-white hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFDD00] transition-all duration-150 ease-in-out rounded-md flex items-center gap-2"
              title="Add to Favorites"
            >
              <Star className="h-3.5 w-3.5" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-1.5" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-[999] md:hidden" onClick={() => setIsMobileMenuOpen(false)} />

            <nav className="fixed top-14 left-0 right-0 bg-primary border-t border-gray-200 z-[1000] md:hidden shadow-lg">
              <div className="py-3 px-4">
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={(e) => {
                      handleHomeClick(e)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Home
                  </Link>
                  <Link
                    href="/realestate"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={() => handleNavClick("/realestate", () => setIsMobileMenuOpen(false))}
                  >
                    Real Estate
                  </Link>
                  <Link
                    href="/links"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={() => handleNavClick("/links", () => setIsMobileMenuOpen(false))}
                  >
                    Links
                  </Link>
                  <Link
                    href="/deals"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={() => handleNavClick("/deals", () => setIsMobileMenuOpen(false))}
                  >
                    Deals
                  </Link>
                  <Link
                    href="/resources"
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                    onClick={() => handleNavClick("/resources", () => setIsMobileMenuOpen(false))}
                  >
                    Resources
                  </Link>

                  {/* Mobile Auth Section */}
                  {user.isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 border-t border-gray-200 mt-2">
                        <p className="text-sm font-bold text-white">{user.username || "john_doe"}</p>
                      </div>
                      <div className="relative notifications-container">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsNotificationsOpen(!isNotificationsOpen)
                            // Mark all as read when opened
                            if (!isNotificationsOpen && user.notifications > 0) {
                              // In a real app, this would call an API to mark notifications as read
                              // For demo, we'll just update the context
                              updateSettings({ notifications: 0 })
                            }
                          }}
                          onTouchStart={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded touch-manipulation"
                          aria-label="Notifications"
                          role="button"
                        >
                          <Bell className="h-4 w-4" />
                          Notifications
                          {user.notifications > 0 && (
                            <span className="ml-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {user.notifications}
                            </span>
                          )}
                        </button>

                        {/* Mobile Notification Dropdown */}
                        {isNotificationsOpen && (
                          <div className="mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[1010] animate-in slide-in-from-top-2 duration-200">
                            <div className="py-2">
                              <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-bold text-foreground">Notifications</p>
                              </div>
                              <div className="max-h-[20rem] overflow-y-auto">
                                <div className="px-4 py-3 border-b border-gray-100 hover:bg-secondary cursor-pointer">
                                  <p className="font-medium text-sm text-foreground mb-1">
                                    New Military Discount Available
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    Adobe Creative Cloud is now offering 60% off for military members. Check out the
                                    deals page for more information.
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                                </div>
                                <div className="px-4 py-3 border-b border-gray-100 hover:bg-secondary cursor-pointer">
                                  <p className="font-medium text-sm text-foreground mb-1">
                                    System Maintenance Complete
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    Scheduled maintenance has been completed. All services are now running normally.
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                                </div>
                                <div className="px-4 py-3 hover:bg-secondary cursor-pointer">
                                  <p className="font-medium text-sm text-foreground mb-1">Welcome to LinkEnlist!</p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    Thank you for joining LinkEnlist. Explore our directory of military resources and
                                    bookmark your favorites.
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                                </div>
                              </div>
                              <div className="border-t border-gray-100">
                                <Link
                                  href="/notifications"
                                  className="block px-4 py-3 text-sm text-primary hover:bg-secondary transition-colors text-center font-medium"
                                  onClick={() => handleNavClick("/notifications", () => setIsNotificationsOpen(false))}
                                >
                                  View All Notifications
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <Link
                        href="/profile/realestate"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                        onClick={() => handleNavClick("/profile/realestate", () => setIsProfileMenuOpen(false))}
                      >
                        <Home className="h-4 w-4" />
                        My Real Estate
                      </Link>
                      <Link
                        href="/realestate/packages"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                        onClick={() => handleNavClick("/realestate/packages", () => setIsProfileMenuOpen(false))}
                      >
                        <Home className="h-4 w-4" />
                        Post Real Estate
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded"
                        onClick={() => handleNavClick("/profile/settings", () => setIsProfileMenuOpen(false))}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors text-left rounded"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        window.location.href = "/signin"
                        setIsMobileMenuOpen(false)
                      }}
                      className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors text-left rounded font-bold"
                    >
                      Sign In
                    </button>
                  )}

                  <button
                    onClick={() => {
                      // Add to favorites functionality
                      if (typeof window !== "undefined") {
                        try {
                          // Try to add bookmark programmatically (works in some browsers)
                          if (window.sidebar && window.sidebar.addPanel) {
                            // Firefox
                            window.sidebar.addPanel("LinkEnlist - Military Resources", window.location.href, "")
                          } else if (window.external && window.external.AddFavorite) {
                            // Internet Explorer
                            window.external.AddFavorite(window.location.href, "LinkEnlist - Military Resources")
                          } else {
                            // For other browsers, show instructions
                            alert(
                              "To bookmark this page:\n\nPress Ctrl+D (Windows/Linux) or Cmd+D (Mac)\n\nOr use your browser's bookmark button in the address bar.",
                            )
                          }
                        } catch (e) {
                          // Fallback: show instructions
                          alert(
                            "To bookmark this page:\n\nPress Ctrl+D (Windows/Linux) or Cmd+D (Mac)\n\nOr use your browser's bookmark button in the address bar.",
                          )
                        }
                      }
                    }}
                    className="px-3 py-1.5 text-sm text-white hover:bg-white/20 hover:text-white transition-colors rounded flex items-center gap-2"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  )
}
