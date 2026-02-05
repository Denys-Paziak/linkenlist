"use client";

import { useCallback, useState } from "react";
import { GoogleMap } from "../../../../components/google-map";
import useSWR from "swr";
import {
  IRealestateMarkersList,
  IRealestateOwnerList,
} from "../../../../types/Realestate";
import { useQueryStateWithLocalStorage } from "../../../../hooks/use-query-state-with-local-storage";
import { parseAsFloat } from "nuqs";
import { useSearchContext } from "./search-context";
import { RealestateCard } from "../../../../components/realestate-card";
import { Loader2 } from "lucide-react";

export function RealestateMap({
  mapApiRef,
}: {
  mapApiRef: React.MutableRefObject<any>;
}) {
  const { query } = useSearchContext();

  const [neLat, setNeLat] = useQueryStateWithLocalStorage("/realestate?neLat", {
    defaultValue: null,
    parse: (v) => parseAsFloat.parse(v),
    sync: true,
  });

  const [neLng, setNeLng] = useQueryStateWithLocalStorage("/realestate?neLng", {
    defaultValue: null,
    parse: (v) => parseAsFloat.parse(v),
    sync: true,
  });

  const [swLat, setSwLat] = useQueryStateWithLocalStorage("/realestate?swLat", {
    defaultValue: null,
    parse: (v) => parseAsFloat.parse(v),
    sync: true,
  });

  const [swLng, setSwLng] = useQueryStateWithLocalStorage("/realestate?swLng", {
    defaultValue: null,
    parse: (v) => parseAsFloat.parse(v),
    sync: true,
  });

  const params = new URLSearchParams(query);
  params.set("neLat", String(neLat));
  params.set("neLng", String(neLng));
  params.set("swLat", String(swLat));
  params.set("swLng", String(swLng));
  const key = !neLat || !neLng || !swLat || !swLng ? null : `/listings/map?${params.toString()}`;
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

  const [markerListingId, setMarkerListingId] = useState<number | null>(null);

  const onMarkerClick = useCallback((id: number | null) => {
    setMarkerListingId(id);
  }, []);

  return (
    <div className="flex-1 relative h-full">
      <div className="absolute inset-0 h-full">
        <GoogleMap
          mapApiRef={mapApiRef}
          listings={realestate || []}
          onViewportChange={onViewportChange}
          onMarkerClick={onMarkerClick}
          priceType={params.get("dealType") as "rent" | "sale"}
        />
        {markerListingId && <MapListingCard listingId={markerListingId} />}
      </div>
    </div>
  );
}

function MapListingCard({ listingId }: { listingId: number }) {
  const {
    data: listing,
    isLoading,
    isValidating,
  } = useSWR<IRealestateOwnerList>(`/listings/list/${listingId}`);

  return (
    <div className="absolute right-0 top-0 w-[330px] h-[265px] bg-white">
      {isLoading || isValidating ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : listing ? (
        <RealestateCard key={listing.id} data={listing} showPremiumFeatures />
      ) : (
        <div className="text-center py-8 m-3">
          <p className="text-muted-foreground text-base">
            No Reale State found
          </p>
        </div>
      )}
    </div>
  );
}
