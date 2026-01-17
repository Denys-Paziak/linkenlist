"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function BAHCalculator() {
  const [expandedBAH, setExpandedBAH] = useState(false);
  const [selectedPaygrade, setSelectedPaygrade] = useState("E-1");
  const [dutyStation, setDutyStation] = useState("");
  const [calculatedBAH, setCalculatedBAH] = useState<{
    withDependents: number;
    withoutDependents: number;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const calculateBAH = () => {
    const mockRates: {
      [key: string]: { withDependents: number; withoutDependents: number };
    } = {
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
    };

    if (dutyStation && selectedPaygrade) {
      setCalculatedBAH(
        mockRates[selectedPaygrade] || {
          withDependents: 1500,
          withoutDependents: 1300,
        }
      );
    }
  };

  const paygrades = [
    {
      category: "Enlisted",
      options: ["E-1", "E-2", "E-3", "E-4", "E-5", "E-6", "E-7", "E-8", "E-9"],
    },
    {
      category: "Officer",
      options: ["O-1", "O-2", "O-3", "O-4", "O-5", "O-6"],
    },
    { category: "Officer (Prior Enlisted)", options: ["O-1E", "O-2E", "O-3E"] },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-bold text-[#002244] mb-4">
          Calculate Your BAH:
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-[2]">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Duty Station ZIP Code or City:
              </label>
              <input
                type="text"
                placeholder="Biloxi, MS"
                value={dutyStation}
                onChange={(e) => setDutyStation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-[#002244] font-semibold text-sm"
              />
            </div>

            <div className="flex-1" ref={dropdownRef}>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Paygrade:
              </label>
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
                        {groupIndex > 0 && (
                          <div className="border-t border-gray-200" />
                        )}
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 first:rounded-t-lg">
                          {group.category}
                        </div>
                        {group.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSelectedPaygrade(option);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm whitespace-nowrap ${
                              selectedPaygrade === option
                                ? "bg-primary/10 text-primary"
                                : ""
                            } ${
                              group.options[group.options.length - 1] ===
                                option && groupIndex === paygrades.length - 1
                                ? "last:rounded-b-lg"
                                : ""
                            }`}
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
                  <p className="text-gray-700 font-medium text-sm">
                    BAH Rates for
                  </p>
                  <p className="text-lg font-bold text-[#002244]">
                    {selectedPaygrade} - {dutyStation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      With Dependents
                    </p>
                    <p className="text-xl font-bold text-[#002244]">
                      ${calculatedBAH.withDependents.toLocaleString()}/month
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Without Dependents
                    </p>
                    <p className="text-xl font-bold text-[#002244]">
                      ${calculatedBAH.withoutDependents.toLocaleString()}
                      /month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
