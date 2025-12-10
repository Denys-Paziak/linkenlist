"use client";

import { DealCard } from "../../../../components/deal-card";
import useSWR from "swr";
import { IDealListExtended } from "../../../../types/Deal";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../../../../components/slider-arrow-buttons";

export function FeaturedDeals() {
  const { data, isLoading, error, mutate } = useSWR<
    [IDealListExtended[], number]
  >("/deals?page=1&limit=10&isFeatured=true");

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const hasDeals = !!data && data[0]?.length > 0;
  const showArrows = hasDeals && !isLoading && !error;

  let content;

  if (isLoading) {
    content = (
      <div className="md:mx-5 overflow-hidden min-w-0" ref={emblaRef}>
        <div className="flex gap-3 md:gap-4 pb-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex-shrink-0 w-64 md:w-72">
              <div className="h-64 rounded-xl bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <p className="text-red-600 font-semibold">
          Failed to load featured deals.
        </p>
        <p className="text-sm text-gray-500 max-w-md">
          Something went wrong while loading the deals. Please check your
          connection and try again.
        </p>
        <button
          type="button"
          onClick={() => mutate()}
          className="mt-2 inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Try again
        </button>
      </div>
    );
  } else if (hasDeals) {
    content = (
      <div className="md:mx-5 overflow-hidden min-w-0" ref={emblaRef}>
        <div
          className="flex gap-3 md:gap-4 pb-4"
          style={{ touchAction: "pan-y pinch-zoom" }}
        >
          {data![0].map((deal) => (
            <div key={deal.id} className="flex-shrink-0 w-64 max-h-64 md:w-72 select-none">
              <DealCard data={deal} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
        <p className="text-gray-700 font-medium">
          No featured deals available right now.
        </p>
        <p className="text-sm text-gray-500">
          Please check back later for new military deals.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-8 md:py-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-7">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 text-left">
            Featured Military Deals
          </h2>
        </div>

        <div className="relative">
          {showArrows && (
            <>
              <PrevButton
                onClick={() => {
                  onPrevButtonClick();
                }}
                disabled={prevBtnDisabled}
              />

              <NextButton
                onClick={() => {
                  onNextButtonClick();
                }}
                disabled={nextBtnDisabled}
              />
            </>
          )}

          {content}
        </div>
      </div>
    </section>
  );
}
