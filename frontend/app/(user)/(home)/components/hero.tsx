'use client'

import { BookOpen, Home, LinkIcon, Tag } from "lucide-react";
import Link from "next/link";
import { FloatingCommentCards } from "./floating-comment-cards";
import { useEffect, useState } from "react";

export function Hero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-[350px] md:min-h-[700px] bg-gray-50 flex items-center justify-center py-4 overflow-hidden md:py-16">
      <div className="text-center max-w-6xl mx-auto px-4 relative z-10">
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 leading-tight text-gray-800">
          Linking Military Community
        </h1>

        <p className="text-base md:text-xl lg:text-2xl mb-4 md:mb-8 text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Military-focused Real Estate marketplace, Direct Links to the
          <br className="hidden md:block" />
          military websites, Resources and Deals linked for you.
        </p>

        <div className="max-w-4xl mx-auto relative z-20 mt-4 md:mt-8">
          <div className="max-w-xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-2.5">
              <Link
                href="/realestate"
                className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-2 md:p-4 transition-all duration-200 hover:shadow-xl group"
              >
                <div className="flex flex-col items-center gap-1.5 md:gap-2">
                  <div className="w-7 h-7 md:w-9 md:h-9 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#003366]/90 transition-colors">
                    <Home className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-800">
                    Real Estate
                  </span>
                </div>
              </Link>

              <Link
                href="/deals"
                className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-2 md:p-4 transition-all duration-200 hover:shadow-xl group"
              >
                <div className="flex flex-col items-center gap-1.5 md:gap-2">
                  <div className="w-7 h-7 md:w-9 md:h-9 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#003366]/90 transition-colors">
                    <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-800">
                    Deals
                  </span>
                </div>
              </Link>

              <Link
                href="/resources"
                className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-2 md:p-4 transition-all duration-200 hover:shadow-xl group"
              >
                <div className="flex flex-col items-center gap-1.5 md:gap-2">
                  <div className="w-7 h-7 md:w-9 md:h-9 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#003366]/90 transition-colors">
                    <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-800">
                    Resources
                  </span>
                </div>
              </Link>

              <Link
                href="/links"
                className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-2 md:p-4 transition-all duration-200 hover:shadow-xl group"
              >
                <div className="flex flex-col items-center gap-1.5 md:gap-2">
                  <div className="w-7 h-7 md:w-9 md:h-9 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#003366]/90 transition-colors">
                    <LinkIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-800">
                    Links
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Comment Cards with Scroll-Based Animation */}
      <FloatingCommentCards scrollY={scrollY} />
    </section>
  );
}
