"use client";

import { ExternalLink, ThumbsUp } from "lucide-react";
import { IDeal } from "../../../../../types/Deal";
import { Button } from "../../../../../components/ui/button";
import { useState } from "react";
import { fetcherUser } from "../../../../../lib/fetcher";
import { useUser } from "../../../../../contexts/user-context";
import useSWR from "swr";

export function Helpful({ data }: { data: IDeal }) {
  const { user, setShowLoginModal } = useUser();

  const { data: helpful } = useSWR<number[]>(`/deals/${data.id}/helpful`);

  const [showFireworks, setShowFireworks] = useState(false);

  const addHelpful = async () => {
    setShowFireworks(true);
    try {
      await fetcherUser(`/deals/${data.id}/add-helpful`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {}

    setTimeout(() => setShowFireworks(false), 1000);
  };

  const isHelpful = helpful?.includes(user?.id || -1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Go to Deal Button */}
        <div className="flex-shrink-0">
          <a
            href={data.outboundUrl}
            target="_blank"
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 text-base shadow-md"
          >
            <ExternalLink className="h-5 w-5" />
            {data.outboundUrlButtonLabel}
          </a>
        </div>

        {/* Feedback Section */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Helpful?</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                variant={isHelpful ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (user) {
                    if (!isHelpful) {
                      addHelpful();
                      setShowFireworks(true);
                    }
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                disabled={isHelpful}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isHelpful
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-green-200 text-green-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50"
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                {isHelpful ? "Thanks!" : "Yes"}
              </Button>

              {/* Fireworks Animation */}
              {showFireworks && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          transform: `rotate(${i * 60}deg) translateY(-20px)`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {helpful?.length} people found this helpful
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
