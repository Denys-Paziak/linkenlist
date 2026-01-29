"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../../../../../../lib/googleMaps";
import { useQueryStateWithLocalStorage } from "../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsString } from "nuqs";

export function AutocompleteSearch({
  onPlace,
}: {
  onPlace: (place: {
    viewport?: google.maps.LatLngBounds;
    location?: google.maps.LatLng;
  }) => void;
}) {
  const [search, setSearch] = useQueryStateWithLocalStorage(
    "/realestate?search",
    {
      defaultValue: "",
      parse: (v) => parseAsString.parse(v),
      sync: true,
    },
  );

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
          "Search by base, ZIP, or city",
        );
        elRef.current.setAttribute("value", search);
      }

      if (!listenerAttachedRef.current) {
        elRef.current.addEventListener("gmp-select", async (e: any) => {
          const prediction = e?.detail?.placePrediction ?? e?.placePrediction;
          if (!prediction) return;

          const place = await prediction.toPlace();
          await place.fetchFields({ fields: ["location", "viewport"] });
          const label = prediction.text?.text;

          setSearch(label);
          onPlace(place);
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

  useEffect(() => {
    if (elRef.current) {
      elRef.current.setAttribute("value", search);
    }
  }, [search]);

  return (
    <div className="flex items-center gap-2 max-md:relative max-md:flex-1">
      <div className="relative w-0 md:w-80 max-md:flex-1">
        <div ref={hostRef} className="autocomplete-wrapper" />
      </div>
    </div>
  );
}
