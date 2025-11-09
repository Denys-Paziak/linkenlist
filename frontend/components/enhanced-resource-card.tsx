"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import type { Resource } from "@/types/Resource"

interface EnhancedResourceCardProps {
  resource: Resource
}

export function EnhancedResourceCard({ resource }: EnhancedResourceCardProps) {
  const { user, toggleFavorite } = useUser()
  const isFavorite = user?.favorites?.includes(resource.id) || false

  // Create tags from resource properties
  const resourceTags = [
    ...(resource.tags || []),
    ...(resource.category ? [resource.category] : []),
    ...(resource.isVerified ? ["Verified"] : []),
    ...(resource.isFeatured ? ["Featured"] : []),
  ]

  const visibleTags = resourceTags.slice(0, 3)
  const remainingCount = resourceTags.length - 3

  return (
    <div className="card group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer">
      {/* Link covering entire card */}
      <div className="absolute inset-0 z-10" onClick={() => (window.location.href = `/resources/${resource.slug}`)} />

      {resource.isFeatured && (
        <div className="absolute top-2 right-2 z-20">
          <Star className="w-4 h-4 fill-green-500 text-green-500 my-1 mx-1" />
        </div>
      )}

      {/* Favorite Button */}
      {user && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(resource.id)
          }}
          className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/90 hover:bg-gray-100 rounded-sm shadow-sm flex items-center justify-center transition-colors duration-200"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={`w-3.5 h-3.5 transition-colors duration-200 ${
              isFavorite ? "fill-[#dc2626] text-[#dc2626]" : "text-gray-400 hover:text-gray-600"
            }`}
          />
        </button>
      )}

      {/* Image Container */}
      <div className="card-media-container p-2 pb-1">
        <div className="card-media-wrapper bg-secondary rounded-md border border-gray-200 overflow-hidden">
          <Image
            src={resource.thumbnail || "/placeholder.svg?height=140&width=370&query=resource screenshot"}
            alt={`Screenshot of ${resource.title}`}
            width={370}
            height={140}
            className="card-media w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="px-2 pb-2">
        <h3
          className="card-price font-bold text-[#002244] text-left text-sm mb-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.3",
            maxHeight: "2.6em",
          }}
        >
          {resource.title}
        </h3>

        {/* Description - 2 rows like deal cards */}
        <p
          className="card-title text-xs text-gray-500 font-medium text-left mb-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.4",
            maxHeight: "2.8em",
          }}
        >
          {(resource.excerpt || resource.description || "").length > 120
            ? `${(resource.excerpt || resource.description || "").substring(0, 120)}...`
            : resource.excerpt || resource.description || ""}
        </p>

        <div className="flex items-center gap-2 text-xs">
          {resource.likes && (
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-3 h-3 fill-gray-500 text-gray-500" viewBox="0 0 24 24">
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
              <span className="text-gray-500">{resource.likes}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-3 h-3 fill-gray-500 text-gray-500" viewBox="0 0 24 24">
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
            </svg>
            <span className="text-gray-500">12</span>
          </div>

          <div className="flex flex-wrap gap-1" style={{ maxHeight: "1.5rem", overflow: "hidden" }}>
            {visibleTags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="inline-block text-gray-400 text-xs px-1 py-0.5 font-medium">+{remainingCount}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
