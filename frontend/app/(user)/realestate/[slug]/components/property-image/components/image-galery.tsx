"use client";

import { ChevronLeft, X } from "lucide-react";
import { Button } from "../../../../../../../components/ui/button";
import Image from "next/image";
import { IListingPhoto } from "../../../../../../../types/Realestate";

export function ImageGalery({
  images,
  closePhotoGallery,
  openFullscreen,
}: {
  images: IListingPhoto[];
  closePhotoGallery: () => void;
  openFullscreen: (index: number) => void;
}) {
  const renderGalleryImages = () => {
    const elements = [];
    let imageIndex = 0;

    while (imageIndex < images.length) {
      const isEvenRow = Math.floor(elements.length) % 2 === 0;

      if (isEvenRow) {
        // Row pattern: Large photo (60%) on left, 2 small photos (40%) on right
        const rowImages = [];

        // Large photo on left
        if (imageIndex < images.length) {
          const idx = imageIndex;

          rowImages.push(
            <div
              key={`large-left-${idx}`}
              className="w-[60%] relative aspect-[3/2] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => {
                openFullscreen(idx);
              }}
            >
              <Image
                src={images[idx].url}
                width={images[idx].width}
                height={images[idx].height}
                alt={`Property photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {idx + 1}
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity max-w-[200px] truncate">
                {images[idx].caption || `Photo ${idx + 1}`}
              </div>
            </div>
          );
          imageIndex++;
        }

        // Two small photos on right
        const smallPhotos = [];
        for (let i = 0; i < 2 && imageIndex < images.length; i++) {
          const idx = imageIndex;

          smallPhotos.push(
            <div
              key={`small-right-${idx}`}
              className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openFullscreen(idx)}
            >
              <Image
                src={images[idx].url}
                width={images[idx].width}
                height={images[idx].height}
                alt={`Property photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {idx + 1}
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity max-w-[150px] truncate">
                {images[idx].caption || `Photo ${idx + 1}`}
              </div>
            </div>
          );
          imageIndex++;
        }

        if (smallPhotos.length > 0) {
          rowImages.push(
            <div
              key={`small-stack-right-${imageIndex}`}
              className="w-[40%] flex flex-col gap-2"
            >
              {smallPhotos}
            </div>
          );
        }

        if (rowImages.length > 0) {
          elements.push(
            <div
              key={`row-even-${elements.length}`}
              className="flex gap-4 w-full"
            >
              {rowImages}
            </div>
          );
        }
      } else {
        // Row pattern: 2 small photos (40%) on left, Large photo (60%) on right
        const rowImages = [];

        // Two small photos on left
        const smallPhotos = [];
        for (let i = 0; i < 2 && imageIndex < images.length; i++) {
          const idx = imageIndex;

          smallPhotos.push(
            <div
              key={`small-left-${idx}`}
              className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openFullscreen(idx)}
            >
              <Image
                src={images[idx].url}
                width={images[idx].width}
                height={images[idx].height}
                alt={`Property ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {idx + 1}
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity max-w-[150px] truncate">
                {images[idx].caption || `Photo ${idx + 1}`}
              </div>
            </div>
          );
          imageIndex++;
        }

        if (smallPhotos.length > 0) {
          rowImages.push(
            <div
              key={`small-stack-left-${imageIndex}`}
              className="w-[40%] flex flex-col gap-2"
            >
              {smallPhotos}
            </div>
          );
        }

        // Large photo on right
        if (imageIndex < images.length) {
          const idx = imageIndex;

          rowImages.push(
            <div
              key={`large-right-${idx}`}
              className="w-[60%] relative aspect-[3/2] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openFullscreen(idx)}
            >
              <Image
                src={images[idx].url}
                width={images[idx].width}
                height={images[idx].height}
                alt={`Property photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {idx + 1}
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity max-w-[200px] truncate">
                {images[idx].caption || `Photo ${idx + 1}`}
              </div>
            </div>
          );
          imageIndex++;
        }

        if (rowImages.length > 0) {
          elements.push(
            <div
              key={`row-odd-${elements.length}`}
              className="flex gap-4 w-full"
            >
              {rowImages}
            </div>
          );
        }
      }
    }

    return elements;
  };

  return (
    <div
      className="fixed inset-0 z-[10003] flex items-center justify-center p-4 bg-black/50"
      onClick={closePhotoGallery}
    >
      <div
        className="flex flex-col w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={closePhotoGallery}
              className="text-gray-600 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to listing
            </Button>
            <span className="text-sm text-gray-600">
              {images.length} photos
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closePhotoGallery}
            className="text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4 w-full">{renderGalleryImages()}</div>
        </div>
      </div>
    </div>
  );
}
