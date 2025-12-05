"use client";

import { CheckCircle, Copy, ThumbsUp } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useState } from "react";
import { fetcherUser } from "../../../../../lib/fetcher";
import { useUser } from "../../../../../contexts/user-context";
import { IResource } from "../../../../../types/Resource";

export function Helpful({ data }: { data: IResource }) {
  const { user, setShowLoginModal } = useUser();

  const [showFireworks, setShowFireworks] = useState(false);
  const [copied, setCopied] = useState(false);

  const addHelpful = async () => {
    setShowFireworks(true);
    try {
      await fetcherUser(`/resources/${data.id}/add-helpful`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {}

    setTimeout(() => setShowFireworks(false), 1000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const isHelpful = data.helpful.includes(user?.id || -1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Share Buttons */}
        <div>
          <h3 className="font-bold text-foreground mb-4 text-base">
            Share this article
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 bg-white"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
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
              {data.totalHelpful} people found this helpful
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
