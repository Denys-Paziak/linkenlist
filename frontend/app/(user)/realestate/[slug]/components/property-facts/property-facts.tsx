"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MortgageCalculator } from "./components/mortgage-calculator/mortgage-calculator";
import { BAHCalculator } from "./components/bah-calculator";
import { IRealestate } from "../../../../../../types/Realestate";
import { formatDurationFromMonths } from "../../../../../../lib/utils";

export function PropertyFacts({ listing }: { listing: IRealestate }) {
  const [showAllFacts, setShowAllFacts] = useState(false);

  const factCategories = [
    {
      title: "Pricing",
      facts: [
        {
          label: "List Price",
          value: listing.listPrice
            ? "$" + listing.listPrice.toLocaleString("en-US")
            : "",
        },
        {
          label: "Monthly Rent",
          value: listing.monthlyRent
            ? "$" + listing.monthlyRent.toLocaleString("en-US")
            : "",
        },
        {
          label: "Security Deposit",
          value: listing.securityDeposit
            ? "$" + listing.securityDeposit.toLocaleString("en-US")
            : "",
        },
        {
          label: "Lease Term",
          value:
            listing.leaseTerm === "month-to-month"
              ? "Month to Month"
              : formatDurationFromMonths(Number(listing.leaseTerm)),
        },
        {
          label: "Application Fee",
          value: listing.applicationFee
            ? "$" + listing.applicationFee.toLocaleString("en-US")
            : "",
        },
        {
          label: "Date Available",
          value: listing.dateAvailable,
        },
      ],
    },
    {
      title: "Property Details",
      facts: [
        { label: "Property Type", value: listing.propertyType },
        { label: "Bedrooms", value: listing.bedrooms },
        { label: "Full Baths", value: listing.bathroomsFull },
        { label: "Half Baths", value: listing.bathroomsHalf },
        { label: "Year Built", value: listing.yearBuilt },
        {
          label: "Interior Size",
          value: listing.interiorSize.toLocaleString("en-US") + " sq ft",
        },
        { label: "Stories / Levels", value: listing.stories },
        { label: "Architectural Style", value: listing.architecturalStyle },
        {
          label: "HOA Fee",
          value:
            listing.hoaPresent && listing.hoaFee
              ? "$" + listing.hoaFee.toLocaleString("en-US")
              : "",
        },
        {
          label: "HOA Frequency",
          value: listing.hoaPresent && listing.hoaFrequency,
        },
        {
          label: "Services Included",
          value:
            listing.hoaPresent &&
            listing.servicesIncluded
              ?.join(", ")
              .replace("OTHER:::", "")
              .replace("Other, ", ""),
        },
        {
          label: "Pet Policy",
          value: listing.petPolicy?.join(", "),
        },
      ],
    },
    {
      title: "Amenities",
      facts: [
        { label: "Community Name", value: listing.subdivisionName },
        {
          label: "Community Features",
          value: listing.communityFeatures
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
      ],
    },
    {
      title: "Outdoor Features",
      facts: [
        {
          label: "Outdoor Spaces",
          value: listing.outdoorSpaces
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Parking Type",
          value: listing.parkingType
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Fencing",
          value: listing.fencing
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Lot Features",
          value: listing.lotFeatures
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "View",
          value: listing.view
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        { label: "Pool Type", value: listing.poolType },
        { label: "Garage Spaces", value: listing.garageSpaces },
        { label: "Driveway Spaces", value: listing.drivewaySpaces },
        { label: "Lot Size", value: listing.lotSize },
      ],
    },
    {
      title: "Indoor Features",
      facts: [
        {
          label: "Flooring",
          value: listing.flooring
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Appliances",
          value: listing.appliances
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Heating",
          value: listing.heating
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Laundry Features",
          value: listing.laundryFeatures
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Cooling",
          value: listing.cooling
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
      ],
    },
    {
      title: "Construction & Legal Records",
      facts: [
        {
          label: "Construction",
          value: listing.construction
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "New Construction",
          value: listing.newConstruction ? "Yes" : "",
        },
        {
          label: "Builder Name",
          value: listing.builder,
        },
        {
          label: "Zoning",
          value: listing.zoning,
        },
        {
          label: "Parcel/APN",
          value: listing.parcelApn,
        },
        {
          label: "Ownership Type",
          value: listing.ownershipType,
        },
        {
          label: "Listing Agreement",
          value: listing.listingAgreement,
        },
        {
          label: "Date On Market",
          value: listing.dateOnMarket,
        },
      ],
    },
    {
      title: "Utilities, Energy & Connectivity",
      facts: [
        {
          label: "Water",
          value: listing.water,
        },
        {
          label: "Sewer",
          value: listing.sewer,
        },
        {
          label: "Utilities Available",
          value: listing.utilitiesAvailable
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Energy & Green Features",
          value: listing.energyFeatures
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Download Speed (Mbps)",
          value: listing.downloadSpeed,
        },
        {
          label: "Cellular Notes",
          value: listing.cellularNotes,
        },
        {
          label: "Internet Options",
          value: listing.internetOptions
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
        {
          label: "Smart Devices",
          value: listing.smartDevices
            ?.join(", ")
            .replace("OTHER:::", "")
            .replace("Other, ", ""),
        },
      ],
    },
  ];

  const visibleCategories = showAllFacts
    ? factCategories
    : factCategories.slice(0, 2);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm px-2.5 py-3.5">
      <h2 className="text-xl font-bold text-gray-900 mb-6 border-b-2 border-blue-900 pb-2">
        Property Facts
      </h2>

      <div className="relative">
        <div className="space-y-8">
          {visibleCategories.map((category, categoryIndex) => {
            const atLeastOne = category.facts.some((item) => item.value);

            if (!atLeastOne) return null;

            return (
              <div
                key={categoryIndex}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 py-2"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.facts.map((fact, index) => {
                    if (!fact.value) {
                      return null;
                    }

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                      >
                        <span className="text-gray-700 font-medium text-sm">
                          {fact.label}:
                        </span>
                        <span className="text-gray-900 font-semibold text-sm text-right">
                          {fact.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showAllFacts ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}

      {listing.forSale && <MortgageCalculator listing={listing} />}

      <BAHCalculator />
    </div>
  );
}
