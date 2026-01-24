"use client";

import { MapPin, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../../../../components/ui/card";
import { useState } from "react";

export function MapLocation() {
  const [expandedMap, setExpandedMap] = useState<boolean>(false);

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
            <p className="text-gray-500">Map Placeholder</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
