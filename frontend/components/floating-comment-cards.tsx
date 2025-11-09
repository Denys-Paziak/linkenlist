"use client"

import { useState, useEffect } from "react"
import { Star, MapPin, Home, DollarSign } from "lucide-react"

interface Comment {
  id: number
  name: string
  message: string
  timestamp: string
  points: number
  location?: string
  verified: boolean
  category: "pcs" | "va" | "housing" | "finance" | "general"
  likes: number
  isStarred: boolean
  rotation: number
  position: { top: string; left?: string; right?: string }
  verticalPosition: "top" | "middle" | "bottom"
  zIndex: number
  side: "left" | "right"
}

const testimonials = {
  left: [
    {
      id: 1,
      name: "Sarah M.",
      message: "LinkEnlist helped me find the perfect home near Quantico. Amazing service!",
      timestamp: "Aug 2025",
      points: 15,
      location: "Quantico, VA",
      verified: true,
      category: "housing" as const,
      likes: 24,
      isStarred: true,
      rotation: -4,
      position: { top: "5%", left: "2%" },
      verticalPosition: "top" as const,
      zIndex: 40,
      side: "left" as const,
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      message: "PCS move made easy thanks to this platform. Highly recommend!",
      timestamp: "Jul 2025",
      points: 8,
      location: "Fort Bragg, NC",
      verified: true,
      category: "pcs" as const,
      likes: 18,
      isStarred: false,
      rotation: 2,
      position: { top: "35%", left: "1%" },
      verticalPosition: "middle" as const,
      zIndex: 35,
      side: "left" as const,
    },
    {
      id: 3,
      name: "Jennifer K.",
      message: "Found our dream home with VA loan assistance. Thank you LinkEnlist!",
      timestamp: "Jul 2025",
      points: 12,
      location: "San Diego, CA",
      verified: true,
      category: "va" as const,
      likes: 31,
      isStarred: true,
      rotation: -2,
      position: { top: "65%", left: "3%" },
      verticalPosition: "bottom" as const,
      zIndex: 30,
      side: "left" as const,
    },
  ],
  right: [
    {
      id: 4,
      name: "David Chen",
      message: "Great resources for military families. The BAH calculator is spot on.",
      timestamp: "Jun 2025",
      points: 6,
      location: "Norfolk, VA",
      verified: true,
      category: "finance" as const,
      likes: 15,
      isStarred: false,
      rotation: 3,
      position: { top: "8%", right: "2%" },
      verticalPosition: "top" as const,
      zIndex: 40,
      side: "right" as const,
    },
    {
      id: 5,
      name: "Amanda Foster",
      message: "Smooth home buying process near Fort Bragg. Excellent support team!",
      timestamp: "Jun 2025",
      points: 20,
      location: "Fayetteville, NC",
      verified: true,
      category: "housing" as const,
      likes: 42,
      isStarred: true,
      rotation: -3,
      position: { top: "38%", right: "1%" },
      verticalPosition: "middle" as const,
      zIndex: 35,
      side: "right" as const,
    },
    {
      id: 6,
      name: "Robert Johnson",
      message: "LinkEnlist connected me with the right realtor. Couldn't be happier!",
      timestamp: "May 2025",
      points: 9,
      location: "Colorado Springs, CO",
      verified: true,
      category: "general" as const,
      likes: 27,
      isStarred: false,
      rotation: 4,
      position: { top: "68%", right: "3%" },
      verticalPosition: "bottom" as const,
      zIndex: 30,
      side: "right" as const,
    },
  ],
}

const categoryIcons = {
  pcs: MapPin,
  va: DollarSign,
  housing: Home,
  finance: DollarSign,
  general: Star,
}

const categoryColors = {
  pcs: "bg-blue-500",
  va: "bg-green-500",
  housing: "bg-purple-500",
  finance: "bg-orange-500",
  general: "bg-gray-500",
}

interface FloatingCommentCardsProps {
  scrollY: number
}

export function FloatingCommentCards({ scrollY }: FloatingCommentCardsProps) {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())

  useEffect(() => {
    const animationOrder = [
      { side: "left", position: "bottom", id: 3 },
      { side: "left", position: "middle", id: 2 },
      { side: "left", position: "top", id: 1 },
      { side: "right", position: "bottom", id: 6 },
      { side: "right", position: "middle", id: 5 },
      { side: "right", position: "top", id: 4 },
    ]

    const initialDelay = setTimeout(() => {
      animationOrder.forEach((card, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => new Set([...prev, card.id]))
        }, index * 200) // 200ms delay between each card
      })
    }, 1000) // 1 second initial delay

    return () => clearTimeout(initialDelay)
  }, [])

  const getCardTransform = (side: string, verticalPosition: string, cardId: number) => {
    const scrollThreshold = 30 // Start animating at 30px scroll
    const animationDistance = 300 // Complete animation over 300px

    // Calculate progress (0 to 1)
    const progress = Math.min((scrollY - scrollThreshold) / animationDistance, 1)

    // Outward movement from center
    const translateX = side === "left" ? -100 * progress : 100 * progress
    const translateY =
      verticalPosition === "top" ? -70 * progress : verticalPosition === "bottom" ? 70 * progress : -25 * progress

    // Fade out effect
    const opacity = Math.max(0, 1 - progress * 1.6)

    return {
      opacity,
      transform: `translateX(${translateX}px) translateY(${translateY}px)`,
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getCategoryIcon = (category: Comment["category"]) => {
    const Icon = categoryIcons[category]
    return <Icon className="w-3 h-3" />
  }

  const allTestimonials = [...testimonials.left, ...testimonials.right]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden xl:block">
      {allTestimonials.map((testimonial) => {
        const isVisible = visibleCards.has(testimonial.id)
        const cardStyle = getCardTransform(testimonial.side, testimonial.verticalPosition, testimonial.id)

        return (
          <div
            key={testimonial.id}
            className="absolute w-[240px] h-[120px] bg-white rounded-2xl shadow-lg border border-gray-100 p-2 transition-all duration-500 ease-out pointer-events-auto hover:shadow-xl hover:scale-105 cursor-pointer"
            style={{
              ...testimonial.position,
              zIndex: testimonial.zIndex,
              transform: `rotate(${testimonial.rotation}deg) ${cardStyle.transform} scale(${isVisible ? 1 : 0.7})`,
              opacity: isVisible ? cardStyle.opacity : 0,
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              willChange: "transform, opacity",
            }}
          >
            <div className="flex items-start gap-2 h-full">
              {/* Avatar - smaller size */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {getInitials(testimonial.name)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-xs">
                    {testimonial.name.split(" ")[0]} {testimonial.name.split(" ")[1]?.[0]}.
                  </span>
                  {testimonial.location && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">{testimonial.timestamp}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 flex-1">{testimonial.message}</p>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{testimonial.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
