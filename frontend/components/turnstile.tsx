"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset?: (widgetId?: string) => void;
      remove?: (widgetId?: string) => void;
    };
    turnstileLoaded?: boolean;
  }
}

type TurnstileProps = {
  onToken: (token: string | null) => void;
};

export function Turnstile({ onToken }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let widgetId: string | null = null;
    let cancelled = false;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || cancelled) return;

      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
        callback(token) {
          onTokenRef.current(token);
        },
        "error-callback"() {
          onTokenRef.current(null);
        },
        "expired-callback"() {
          onTokenRef.current(null);
        },
      });
    };

    if (window.turnstileLoaded) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstileLoaded) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);

      return () => {
        cancelled = true;
        clearInterval(interval);
        if (widgetId && window.turnstile?.remove) {
          window.turnstile.remove(widgetId);
        }
      };
    }

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
