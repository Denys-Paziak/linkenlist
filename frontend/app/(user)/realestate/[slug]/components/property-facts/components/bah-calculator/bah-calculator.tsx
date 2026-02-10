"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../../../../../components/ui/button-submit";
import { fetcherUser } from "../../../../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../../../../components/ui/error-alert";
import { AutocompleteSearch } from "./autocomplete-search";

const paygrades = [
  {
    category: "Enlisted",
    options: ["E-1", "E-2", "E-3", "E-4", "E-5", "E-6", "E-7", "E-8", "E-9"],
  },
  {
    category: "Warrant Officer",
    options: ["W-1", "W-2", "W-3", "W-4", "W-5"],
  },
  { category: "Officer (Prior Enlisted)", options: ["O-1E", "O-2E", "O-3E"] },
  {
    category: "Officer",
    options: [
      "O-1",
      "O-2",
      "O-3",
      "O-4",
      "O-5",
      "O-6",
      "O-7",
      "O-8",
      "O-9",
      "O-10",
    ],
  },
];

export function BAHCalculator() {
  const [selectedPaygrade, setSelectedPaygrade] = useState("E-1");
  const [dutyStation, setDutyStation] = useState("");
  const [calculatedBAH, setCalculatedBAH] = useState<{
    withDependents: number;
    withoutDependents: number;
    MHACode: string;
    search: string;
    paygrade: string;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [formWarn, setFormWarn] = useState<string | null>(null);

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

  const calculateBAH = async () => {
    setFormError(null);
    setFormWarn(null);
    setCalculatedBAH(null);
    setStatus("loading");

    try {
      const data = await fetcherUser(
        `/listings/bah-rates?search=${dutyStation}&paygrade=${selectedPaygrade}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (data.results.length === 0) {
        setStatus("error");
        setFormWarn("No BAH rates found for the provided location.");
      }
      if (data.results.length > 2) {
        setStatus("idle");
        setFormWarn(
          "We found more than one result. Please enter a more specific address for accurate results.",
        );
      } else {
        setStatus("success");
        setCalculatedBAH({
          withDependents: data.results[0].monthlyAmount,
          withoutDependents: data.results[1].monthlyAmount,
          MHACode: data.results[0].mhaCode,
          search: data.search,
          paygrade: data.paygrade,
        });
      }
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
              <AutocompleteSearch onPlace={(zip) => {
                setDutyStation(zip)
              }} />
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
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm whitespace-nowrap ${selectedPaygrade === option
                              ? "bg-primary/10 text-primary"
                              : ""
                              } ${group.options[group.options.length - 1] ===
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
              <ButtonSubmit
                type="button"
                onClick={calculateBAH}
                status={status}
                statusText={{
                  loading: "Calculating...",
                  success: "Calculated",
                  error: "Try again",
                  disabled: "Disabled",
                }}
                className="px-4 py-2 bg-[#002244] text-white font-semibold rounded-lg hover:bg-[#003366] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                disabled={!dutyStation || !selectedPaygrade}
              >
                Calculate
              </ButtonSubmit>
            </div>
          </div>

          {calculatedBAH && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="space-y-3">
                <div className="text-center border-b border-gray-200 pb-3 flex items-center justify-center gap-10">
                  <div>
                    <p className="text-gray-700 font-medium text-sm">
                      BAH Rates for
                    </p>
                    <p className="text-lg font-bold text-[#002244]">
                      {calculatedBAH.paygrade} - {calculatedBAH.search}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">
                      MHA Code
                    </p>
                    <p className="text-lg font-bold text-[#002244]">
                      {calculatedBAH.MHACode}
                    </p>
                  </div>
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
          {formWarn && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="space-y-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-[#002244]">{formWarn}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
