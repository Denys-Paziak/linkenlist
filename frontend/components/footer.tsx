"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useUser } from "@/contexts/user-context"

interface FooterProps {
  forceStickyDisclaimer?: boolean // This prop will still be passed but its effect will be managed externally
  hideDisclaimer?: boolean // Added hideDisclaimer prop to conditionally hide disclaimer
}

export function Footer({ forceStickyDisclaimer = false, hideDisclaimer = false }: FooterProps) {
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const { user } = useUser()
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.01, // Trigger when even a tiny bit of the footer is visible
      },
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  const disclaimerContent = (
    <>
      <strong>Disclaimer:</strong> LinkEnlist is an independent site not affiliated with or endorsed by the U.S.
      Department of Defense. Some links direct to official military or government websites.
    </>
  )

  const shouldShowDisclaimer = !hideDisclaimer && (user.isLoggedIn ? user.showDisclaimer : true)

  return (
    <>
      {/* Fixed Disclaimer - only visible when footer is NOT visible */}
      {shouldShowDisclaimer && !isFooterVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-primary border-t border-gray-700">
          <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 py-1 sm:py-1.5">
            <div className="text-center text-white text-[10px] sm:text-xs font-medium">{disclaimerContent}</div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <footer ref={footerRef} className="bg-primary border-t border-gray-700 mt-auto">
        {/* Disclaimer as part of footer - only show when footer IS visible */}
        {shouldShowDisclaimer && isFooterVisible && (
          <div className="bg-primary border-b border-gray-700">
            <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 py-1 sm:py-1.5">
              <div className="text-center text-white text-[10px] sm:text-xs font-medium">{disclaimerContent}</div>
            </div>
          </div>
        )}

        <div className="w-full max-w-[1600px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold text-white mb-3">LinkEnlist.com</h3>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">
                Your trusted directory for official military and Department of Defense resources.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-300 text-xs">Independently operated</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => (window.location.href = "/signin")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                </li>
                <li>
                  <Link href="/deals" className="text-gray-300 hover:text-white transition-colors">
                    Deals
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => (window.location.href = "/add-edit-link")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Add/Edit Link
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Site Info</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About LinkEnlist
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.veteranscrisisline.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Veteran Crisis Line
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="#donate" className="text-gray-300 hover:text-white transition-colors">
                    Donate
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-4 text-center">
            <p className="text-gray-400 text-xs">
              © 2025 NodEd LLC d/b/a LinkEnlist. All rights reserved. • Images and logos are intellectual property of
              their site owners and do not belong to LinkEnlist.com
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
