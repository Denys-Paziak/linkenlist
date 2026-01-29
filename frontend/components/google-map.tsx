"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/googleMaps";
import { IRealestateMarkersList } from "../types/Realestate";
import { formatCompactNumber } from "../lib/utils";

import { MarkerClusterer } from "@googlemaps/markerclusterer";

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

type Bounds = { neLat: number; neLng: number; swLat: number; swLng: number };

export function GoogleMap({
  listings,
  onViewportChange,
  onMarkerClick,
  mapApiRef,
  priceType,
}: {
  listings: IRealestateMarkersList[];
  onViewportChange?: (bounds: Bounds) => void;
  onMarkerClick: (listingId: number | null) => void;
  mapApiRef: React.MutableRefObject<{
    fitBounds: (b: google.maps.LatLngBounds) => void;
    setCenterZoom: (lat: number, lng: number, zoom: number) => void;
  } | null>;
  priceType: "sale" | "rent";
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const advCtorRef = useRef<typeof google.maps.marker.AdvancedMarkerElement | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());

  const clustererRef = useRef<MarkerClusterer | null>(null);

  const idleListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const [mapReadyTick, setMapReadyTick] = useState(0);

  const setBounds = useMemo(
    () =>
      debounce((bounds: Bounds) => {
        onViewportChange?.(bounds);
      }, 700),
    [onViewportChange],
  );

  // 1) init map + clusterer
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { Map } = await loadGoogleMaps();
      if (cancelled || !divRef.current) return;

      const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
      if (!mapId) throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID");

      const markerLib = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      advCtorRef.current = markerLib.AdvancedMarkerElement;

      const saved = localStorage.getItem("map:last");
      const initial = saved ? JSON.parse(saved) : null;

      const map = new Map(divRef.current, {
        center: initial
          ? { lat: Number(initial.lat), lng: Number(initial.lng) }
          : { lat: 39.8283, lng: -98.5795 },
        zoom: initial?.zoom ?? 12,
        mapId,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        gestureHandling: "greedy",
      });

      mapRef.current = map;

      idleListenerRef.current?.remove();
      idleListenerRef.current = map.addListener("idle", () => {
        const bounds = map.getBounds();
        const center = map.getCenter();
        const zoom = map.getZoom();
        if (!bounds || !center || zoom == null) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        setBounds({ neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng() });

        onMarkerClick(null)

        localStorage.setItem(
          "map:last",
          JSON.stringify({ lat: center.lat(), lng: center.lng(), zoom }),
        );
      });

      mapApiRef.current = {
        fitBounds: (b: google.maps.LatLngBounds) => map.fitBounds(b),
        setCenterZoom: (lat: number, lng: number, zoom: number) => {
          map.setCenter({ lat, lng });
          map.setZoom(zoom);
        },
      };

      clustererRef.current?.setMap(null);
      clustererRef.current = new MarkerClusterer({
        map,
        markers: [],
        renderer: {
          render: ({ count, position }) => {
            const AdvancedMarkerElement = advCtorRef.current!;
            return new AdvancedMarkerElement({
              position,
              content: createClusterPill(formatCompactNumber(count)),
              zIndex: 1000 + count,
            });
          },
        },
      });

      setMapReadyTick((x) => x + 1);
    })();

    return () => {
      cancelled = true;

      idleListenerRef.current?.remove();
      idleListenerRef.current = null;

      clustererRef.current?.clearMarkers();
      clustererRef.current?.setMap(null);
      clustererRef.current = null;

      for (const m of markersRef.current.values()) m.map = null;
      markersRef.current.clear();

      mapApiRef.current = null;
      mapRef.current = null;
      advCtorRef.current = null;
    };
  }, [mapApiRef, setBounds]);

  // 2) markers update + feed clusterer
  useEffect(() => {
    const map = mapRef.current;
    const AdvancedMarkerElement = advCtorRef.current;
    const clusterer = clustererRef.current;
    if (!map || !AdvancedMarkerElement || !clusterer) return;

    const markers = markersRef.current;

    const cleanListings = listings.filter(
      (l) => Number.isFinite(Number(l.lat)) && Number.isFinite(Number(l.lng)),
    );

    const incomingIds = new Set(cleanListings.map((l) => String(l.id)));

    // remove missing
    for (const [id, marker] of markers.entries()) {
      if (!incomingIds.has(id)) {
        marker.map = null;
        markers.delete(id);
      }
    }

    // add/update
    for (const l of cleanListings) {
      const id = String(l.id);
      const pos = { lat: Number(l.lat), lng: Number(l.lng) };

      const label =
        priceType === "sale"
          ? l.listPrice
            ? formatCompactNumber(l.listPrice)
            : "--"
          : l.monthlyRent
            ? formatCompactNumber(l.monthlyRent)
            : "--";

      const existing = markers.get(id);
      if (existing) {
        existing.position = pos;
        const node = existing.content as HTMLElement | null;
        if (node) node.textContent = label;
        continue;
      }

      const marker = new AdvancedMarkerElement({
        map,
        position: pos,
        title: l.title ?? "",
        content: createPricePill(label),
      });

      marker.addListener("gmp-click", () => {
        onMarkerClick(l.id);
      });

      markers.set(id, marker);
    }

    clusterer.clearMarkers();
    clusterer.addMarkers(Array.from(markers.values()));
  }, [listings, priceType, mapReadyTick]);

  return <div ref={divRef} className="w-full h-full" />;
}

function createPricePill(label: string) {
  const el = document.createElement("div");
  el.className = "gmk-pill";
  el.textContent = label;
  return el;
}

function createClusterPill(label: string) {
  const el = document.createElement("div");
  el.className = "gmk-pill gmk-cluster";
  el.textContent = label;
  return el;
}
