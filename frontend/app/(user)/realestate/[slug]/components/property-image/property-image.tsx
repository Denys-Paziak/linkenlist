"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { IOwnerRealestate } from "../../../../../../types/Realestate";
import { FullscreenImageGalery } from "./components/fullscreen-image-galery";
import { ImageGalery } from "./components/image-galery";
import { MobileCarousel } from "./components/mobile-carousel";
import Image from "next/image";

export function PropertyImage({ listing }: { listing: IOwnerRealestate }) {
  const { photos: images } = listing;

  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);

  const openPhotoGallery = useCallback(() => {
    setIsPhotoGalleryOpen(true);
  }, []);

  const closePhotoGallery = useCallback(() => {
    setIsPhotoGalleryOpen(false);
  }, []);

  const openFullscreen = useCallback((index: number) => {
    setFullscreenImageIndex(index);
    setIsFullscreenOpen(true);
  }, []);

  const backToGallery = useCallback(() => {
    setIsFullscreenOpen(false);
    setIsPhotoGalleryOpen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreenOpen(false);
  }, []);

  const nextFullscreenImage = useCallback(() => {
    setFullscreenImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const prevFullscreenImage = useCallback(() => {
    setFullscreenImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, []);

  return (
    <>
      {/* Desktop Image Grid */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-2 relative">
        {/* Primary Image */}
        {
          images[0]
            ? <div
              className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md group cursor-pointer"
              onClick={() => openFullscreen(0)}
            >
              <Image
                src={images[0].url}
                width={images[0].width}
                height={images[0].height}
                alt={images[0].caption || "Property main"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity max-w-[200px] truncate">
                {images[0].caption || "Property photo"}
              </div>
            </div>
            : <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md" />
        }

        {/* Secondary Images */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {images.slice(1, 5).map((img, index) => (
            <div
              key={img.id}
              className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md group cursor-pointer"
              onClick={() => openFullscreen(index + 1)}
            >
              <Image
                src={img.url}
                width={img.width}
                height={img.height}
                alt={img.caption || `Property ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity max-w-[150px] truncate">
                {img.caption || `Photo ${index + 2}`}
              </div>
            </div>
          ))}
        </div>

        {/* See all photos button */}
        <div className="absolute bottom-2 right-2 z-10">
          <Button
            variant="secondary"
            className="bg-white/90 hover:bg-white text-gray-800 text-xs px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              openPhotoGallery();
            }}
          >
            <ImageIcon className="h-4 w-4" />
            See all {images.length} photos
          </Button>
        </div>
      </div>

      {
        images.length !== 0
          ? <>
            {/* Mobile Carousel */}
            <MobileCarousel images={images} />

            {/* Photo Gallery Modal */}
            {isPhotoGalleryOpen && (
              <ImageGalery
                images={images}
                closePhotoGallery={closePhotoGallery}
                openFullscreen={openFullscreen}
              />
            )}

            {/* Fullscreen Image Modal */}
            {isFullscreenOpen && (
              <FullscreenImageGalery
                images={images}
                fullscreenImageIndex={fullscreenImageIndex}
                isFullscreenOpen={isFullscreenOpen}
                backToGallery={backToGallery}
                closeFullscreen={closeFullscreen}
                nextFullscreenImage={nextFullscreenImage}
                prevFullscreenImage={prevFullscreenImage}
              />
            )}
          </>
          : null
      }
    </>
  );
}
