"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../../../../components/ui/button";
import { IListingPhoto } from "../../../../../../../types/Realestate";
import Image from "next/image";
import { useState } from "react";

export function MobileCarousel({ images }: { images: IListingPhoto[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="lg:hidden relative h-64 md:h-80 bg-gray-200">
      <Image
        src={images[currentImageIndex].url}
        width={images[currentImageIndex].width}
        height={images[currentImageIndex].height}
        alt="Property"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-white/80 hover:bg-white"
          onClick={prevImage}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-white/80 hover:bg-white"
          onClick={nextImage}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-medium">
        {currentImageIndex + 1} / {images.length}
      </div>
    </div>
  );
}
