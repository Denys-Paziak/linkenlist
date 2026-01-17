"use client";

import { useEffect } from "react";
import Image from "next/image";
import { IListingPhoto } from "../../../../../../../types/Realestate";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function FullscreenImageGalery({
  images,
  fullscreenImageIndex,
  isFullscreenOpen,
  backToGallery,
  closeFullscreen,
  nextFullscreenImage,
  prevFullscreenImage,
}: {
  images: IListingPhoto[];
  fullscreenImageIndex: number;
  isFullscreenOpen: boolean;
  backToGallery: () => void;
  closeFullscreen: () => void;
  nextFullscreenImage: () => void;
  prevFullscreenImage: () => void;
}) {
  // Handle keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreenOpen) {
        event.preventDefault();
        if (event.key === "ArrowLeft") {
          prevFullscreenImage();
        } else if (event.key === "ArrowRight") {
          nextFullscreenImage();
        } else if (event.key === "Escape") {
          closeFullscreen();
        }
      }
    };

    if (isFullscreenOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenOpen]);

  return (
    <div
      className="fixed inset-0 bg-black z-[99999] flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          closeFullscreen();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative w-[79%] h-full flex items-center justify-center">
        <Image
          src={images[fullscreenImageIndex].url}
          width={images[fullscreenImageIndex].width}
          height={images[fullscreenImageIndex].height}
          alt={
            images[fullscreenImageIndex].caption ||
            `Property photo ${fullscreenImageIndex + 1}`
          }
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />
      </div>

      {/* Sidebar for details */}
      <div className="w-[21%] h-full bg-white p-6 overflow-y-auto text-gray-800">
        <h3 className="text-xl font-bold mb-4">Image Details</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Comment:</p>
            <p className="text-gray-600">
              {images[fullscreenImageIndex].caption ||
                `Photo ${fullscreenImageIndex + 1}`}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Close Button */}
        <div
          className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full text-white flex items-center justify-center transition-colors pointer-events-auto z-[100000] cursor-pointer"
          onClick={closeFullscreen}
        >
          <X className="h-6 w-6" />
        </div>

        {/* Back to Gallery Button */}
        <div
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors pointer-events-auto z-[100000] cursor-pointer"
          onClick={backToGallery}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to gallery
        </div>

        {/* Navigation Arrows */}
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full text-white flex items-center justify-center transition-colors pointer-events-auto z-[100000] cursor-pointer"
          onClick={prevFullscreenImage}
        >
          <ChevronLeft className="h-8 w-8" />
        </div>

        <div
          className="absolute right-[21%] top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full text-white flex items-center justify-center transition-colors pointer-events-auto z-[100000] cursor-pointer"
          onClick={nextFullscreenImage}
        >
          <ChevronRight className="h-8 w-8" />
        </div>

        {/* Photo Counter */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-lg font-medium pointer-events-none z-[100000]">
          {fullscreenImageIndex + 1} of {images.length}
        </div>
      </div>
    </div>
  );
}
