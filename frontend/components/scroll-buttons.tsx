"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

export function ScrollButtons() {
  const [showButtons, setShowButtons] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show buttons when user scrolls down more than 300px
      setShowButtons(scrollTop > 300)

      // Check if user is near the bottom (within 100px)
      setIsAtBottom(scrollTop + windowHeight >= documentHeight - 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }

  if (!showButtons) return null

  return (
    <div className="fixed bottom-16 right-6 z-30 flex flex-col gap-2">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="group bg-white hover:bg-primary border-2 border-primary rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
        title="Scroll to top"
      >
        <ChevronUp className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
      </button>

      {/* Scroll to Bottom Button - only show when not at bottom */}
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="group bg-white hover:bg-primary border-2 border-primary rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
          title="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
        </button>
      )}
    </div>
  )
}
