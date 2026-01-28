"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { getInitials } from "../../../../lib/utils";

const testimonials = {
  left: [
    {
      id: 1,
      rotation: -4,
      position: { top: "5%", left: "2%" },
      verticalPosition: "top" as const,
      zIndex: 40,
      side: "left" as const,
    },
    {
      id: 2,
      rotation: 2,
      position: { top: "35%", left: "1%" },
      verticalPosition: "middle" as const,
      zIndex: 35,
      side: "left" as const,
    },
    {
      id: 3,
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
      rotation: 3,
      position: { top: "8%", right: "2%" },
      verticalPosition: "top" as const,
      zIndex: 40,
      side: "right" as const,
    },
    {
      id: 5,
      rotation: -3,
      position: { top: "38%", right: "1%" },
      verticalPosition: "middle" as const,
      zIndex: 35,
      side: "right" as const,
    },
    {
      id: 6,
      rotation: 4,
      position: { top: "68%", right: "3%" },
      verticalPosition: "bottom" as const,
      zIndex: 30,
      side: "right" as const,
    },
  ],
};

export function FloatingCommentCards({ data }: { data: Record<string, string | undefined>[] }) {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const animationOrder = [
      { side: "left", position: "bottom", id: 3 },
      { side: "left", position: "middle", id: 2 },
      { side: "left", position: "top", id: 1 },
      { side: "right", position: "bottom", id: 6 },
      { side: "right", position: "middle", id: 5 },
      { side: "right", position: "top", id: 4 },
    ];

    const initialDelay = setTimeout(() => {
      animationOrder.forEach((card, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => new Set([...prev, card.id]));
        }, index * 200); // 200ms delay between each card
      });
    }, 1000); // 1 second initial delay

    return () => clearTimeout(initialDelay);
  }, []);

  const getCardTransform = (side: string, verticalPosition: string) => {
    const scrollThreshold = 30; // Start animating at 30px scroll
    const animationDistance = 300; // Complete animation over 300px

    // Calculate progress (0 to 1)
    const progress = Math.min(
      (scrollY - scrollThreshold) / animationDistance,
      1
    );

    // Outward movement from center
    const translateX = side === "left" ? -100 * progress : 100 * progress;
    const translateY =
      verticalPosition === "top"
        ? -70 * progress
        : verticalPosition === "bottom"
        ? 70 * progress
        : -25 * progress;

    // Fade out effect
    const opacity = Math.max(0, 1 - progress * 1.6);

    return {
      opacity,
      transform: `translateX(${translateX}px) translateY(${translateY}px)`,
    };
  };

  const allTestimonials = [...testimonials.left, ...testimonials.right];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden xl:block">
      {allTestimonials.map((testimonial, i) => {
        const isVisible = visibleCards.has(testimonial.id);
        const cardStyle = getCardTransform(
          testimonial.side,
          testimonial.verticalPosition
        );

        return (
          <div
            key={testimonial.id}
            className="absolute w-[240px] h-[120px] bg-white rounded-2xl shadow-lg border border-gray-100 p-2 transition-all duration-500 ease-out pointer-events-auto hover:shadow-xl hover:scale-105"
            style={{
              ...testimonial.position,
              zIndex: testimonial.zIndex,
              transform: `rotate(${testimonial.rotation}deg) ${
                cardStyle.transform
              } scale(${isVisible ? 1 : 0.7})`,
              opacity: isVisible ? cardStyle.opacity : 0,
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              willChange: "transform, opacity",
            }}
          >
            <div className="flex items-start gap-2 h-full">
              {/* Avatar - smaller size */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {getInitials(data[0]?.name || "")}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-xs">
                    {(data[i]?.name || "").split(" ")[0]}{" "}
                    {(data[i]?.name || "").split(" ")[1]?.[0]}.
                  </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">
                        {data[0]?.date || ""}
                      </span>
                    </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 flex-1">
                  {data[i]?.comment || ""}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {data[i]?.location || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
