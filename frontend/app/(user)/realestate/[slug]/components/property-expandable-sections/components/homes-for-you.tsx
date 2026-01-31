"use client";

import useEmblaCarousel from "embla-carousel-react";
import useSWR from "swr";
import { IRealestateList } from "../../../../../../../types/Realestate";
import {
  usePrevNextButtons,
  PrevButton,
  NextButton,
} from "../../../../../../../components/slider-arrow-buttons";
import { RealestateCard } from "../../../../../../../components/realestate-card";

export function HomesForYou({ listingId }: { listingId: number }) {
  const { data, isLoading, error } = useSWR<IRealestateList[]>(
    `/listings/${listingId}/similar`,
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const hasListings = !!data && data?.length > 0;

  if (!hasListings || error) {
    return null
  }
  const showArrows = hasListings && !isLoading && !error;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 ml-2.5">
        <h3 className="text-xl font-bold text-gray-900">Similar homes</h3>
        <div className="flex gap-2 mx-2 relative">
          {showArrows && (
            <>
              <PrevButton
                onClick={() => {
                  onPrevButtonClick();
                }}
                disabled={prevBtnDisabled}
                className="static md:flex items-center justify-center -translate-y-0 ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring whitespace-nowrap text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground border rounded-md w-8 h-8 p-0"
              />

              <NextButton
                onClick={() => {
                  onNextButtonClick();
                }}
                disabled={nextBtnDisabled}
                className="static md:flex items-center justify-center -translate-y-0 ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring  whitespace-nowrap text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground border rounded-md w-8 h-8 p-0"
              />
            </>
          )}
        </div>
      </div>
      <div
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="md:mx-5 overflow-hidden min-w-0" ref={emblaRef}>
            <div
              className="flex gap-3 md:gap-4 pb-4"
              style={{ touchAction: "pan-y pinch-zoom" }}
            >
              {data?.map((listing) => (
                <div
                  key={listing.id}
                  className="flex-shrink-0 w-64 max-h-64 md:w-72 select-none"
                >
                  <RealestateCard data={listing} showPremiumFeatures />
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
