"use client";

import { useEffect, useMemo, useRef } from "react";
import { loadGoogleMaps } from "@/lib/googleMaps";

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const mapStyle: google.maps.MapTypeStyle[] = [
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

type Bounds = { neLat: number; neLng: number; swLat: number; swLng: number };

type ListingMarker = {
  id: number | string;
  lat: number;
  lng: number;
  title?: string;
};

export function GoogleMap({
  listings,
  onViewportChange,
  mapApiRef,
}: {
  listings: ListingMarker[];
  onViewportChange?: (bounds: Bounds) => void;
  mapApiRef: React.MutableRefObject<any>;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  const setBounds = useMemo(
    () =>
      debounce(async (bounds: Bounds) => {
        onViewportChange?.(bounds);
      }, 700),
    [],
  );
  
  // 1) init map
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { Map } = await loadGoogleMaps();
      if (cancelled || !divRef.current) return;

      const saved = localStorage.getItem("map:last");
      const initial = saved ? JSON.parse(saved) : null;

      const map = new Map(divRef.current, {
        center: initial
          ? { lat: initial.lat, lng: initial.lng }
          : { lat: 39.8283, lng: -98.5795 },
        zoom: initial?.zoom ?? 12,
        styles: mapStyle,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        gestureHandling: "greedy",
      });

      mapRef.current = map;

      // viewport sync
      map.addListener("idle", () => {
        const bounds = map.getBounds();
        const center = map.getCenter();
        const zoom = map.getZoom();

        if (!bounds || !center || zoom == null) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        setBounds({
          neLat: ne.lat(),
          neLng: ne.lng(),
          swLat: sw.lat(),
          swLng: sw.lng(),
        });

        const mapState = {
          lat: center.lat(),
          lng: center.lng(),
          zoom,
        };

        localStorage.setItem("map:last", JSON.stringify(mapState));
      });

      // Places Autocomplete
      mapApiRef.current = {
        fitBounds: (b: google.maps.LatLngBounds) => map.fitBounds(b),
        setCenterZoom: (lat: number, lng: number, zoom: number) => {
          map.setCenter({ lat, lng });
          map.setZoom(zoom);
        },
      };
    })();

    return () => {
      cancelled = true;
    };
  }, [onViewportChange, mapApiRef]);

  // 2) markers update
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers = markersRef.current;
    const incomingIds = new Set(listings.map((l) => String(l.id)));

    // remove markers that disappeared
    for (const [id, marker] of markers.entries()) {
      if (!incomingIds.has(id)) {
        marker.setMap(null);
        markers.delete(id);
      }
    }

    // add/update markers
    for (const l of listings) {
      const id = String(l.id);
      const pos = { lat: Number(l.lat), lng: Number(l.lng) };

      if (markers.has(id)) {
        markers.get(id)!.setPosition(pos);
      } else {
        const marker = new google.maps.Marker({
          map,
          position: pos,
          title: l.title ?? "",
        });

        marker.addListener("click", () => {
          console.log("marker click", l.id);
        });

        markers.set(id, marker);
      }
    }
  }, [listings]);

  return <div ref={divRef} className="w-full h-full" />;
}
