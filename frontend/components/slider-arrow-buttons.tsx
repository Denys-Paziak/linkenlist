"use client";

import { EmblaCarouselType } from "embla-carousel";
import { ComponentPropsWithRef, useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    onButtonClick?.(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    onButtonClick?.(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

export const PrevButton: React.FC<ComponentPropsWithRef<"button">> = (
  props,
) => {
  const { children, className, ...restProps } = props;

  return (
    <button
      aria-label="prev slide"
      type="button"
      {...restProps}
      className={cn(
        "hidden md:block cursor-pointer absolute -left-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg",
        className,
      )}
    >
      <ChevronLeft aria-hidden="true" className="h-5 w-5" />
    </button>
  );
};

export const NextButton: React.FC<ComponentPropsWithRef<"button">> = (
  props,
) => {
  const { children, className, ...restProps } = props;

  return (
    <button
      aria-label="next slide"
      type="button"
      {...restProps}
      className={cn(
        "hidden md:block cursor-pointer absolute -right-6 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 text-gray-600 hover:bg-white hover:shadow-lg",
        className,
      )}
    >
      <ChevronRight aria-hidden="true" className="h-5 w-5" />
    </button>
  );
};
