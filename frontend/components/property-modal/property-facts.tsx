"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Calculator, ChevronDown } from "lucide-react"
import { MortgageCalculator } from "./mortgage-calculator"

interface PropertyFactsProps {
  listing: any
}

export function PropertyFacts({ listing }: PropertyFactsProps) {
  const [showAllFacts, setShowAllFacts] = useState(false)
  const [expandedMortgage, setExpandedMortgage] = useState(false)
  const [expandedBAH, setExpandedBAH] = useState(false)
  const [selectedPaygrade, setSelectedPaygrade] = useState("E-1")
  const [dutyStation, setDutyStation] = useState("")
  const [calculatedBAH, setCalculatedBAH] = useState<{ withDependents: number; withoutDependents: number } | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const calculateBAH = () => {
    const mockRates: { [key: string]: { withDependents: number; withoutDependents: number } } = {
      "E-1": { withDependents: 1200, withoutDependents: 1000 },
      "E-2": { withDependents: 1300, withoutDependents: 1100 },
      "E-3": { withDependents: 1400, withoutDependents: 1200 },
      "E-4": { withDependents: 1500, withoutDependents: 1300 },
      "E-5": { withDependents: 1600, withoutDependents: 1400 },
      "E-6": { withDependents: 1700, withoutDependents: 1500 },
      "E-7": { withDependents: 1800, withoutDependents: 1600 },
      "E-8": { withDependents: 1900, withoutDependents: 1700 },
      "E-9": { withDependents: 2000, withoutDependents: 1800 },
      "O-1": { withDependents: 1800, withoutDependents: 1600 },
      "O-1E": { withDependents: 1900, withoutDependents: 1700 },
      "O-2": { withDependents: 2000, withoutDependents: 1800 },
      "O-2E": { withDependents: 2100, withoutDependents: 1900 },
      "O-3": { withDependents: 2200, withoutDependents: 2000 },
      "O-3E": { withDependents: 2300, withoutDependents: 2100 },
      "O-4": { withDependents: 2400, withoutDependents: 2200 },
      "O-5": { withDependents: 2600, withoutDependents: 2400 },
      "O-6": { withDependents: 2800, withoutDependents: 2600 },
    }

    if (dutyStation && selectedPaygrade) {
      setCalculatedBAH(mockRates[selectedPaygrade] || { withDependents: 1500, withoutDependents: 1300 })
    }
  }

  const paygrades = [
    { category: "Enlisted", options: ["E-1", "E-2", "E-3", "E-4", "E-5", "E-6", "E-7", "E-8", "E-9"] },
    { category: "Officer", options: ["O-1", "O-2", "O-3", "O-4", "O-5", "O-6"] },
    { category: "Officer (Prior Enlisted)", options: ["O-1E", "O-2E", "O-3E"] },
  ]

  const factCategories = [
    {
      title: "Property Details",
      facts: [
        { label: "Property Type", value: "Single Family Residence" },
        { label: "Year Built", value: "2018" },
        { label: "Lot Size", value: "0.25 acres" },
      ],
    },
    {
      title: "Interior Features",
      facts: [
        { label: "Flooring", value: "Hardwood, Tile" },
        { label: "Appliances", value: "Dishwasher, Refrigerator, Washer/Dryer" },
        { label: "Heating", value: "Central Air" },
        { label: "Cooling", value: "Central Air" },
      ],
    },
    {
      title: "Additional Information",
      facts: [
        { label: "Parking", value: "2-car garage" },
        { label: "HOA Fee", value: "None" },
        { label: "Property Tax", value: "$3,200/year" },
        { label: "School District", value: "Excellent Schools" },
        { label: "Neighborhood", value: "Family-friendly" },
      ],
    },
  ]

  const visibleCategories = showAllFacts ? factCategories : factCategories.slice(0, 2)

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm px-2.5 py-3.5">
      <h2 className="text-xl font-bold text-gray-900 mb-6 border-b-2 border-blue-900 pb-2">Property Facts</h2>

      <div className="relative">
        <div className="space-y-8">
          {visibleCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                {category.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.facts.map((fact, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                  >
                    <span className="text-gray-700 font-medium text-sm">{fact.label}:</span>
                    <span className="text-gray-900 font-semibold text-sm text-right">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!showAllFacts && factCategories.length > 2 && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
        )}
      </div>

      {factCategories.length > 2 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAllFacts(!showAllFacts)}
            className="inline-flex items-center gap-2 text-[#002244] hover:text-gray-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            {showAllFacts ? "Show Less" : "Show More"}
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAllFacts ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}

      {listing.type === "sale" && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Card>
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 p-4"
              onClick={() => setExpandedMortgage(!expandedMortgage)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-gray-600" />
                  <h3 className="font-bold text-gray-900">Mortgage Calculator</h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 transition-transform ${expandedMortgage ? "rotate-180" : ""}`}
                />
              </div>
            </CardHeader>
            {expandedMortgage && (
              <CardContent className="p-4">
                <div className="bg-white rounded-lg p-4">
                  <MortgageCalculator listing={listing} />
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-bold text-[#002244] mb-4">Calculate Your BAH:</h3>

          <div className="space-y-4">
            <div className="flex gap-3 items-end">
              <div className="flex-[2]">
                <label className="block text-gray-700 font-medium mb-1 text-sm">Duty Station ZIP Code or City:</label>
                <input
                  type="text"
                  placeholder="Biloxi, MS"
                  value={dutyStation}
                  onChange={(e) => setDutyStation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-[#002244] font-semibold text-sm"
                />
              </div>

              <div className="flex-1" ref={dropdownRef}>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Paygrade:</label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-w-[120px] w-full"
                  >
                    <span>{selectedPaygrade}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto left-0">
                      {paygrades.map((group, groupIndex) => (
                        <div key={groupIndex}>
                          {groupIndex > 0 && <div className="border-t border-gray-200" />}
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 first:rounded-t-lg">
                            {group.category}
                          </div>
                          {group.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedPaygrade(option)
                                setIsDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm whitespace-nowrap ${
                                selectedPaygrade === option ? "bg-primary/10 text-primary" : ""
                              } ${group.options[group.options.length - 1] === option && groupIndex === paygrades.length - 1 ? "last:rounded-b-lg" : ""}`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={calculateBAH}
                  disabled={!dutyStation || !selectedPaygrade}
                  className="px-4 py-2 bg-[#002244] text-white font-semibold rounded-lg hover:bg-[#003366] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Calculate
                </button>
              </div>
            </div>

            {calculatedBAH && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="space-y-3">
                  <div className="text-center border-b border-gray-200 pb-3">
                    <p className="text-gray-700 font-medium text-sm">BAH Rates for</p>
                    <p className="text-lg font-bold text-[#002244]">
                      {selectedPaygrade} - {dutyStation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm font-medium mb-1">With Dependents</p>
                      <p className="text-xl font-bold text-[#002244]">
                        ${calculatedBAH.withDependents.toLocaleString()}/month
                      </p>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm font-medium mb-1">Without Dependents</p>
                      <p className="text-xl font-bold text-[#002244]">
                        ${calculatedBAH.withoutDependents.toLocaleString()}/month
                      </p>
                    </div>
                  </div>

                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Nearby Military Bases</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Camp Pendleton</p>
            <span className="text-[#002244] font-semibold">12 miles</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Naval Base San Diego</p>
            <span className="text-[#002244] font-semibold">35 miles</span>
          </div>
        </div>
      </div>
    </div>
  )
}
