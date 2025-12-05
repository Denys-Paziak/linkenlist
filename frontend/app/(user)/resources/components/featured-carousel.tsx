"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EnhancedResourceCard } from "../../../../components/enhanced-resource-card";
import { mockResources } from "../../../../data/mock-resources-data";

export function FeaturedCarousel() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Featured resources with enhanced data
    const featuredResources = useMemo(() => {
      return mockResources
        .filter((resource) => resource.isFeatured)
        .slice(0, 8)
        .map((resource) => ({
          ...resource,
          likes: Math.floor(Math.random() * 100) + 10,
        }))
    }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      handleScroll()
    }
  }, [featuredResources])

  return (
    <div className="relative">
      {/* Left Scroll Button - Outside carousel - Hidden on mobile */}
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`absolute -left-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-md transition-all duration-200 hidden md:block ${
          canScrollLeft
            ? "text-gray-600 hover:bg-white/80 hover:shadow-lg"
            : "text-gray-300 cursor-not-allowed opacity-30"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Right Scroll Button - Outside carousel - Hidden on mobile */}
      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`absolute -right-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-md transition-all duration-200 hidden md:block ${
          canScrollRight
            ? "text-gray-600 hover:bg-white/80 hover:shadow-lg"
            : "text-gray-300 cursor-not-allowed opacity-30"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Carousel Container */}
      <div className="mx-2 md:mx-10">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredResources.map((resource) => (
            <div key={resource.id} className="flex-shrink-0 w-72 snap-start">
              <EnhancedResourceCard resource={resource} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
