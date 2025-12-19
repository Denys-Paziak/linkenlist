"use client";

import Image from "next/image";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ILink } from "../../../../types/Link";
import { fetcherUser } from "../../../../lib/fetcher";
import { useUser } from "../../../../contexts/user-context";
import useSWR from "swr";
import { IUser } from "../../../../types/User";

interface CardProps {
  data: ILink;
  isLoading: boolean;
}

export function Card({ data, isLoading }: CardProps) {
  const handleCardClick = async () => {
    try {
      await fetcherUser(`/links/${data.id}/add-view`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {}

    window.open(data.url, "_blank", "noopener noreferrer");
  };

  return (
    <div
      className={cn(
        "card group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer",
        isLoading && "pointer-events-none"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-10",
          isLoading && "pointer-events-none"
        )}
        onClick={() => {
          handleCardClick();
        }}
      >
        <span className="sr-only">View {data.title}</span>
      </div>

      <FavoriteButton id={data.id} />

      {/* Image Container with fixed aspect ratio - matching realestate cards */}
      <div className="card-media-container p-2 pb-1">
        <div className="card-media w-full bg-secondary rounded-md border border-gray-200 overflow-hidden">
          {data.image ? (
            <Image
              src={data.image?.url}
              alt={`Screenshot of ${data.title}`}
              width={data.image.width}
              height={data.image.height}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <span className="text-sm font-medium uppercase">{data.title}</span>
          )}
        </div>
      </div>

      {/* Content Container - matching realestate card structure */}
      <div className="px-2 pb-2">
        {/* Title - matching realestate card styling */}
        <h3 className="card-price mb-1 font-bold text-[#002244] text-left text-sm leading-tight line-clamp-1">
          {data.title}
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
          {data.description}
        </p>

        {/* Tags - limited to one line only */}
        <div
          className="flex flex-wrap gap-1 overflow-hidden"
          style={{ maxHeight: "1.5rem" }}
        >
          {data.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
            >
              {tag.name}
            </span>
          ))}
          {data.tags.length > 3 && (
            <span className="inline-block text-gray-400 text-xs px-1 py-0.5 font-medium">
              +{data.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="absolute z-30 flex items-center justify-center inset-0 bg-black/10">
          <Loader2 className="animate-spin w-11 h-11 text-white" />
        </div>
      ) : null}
    </div>
  );
}

function FavoriteButton({ id }: { id: number }) {
  const { data: user } = useSWR<IUser>("/users/self");

  const { setShowLoginModal } = useUser();

  const { data, mutate } = useSWR<number[]>(
    user ? `/favorite/resources` : null
  );

  const addFavorite = async () => {
    try {
      await fetcherUser(`/favorite/resources/${id}`, {
        method: "POST",
        credentials: "include",
      });

      mutate((draft) => [...(draft || []), id], {
        revalidate: false,
      });
    } catch {}
  };

  const deleteFavorite = async () => {
    try {
      await fetcherUser(`/favorite/resources/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      mutate((draft) => draft?.filter((item) => item !== id), {
        revalidate: false,
      });
    } catch {}
  };

  const isFavorite = data?.includes(id);

  return (
    <button
      onClick={() => {
        if (user) {
          if (!isFavorite) {
            addFavorite();
          } else {
            deleteFavorite();
          }
        } else {
          setShowLoginModal(true);
        }
      }}
      className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/90 hover:bg-gray-100 rounded-sm shadow-sm flex items-center justify-center transition-colors duration-200"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={`w-3.5 h-3.5 transition-colors duration-200 ${
          isFavorite
            ? "fill-[#dc2626] text-[#dc2626]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      />
    </button>
  );
}
