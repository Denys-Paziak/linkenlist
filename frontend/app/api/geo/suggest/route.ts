import { type NextRequest, NextResponse } from "next/server"

// Mock data for suggestions
const mockSuggestions = [
  // Cities
  { id: "city-1", label: "Washington, DC", type: "city", lat: 38.9072, lng: -77.0369 },
  { id: "city-2", label: "San Diego, CA", type: "city", lat: 32.7157, lng: -117.1611 },
  { id: "city-3", label: "San Francisco, CA", type: "city", lat: 37.7749, lng: -122.4194 },
  { id: "city-4", label: "Los Angeles, CA", type: "city", lat: 34.0522, lng: -118.2437 },
  { id: "city-5", label: "Sacramento, CA", type: "city", lat: 38.5816, lng: -121.4944 },
  { id: "city-6", label: "Norfolk, VA", type: "city", lat: 36.8468, lng: -76.2852 },
  { id: "city-7", label: "Colorado Springs, CO", type: "city", lat: 38.8339, lng: -104.8214 },

  // ZIP codes
  { id: "zip-1", label: "20001 - Washington, DC", type: "zip", lat: 38.9072, lng: -77.0369 },
  { id: "zip-2", label: "92101 - Downtown San Diego", type: "zip", lat: 32.7157, lng: -117.1611 },
  { id: "zip-3", label: "94102 - San Francisco", type: "zip", lat: 37.7849, lng: -122.4094 },
  { id: "zip-4", label: "90210 - Beverly Hills", type: "zip", lat: 34.0901, lng: -118.4065 },
  { id: "zip-5", label: "92037 - La Jolla", type: "zip", lat: 32.8328, lng: -117.2713 },
  { id: "zip-6", label: "23502 - Norfolk, VA", type: "zip", lat: 36.8468, lng: -76.2852 },

  // Addresses
  { id: "addr-1", label: "1234 Main St, Washington, DC 20001", type: "address", lat: 38.9072, lng: -77.0369 },
  { id: "addr-2", label: "1234 Marine Dr, Oceanside, CA 92057", type: "address", lat: 33.1958, lng: -117.3794 },
  { id: "addr-3", label: "5678 Ocean Blvd, La Jolla, CA 92037", type: "address", lat: 32.8328, lng: -117.2713 },
  { id: "addr-4", label: "9012 Sunset Strip, West Hollywood, CA 90069", type: "address", lat: 34.0901, lng: -118.385 },
  {
    id: "addr-5",
    label: "3456 Base Housing Blvd, Colorado Springs, CO 80906",
    type: "address",
    lat: 38.8339,
    lng: -104.8214,
  },

  // Military Bases
  { id: "base-1", label: "Naval Base San Diego", type: "base", lat: 32.6761, lng: -117.1294 },
  { id: "base-2", label: "Camp Pendleton", type: "base", lat: 33.3806, lng: -117.3439 },
  { id: "base-3", label: "Edwards Air Force Base", type: "base", lat: 34.9054, lng: -117.8839 },
  { id: "base-4", label: "Naval Air Station North Island", type: "base", lat: 32.6992, lng: -117.2147 },
  { id: "base-5", label: "Naval Station Norfolk", type: "base", lat: 36.9467, lng: -76.3297 },
  { id: "base-6", label: "Peterson Space Force Base", type: "base", lat: 38.8125, lng: -104.7006 },
  { id: "base-7", label: "Fort Bragg (Fort Liberty)", type: "base", lat: 35.1418, lng: -79.0059 },
  { id: "base-8", label: "Joint Base Lewis-McChord", type: "base", lat: 47.0379, lng: -122.5816 },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  // Return empty if query is too short
  if (query.length < 2) {
    return NextResponse.json([])
  }

  // Filter suggestions based on query
  const filtered = mockSuggestions.filter((suggestion) => suggestion.label.toLowerCase().includes(query))

  await new Promise((resolve) => setTimeout(resolve, 100))

  return NextResponse.json(filtered.slice(0, 5))
}
