"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ExternalLink } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { cn } from "@/lib/utils"
import type { ExternalResource } from "@/types/Resource"

interface ResourceCardProps {
  resource: ExternalResource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { user, toggleFavorite } = useUser()
  const isFavorite = user.favorites.includes(resource.id)

  return (
    <div
      className={cn(
        "card group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer",
      )}
    >
      <Link
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        prefetch={false}
      >
        <span className="sr-only">View {resource.title}</span>
      </Link>

      {/* Image Container with fixed aspect ratio - matching realestate cards */}
      <div className="card-media-container p-2 pb-1">
        <div className="card-media w-full bg-secondary rounded-md border border-gray-200 overflow-hidden">
          <Image
            src={resource.screenshotImage || "/placeholder.svg?height=140&width=370&query=website screenshot"}
            alt={`Screenshot of ${resource.title}`}
            width={370}
            height={140}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content Container - matching realestate card structure */}
      <div className="px-2 pb-2">
        {/* Title - matching realestate card styling */}
        <h3 className="card-price mb-1 font-bold text-[#002244] text-left text-sm leading-tight line-clamp-1">
          {resource.title}
        </h3>

        {/* Description - NOW limited to 2 rows */}
        <p
          className="text-xs text-gray-500 font-medium text-left mb-2 leading-relaxed"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.4",
            maxHeight: "2.8em", // 2 lines * 1.4 line-height
          }}
        >
          {resource.description}
        </p>

        {/* Tags - limited to one line only */}
        <div className="flex flex-wrap gap-1 overflow-hidden" style={{ maxHeight: "1.5rem" }}>
          {resource.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="inline-block text-gray-400 text-xs px-1 py-0.5 font-medium">
              +{resource.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Favorite Button - bigger icons */}
      <div className="absolute top-2 left-2 flex gap-1 z-20">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(resource.id)
          }}
          className="w-6 h-6 p-0 bg-white/90 hover:bg-gray-100 rounded-sm flex items-center justify-center"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={cn("w-3.5 h-3.5", isFavorite && "fill-[#dc2626] text-[#dc2626]")} />
        </button>
      </div>

      {/* External Link Indicator - bigger icons */}
      <div className="absolute top-2 right-2 flex gap-1 z-20">
        <div className="w-6 h-6 p-0 bg-white/90 hover:bg-gray-100 rounded-sm flex items-center justify-center group/tooltip relative">
          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
            External Link
          </div>
        </div>
      </div>
    </div>
  )
}
