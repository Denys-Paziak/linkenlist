"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { geoCentroid } from "d3-geo"
import { Drawer } from "vaul"
import { Search, X, MapPin, Home, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { STATE_ABBR, SMALL_OFFSETS } from "@/data/state-data"

interface Base {
  id: string
  name: string
  state: string
  lat: number
  lng: number
  listingCount: number
  medianRent: number
}

interface BaseData {
  homes: Array<{ id: string; title: string; price: string; beds: number; baths: number }>
  resources: Array<{ id: string; title: string; category: string; description: string }>
  deals: Array<{ id: string; title: string; discount: string; category: string }>
}

const geoUrl = "/data/us-states-10m.json"

export function InteractiveBaseMap() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bases, setBases] = useState<Base[]>([])
  const [selectedBase, setSelectedBase] = useState<Base | null>(null)
  const [activeTab, setActiveTab] = useState<"homes" | "resources" | "deals">("homes")
  const [baseData, setBaseData] = useState<BaseData>({ homes: [], resources: [], deals: [] })
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBases, setFilteredBases] = useState<Base[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [tooltipContent, setTooltipContent] = useState("")
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Load bases data
  useEffect(() => {
    fetch("/data/bases.json")
      .then((res) => res.json())
      .then((data: Base[]) => {
        setBases(data)
        setFilteredBases(data)
      })
  }, [])

  // Handle URL state
  useEffect(() => {
    const baseId = searchParams.get("base")
    const tab = searchParams.get("tab") as "homes" | "resources" | "deals" | null

    if (baseId && bases.length > 0) {
      const base = bases.find((b) => b.id === baseId)
      if (base) {
        setSelectedBase(base)
        setActiveTab(tab || "homes")
      }
    }
  }, [searchParams, bases])

  // Load base data when selected
  useEffect(() => {
    if (selectedBase) {
      Promise.all([
        fetch(`/api/base/${selectedBase.id}/homes`).then((res) => res.json()),
        fetch(`/api/base/${selectedBase.id}/resources`).then((res) => res.json()),
        fetch(`/api/base/${selectedBase.id}/deals`).then((res) => res.json()),
      ]).then(([homes, resources, deals]) => {
        setBaseData({ homes, resources, deals })
      })
    }
  }, [selectedBase])

  // Search functionality
  useEffect(() => {
    if (searchQuery) {
      const filtered = bases.filter(
        (base) =>
          base.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          base.state.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredBases(filtered)
    } else {
      setFilteredBases(bases)
    }
  }, [searchQuery, bases])

  const handleBaseClick = (base: Base) => {
    setSelectedBase(base)
    setActiveTab("homes")
    const params = new URLSearchParams(searchParams)
    params.set("base", base.id)
    params.set("tab", "homes")
    router.push(`/?${params.toString()}`)
  }

  const handleTabChange = (tab: "homes" | "resources" | "deals") => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams)
    if (selectedBase) {
      params.set("base", selectedBase.id)
      params.set("tab", tab)
      router.push(`/?${params.toString()}`)
    }
  }

  const closeSheet = () => {
    setSelectedBase(null)
    const params = new URLSearchParams(searchParams)
    params.delete("base")
    params.delete("tab")
    router.push(`/?${params.toString()}`)
  }

  const handleSearchSelect = (base: Base) => {
    handleBaseClick(base)
    setShowSearch(false)
    setSearchQuery("")
  }

  return (
    <div className="w-full max-w-[1080px] mx-auto px-4">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search bases or cities..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowSearch(e.target.value.length > 0)
            }}
            onFocus={() => setShowSearch(searchQuery.length > 0)}
            className="pl-10 pr-4 py-2 w-full max-w-md"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearch && filteredBases.length > 0 && (
          <div className="absolute top-full left-0 right-0 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredBases.slice(0, 5).map((base) => (
              <button
                key={base.id}
                onClick={() => handleSearchSelect(base)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{base.name}</div>
                <div className="text-sm text-gray-500">
                  {base.state} • {base.listingCount} listings
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-xl border border-gray-200/50 overflow-hidden p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-[4/3] md:aspect-[21/10]">
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{
                scale: 900,
              }}
              width={900}
              height={540}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => {
                  console.log("[v0] Total geographies:", geographies.length)
                  console.log(
                    "[v0] First few state names:",
                    geographies.slice(0, 3).map((geo) => geo.properties.NAME),
                  )
                  console.log("[v0] STATE_ABBR keys:", Object.keys(STATE_ABBR).slice(0, 5))

                  return geographies.map((geo) => {
                    const centroid = geoCentroid(geo)
                    const stateName = geo.properties.NAME
                    const stateAbbr = STATE_ABBR[stateName]
                    const offset = SMALL_OFFSETS[stateName] || { dx: 0, dy: 0 }

                    if (!stateAbbr) {
                      console.log("[v0] No abbreviation found for state:", stateName)
                    }

                    return (
                      <g key={geo.rsmKey}>
                        <Geography
                          geography={geo}
                          fill="#F3F4F6"
                          stroke="#D1D5DB"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: "#E5E7EB" },
                            pressed: { outline: "none" },
                          }}
                        />
                        {stateAbbr && (
                          <text
                            x={centroid[0] + offset.dx}
                            y={centroid[1] + offset.dy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-sm font-bold fill-gray-900 pointer-events-none select-none"
                            style={{
                              fontSize: "16px", // Increased font size for better visibility
                              stroke: "#ffffff",
                              strokeWidth: "3px", // Increased stroke width
                              paintOrder: "stroke fill",
                              fontWeight: "bold", // Added explicit font weight
                            }}
                          >
                            {stateAbbr}
                          </text>
                        )}
                      </g>
                    )
                  })
                }}
              </Geographies>

              {/* Base Markers */}
              {bases.map((base) => (
                <Marker
                  key={base.id}
                  coordinates={[base.lng, base.lat]}
                  onClick={() => handleBaseClick(base)}
                  onMouseEnter={(e) => {
                    setTooltipContent(`${base.name} • ${base.listingCount} listings`)
                    setTooltipPosition({ x: e.clientX, y: e.clientY })
                  }}
                  onMouseLeave={() => setTooltipContent("")}
                >
                  <circle
                    r={7}
                    fill="#1e40af"
                    stroke="#fff"
                    strokeWidth={3}
                    className="cursor-pointer hover:fill-blue-700 transition-all duration-200 drop-shadow-sm"
                  />
                  <text
                    textAnchor="middle"
                    y={-12}
                    className="text-xs font-semibold fill-gray-800 pointer-events-none drop-shadow-sm"
                  >
                    {base.listingCount}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed bg-black text-white px-2 py-1 rounded text-sm pointer-events-none z-50"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 30,
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Bottom Sheet */}
      <Drawer.Root open={!!selectedBase} onOpenChange={(open) => !open && closeSheet()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[80vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-hidden">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />

              {selectedBase && (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedBase.name}</h2>
                      <p className="text-gray-600">
                        {selectedBase.state} • Median Rent: ${selectedBase.medianRent.toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={closeSheet}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="homes" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Homes
                      </TabsTrigger>
                      <TabsTrigger value="resources" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Resources
                      </TabsTrigger>
                      <TabsTrigger value="deals" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Deals
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto">
                      <TabsContent value="homes" className="space-y-4">
                        {baseData.homes.map((home) => (
                          <div key={home.id} className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="font-semibold text-gray-900">{home.title}</h3>
                            <p className="text-lg font-bold text-green-600">{home.price}</p>
                            <p className="text-gray-600">
                              {home.beds} beds • {home.baths} baths
                            </p>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="resources" className="space-y-4">
                        {baseData.resources.map((resource) => (
                          <div key={resource.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {resource.category}
                              </span>
                            </div>
                            <p className="text-gray-600">{resource.description}</p>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="deals" className="space-y-4">
                        {baseData.deals.map((deal) => (
                          <div key={deal.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                {deal.discount}
                              </span>
                            </div>
                            <p className="text-gray-600">{deal.category}</p>
                          </div>
                        ))}
                      </TabsContent>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => router.push(`/base/${selectedBase.id}`)}
                        className="w-full bg-[#003366] hover:bg-[#002244]"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View Base Page
                      </Button>
                    </div>
                  </Tabs>
                </>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
