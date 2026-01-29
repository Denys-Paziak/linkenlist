"use client";

import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "@/lib/googleMaps";

export function GoogleMapSingleMarker({
  initialCenter,          // центр при ініціалізації
  markerPosition,         // позиція єдиного маркера (може відрізнятись)
  zoom = 14,
  title,
  mapOptions,
  followMarker = false,   // якщо true — при зміні markerPosition карта центрується на ньому
}: {
  initialCenter: { lat: number; lng: number };
  markerPosition: { lat: number; lng: number };
  zoom?: number;
  title?: string;
  mapOptions?: Partial<google.maps.MapOptions>;
  followMarker?: boolean;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { Map } = await loadGoogleMaps();
      if (cancelled || !divRef.current) return;

      const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
      if (!mapId) throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID");

      await google.maps.importLibrary("marker");

      const map = new Map(divRef.current, {
        center: initialCenter,
        zoom,
        mapId,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        clickableIcons: false,
        gestureHandling: "greedy",
        ...mapOptions,
      });

      mapRef.current = map;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: markerPosition,
        title: title ?? "",
      });

      markerRef.current = marker;

      map.setCenter(markerPosition);
    })();

    return () => {
      cancelled = true;
      if (markerRef.current) markerRef.current.map = null;
      markerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    marker.position = markerPosition;

    if (followMarker) {
      map.setCenter(markerPosition);
    }
  }, [markerPosition.lat, markerPosition.lng, followMarker]);

  return <div ref={divRef} className="w-full h-full" />;
}
