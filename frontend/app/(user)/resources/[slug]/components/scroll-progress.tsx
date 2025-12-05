'use client'

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = Math.max(
        0,
        Math.min((scrollTop / docHeight) * 100, 100)
      );
      setScrollProgress(progress);
    };

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, []);

  return (
    <div className="fixed top-[56px] left-0 right-0 z-30">
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
}
