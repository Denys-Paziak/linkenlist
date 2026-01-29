"use client";

import { MapPin, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../../../../components/ui/card";
import { useState } from "react";
import { GoogleMapSingleMarker } from "../../../../../../../components/google-map-single-marker";
import { IRealestate } from "../../../../../../../types/Realestate";

export function MapLocation({ listing }: { listing: IRealestate }) {
  const [expandedMap, setExpandedMap] = useState<boolean>(false);

  if (!listing.lat || !listing.lng) return null;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => setExpandedMap((state) => !state)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h3 className="font-bold text-gray-900">Map Location</h3>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-600 transition-transform ${expandedMap ? "rotate-180" : ""}`}
          />
        </div>
      </CardHeader>
      {expandedMap && (
        <CardContent className="p-4">
          <div className="bg-gray-200 h-64 flex items-center justify-center rounded-md">
            <GoogleMapSingleMarker
              initialCenter={{
                lat: listing.lat,
                lng: listing.lng,
              }}
              markerPosition={{
                lat: listing.lat,
                lng: listing.lng,
              }}
              zoom={13}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
