"use client";

import { useState } from "react";
import { IRealestate } from "../../../../../types/Realestate";
import { formatDateDiff } from "../../../../../lib/utils";
import useSWR from "swr";

export function PropertyDescription({ listing }: { listing: IRealestate }) {
  const { data: favoriteCount } = useSWR<number>(`/favorite/listings/${listing.id}/count`);

  const [showFullDescription, setShowFullDescription] = useState(false);

  const isLongDescription = listing.description.length > 450;
  const truncatedDescription = isLongDescription
    ? listing.description.substring(0, 450) + "..."
    : listing.description;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-[#002244] pb-2">
        Description
      </h2>
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
        <div className="relative">
          <div>
            {(showFullDescription || !isLongDescription
              ? listing.description
              : truncatedDescription
            )
              .split("\n\n")
              .map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
          </div>
          {isLongDescription && !showFullDescription && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          )}
        </div>
        {isLongDescription && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="inline-flex items-center gap-2 text-[#002244] hover:text-gray-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {showFullDescription ? (
                <>
                  Show Less
                  <svg
                    className="w-4 h-4 transform rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  Show More
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Special Features Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Special Features
        </h3>
        <div className="flex flex-wrap gap-2">
          {listing.specialFeatures?.slice(0, 4).map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#002244] text-white border border-[#002244]"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center text-gray-600 text-sm">
          <span className="font-semibold text-gray-900">
            {formatDateDiff(listing.publishedAt)}
          </span>
          <span className="mx-2">on LinkEnlist</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="font-semibold text-gray-900">{listing.totalViews}</span>
          <span className="mx-2">views</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="font-semibold text-gray-900">{favoriteCount}</span>
          <span className="mx-2">saves</span>
        </div>
      </div>
    </div>
  );
}
