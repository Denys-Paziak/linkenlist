"use client";

import { useCallback, useState } from "react";
import { GoogleMap } from "../../../../components/google-map";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { IRealestateMarkersList } from "../../../../types/Realestate";
import { useQueryStateWithLocalStorage } from "../../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger } from "nuqs";
import { useSearchContext } from "./search-context";
import { useDebounce } from "use-debounce";

export function RealestateMap({
  mapApiRef,
}: {
  mapApiRef: React.MutableRefObject<any>;
}) {
  const { query } = useSearchContext();

  const [neLat, setNeLat] = useQueryStateWithLocalStorage("/realestate?neLat", {
    defaultValue: null,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [neLng, setNeLng] = useQueryStateWithLocalStorage("/realestate?neLng", {
    defaultValue: null,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [swLat, setSwLat] = useQueryStateWithLocalStorage("/realestate?swLat", {
    defaultValue: null,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const [swLng, setSwLng] = useQueryStateWithLocalStorage("/realestate?swLng", {
    defaultValue: null,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const params = new URLSearchParams(query);
  params.set("neLat", String(neLat));
  params.set("neLng", String(neLng));
  params.set("swLat", String(swLat));
  params.set("swLng", String(swLng));
  const key = `/listings/map?${params.toString()}`;
  const { data: realestate } = useSWR<IRealestateMarkersList[]>(key);

  const onViewportChange = useCallback(
    async (b: {
      neLat: number;
      neLng: number;
      swLat: number;
      swLng: number;
    }) => {
      setNeLat(b.neLat);
      setNeLng(b.neLng);
      setSwLat(b.swLat);
      setSwLng(b.swLng);
    },
    [],
  );

  return (
    <div className="flex-1 relative h-full">
      <div className="absolute inset-0 h-full">
        <GoogleMap
          mapApiRef={mapApiRef}
          listings={realestate || []}
          onViewportChange={onViewportChange}
        />
      </div>
    </div>
  );
}
