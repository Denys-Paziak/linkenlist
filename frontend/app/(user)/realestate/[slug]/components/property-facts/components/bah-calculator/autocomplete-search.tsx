"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../../../../../../../../lib/googleMaps";

export function AutocompleteSearch({
  onPlace,
}: {
  onPlace: (zipOrlabel: string) => void;
}) {

  const hostRef = useRef<HTMLDivElement | null>(null);
  const elRef = useRef<any>(null);
  const listenerAttachedRef = useRef(false);

  useEffect(() => {
    let destroyed = false;

    (async () => {
      await loadGoogleMaps();
      if (!hostRef.current || destroyed) return;

      if (!elRef.current) {
        elRef.current = new google.maps.places.PlaceAutocompleteElement({
          componentRestrictions: { country: "us" },
        });

        elRef.current.setAttribute(
          "placeholder",
          "Biloxi, MS",
        );
      }

      if (!listenerAttachedRef.current) {
        elRef.current.addEventListener("gmp-select", async (e: any) => {
          const prediction = e?.detail?.placePrediction ?? e?.placePrediction;
          if (!prediction) return;

          const place = await prediction.toPlace();
          await place.fetchFields({
            fields: ["addressComponents"],
          });

          const zipCode = place.addressComponents?.find((component: any) =>
            component.types.includes("postal_code"),
          )?.shortText;

          const label = prediction.text?.text;

          onPlace(zipCode || label);
        });

        listenerAttachedRef.current = true;
      }

      hostRef.current.innerHTML = "";
      hostRef.current.appendChild(elRef.current);
    })();

    return () => {
      destroyed = true;
    };
  }, [hostRef, onPlace]);

  return (
    <div className="w-full">
      <div ref={hostRef} className="autocomplete-wrapper" />
    </div>
  );
}
