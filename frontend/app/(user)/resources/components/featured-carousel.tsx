"use client";

import { ResourceCard } from "../../../../components/resource-card";
import { IResourceListExtended } from "../../../../types/Resource";
import useSWR from "swr";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../../../../components/slider-arrow-buttons";

export function FeaturedCarousel() {
  const { data, isLoading, error } = useSWR<
    [IResourceListExtended[], number]
  >("/resources?page=1&limit=10&isFeatured=true");

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
          Failed to load featured resources.
        </p>
        <p className="text-sm text-gray-500 max-w-md">
          Something went wrong while loading the deals. Please check your
          connection and try again.
        </p>
      </div>
    );
  } else if (hasDeals) {
    content = (
      <div className="md:mx-5 overflow-hidden min-w-0" ref={emblaRef}>
        <div
          className="flex gap-3 md:gap-4 pb-4"
          style={{ touchAction: "pan-y pinch-zoom" }}
        >
          {data![0].map((resource) => (
            <div
              key={resource.id}
              className="flex-shrink-0 w-64 md:w-72 max-h-64 select-none"
            >
              <ResourceCard data={resource} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
        <p className="text-white font-medium">
          No featured resources available right now.
        </p>
      </div>
    );
  }

  return (
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
  );
}
