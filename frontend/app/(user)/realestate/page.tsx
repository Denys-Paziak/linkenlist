"use client";

import { useState, useEffect, useMemo } from "react";
import { ListingModal } from "@/components/listing-modal";
import { SearchAndFilters } from "@/components/search-and-filters";
import { PropertyCard } from "@/components/property-card";
import { Map } from "lucide-react";
import { useUrlState } from "@/hooks/use-url-state";

// Mock data for military housing listings
const mockListings = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=300&text=House+Front",
    images: [
      "/placeholder.svg?height=200&width=300&text=House+Front",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Master+Bedroom",
      "/placeholder.svg?height=200&width=300&text=Backyard",
    ],
    rentPrice: "$2,800/mo",
    salePrice: "$650,000",
    beds: 4,
    baths: 3,
    sqft: "2,400",
    address: "1234 Marine Dr, Oceanside, CA 92057",
    description: "Near Camp Pendleton",
    lotSize: "0.25 acres",
    hoa: "$150/mo",
    tags: ["Community Pool", "Walkable", "VA Loan Ready", "Marine Corps"],
    badges: ["3D Walkthrough"],
    type: "sale",
    status: "active",
    postedBy: "Real Estate Agent",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=300&text=Apartment+Front",
    images: [
      "/placeholder.svg?height=200&width=300&text=Apartment+Front",
      "/placeholder.svg?height=200&width=300&text=Living+Area",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
      "/placeholder.svg?height=200&width=300&text=Bathroom",
    ],
    rentPrice: "$1,900/mo",
    beds: 2,
    baths: 2,
    sqft: "1,200",
    address: "5678 Desert View Apt 204, El Paso, TX 79912",
    description: "Near Fort Bliss",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["Pet Friendly", "New Listing", "Parking", "Army"],
    badges: ["Coming Soon"],
    type: "rent",
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=300&text=House+Exterior",
    images: [
      "/placeholder.svg?height=200&width=300&text=House+Exterior",
      "/placeholder.svg?height=200&width=300&text=Front+Door",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen+Dining",
      "/placeholder.svg?height=200&width=300&text=Pool+Area",
    ],
    rentPrice: "$2,200/mo",
    salePrice: "$485,000",
    beds: 3,
    baths: 2,
    sqft: "1,800",
    address: "9012 Liberty Lane, Norfolk, VA 23502",
    description: "Near Naval Station Norfolk",
    lotSize: "0.15 acres",
    hoa: "$75/mo",
    tags: ["Walkable", "Community Pool", "VA Loan Ready", "Navy"],
    badges: ["Open Sat"],
    type: "sale",
    status: "inactive",
    postedBy: "Sample LLC",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Townhouse+Front",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
    ],
    rentPrice: "$2,400/mo",
    beds: 3,
    baths: 2.5,
    sqft: "1,600",
    address: "3456 Base Housing Blvd, Colorado Springs, CO 80906",
    description: "Near Peterson Space Force Base",
    lotSize: "N/A",
    hoa: "$200/mo",
    tags: ["Pet Friendly", "Garage", "Mountain View", "Space Force"],
    badges: [],
    type: "rent",
    status: "active",
    postedBy: "Real Estate Agent",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Large+House",
      "/placeholder.svg?height=200&width=300&text=Grand+Living",
      "/placeholder.svg?height=200&width=300&text=Master+Suite",
      "/placeholder.svg?height=200&width=300&text=Backyard",
      "/placeholder.svg?height=200&width=300&text=Garage",
    ],
    salePrice: "$725,000",
    beds: 5,
    baths: 4,
    sqft: "3,200",
    address: "7890 Officers Row, Fort Bragg, NC 28310",
    description: "Near Fort Liberty (Fort Bragg)",
    lotSize: "0.5 acres",
    hoa: "$0/mo",
    tags: ["Large Lot", "VA Loan Ready", "Car-dependent", "Army"],
    badges: ["3D Walkthrough"],
    type: "sale",
    status: "inactive",
    postedBy: "Owner",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Apartment+Building",
      "/placeholder.svg?height=200&width=300&text=Living+Space",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
    ],
    rentPrice: "$1,650/mo",
    beds: 2,
    baths: 1,
    sqft: "950",
    address: "2468 Airman Circle, San Antonio, TX 78236",
    description: "Near Joint Base San Antonio",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["New Listing", "Pet Friendly", "Walkable", "Air Force"],
    badges: ["Coming Soon"],
    type: "rent",
    status: "active",
    postedBy: "Sample LLC",
  },
  {
    id: 7,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Ocean+View+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Master+Bedroom",
      "/placeholder.svg?height=200&width=300&text=Ocean+View",
    ],
    rentPrice: "$3,800/mo",
    salePrice: "$890,000",
    beds: 4,
    baths: 3.5,
    sqft: "2,800",
    address: "1122 Navy Pier Dr, San Diego, CA 92101",
    description: "Near Naval Base San Diego",
    lotSize: "0.18 acres",
    hoa: "$250/mo",
    tags: ["Ocean View", "VA Loan Ready", "Walkable", "Navy"],
    badges: ["3D Walkthrough", "Open Sat"],
    type: "sale",
    status: "active",
    postedBy: "Real Estate Agent",
  },
  {
    id: 8,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=House+Front",
      "/placeholder.svg?height=200&width=300&text=Living+Area",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Garage",
    ],
    rentPrice: "$2,100/mo",
    beds: 3,
    baths: 2,
    sqft: "1,400",
    address: "4567 Air Force Way, Dayton, OH 45433",
    description: "Near Wright-Patterson AFB",
    lotSize: "N/A",
    hoa: "$100/mo",
    tags: ["Pet Friendly", "Garage", "New Listing", "Air Force"],
    badges: [],
    type: "rent",
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 9,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=House+Exterior",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Backyard",
    ],
    rentPrice: "$425,000",
    beds: 3,
    baths: 2,
    sqft: "1,650",
    address: "8901 Army Base Rd, Fort Hood, TX 76544",
    description: "Near Fort Cavazos (Fort Hood)",
    lotSize: "0.22 acres",
    hoa: "$50/mo",
    tags: ["Large Lot", "VA Loan Ready", "Car-dependent", "Army"],
    badges: ["Coming Soon"],
    type: "sale",
    status: "active",
    postedBy: "Sample LLC",
  },
  {
    id: 10,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Waterfront+Apt",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
      "/placeholder.svg?height=200&width=300&text=Water+View",
    ],
    rentPrice: "$1,800/mo",
    beds: 2,
    baths: 1.5,
    sqft: "1,100",
    address: "2345 Coast Guard Ave, Miami, FL 33101",
    description: "Near Coast Guard Base Miami",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["Waterfront", "Pet Friendly", "Walkable", "Coast Guard"],
    badges: ["3D Walkthrough"],
    type: "rent",
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 11,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Family+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Pool+Area",
    ],
    rentPrice: "$2,600/mo",
    salePrice: "$575,000",
    beds: 4,
    baths: 2.5,
    sqft: "2,200",
    address: "6789 Marine Corps Dr, Quantico, VA 22134",
    description: "Near Marine Corps Base Quantico",
    lotSize: "0.3 acres",
    hoa: "$125/mo",
    tags: ["Community Pool", "VA Loan Ready", "Walkable", "Marine Corps"],
    badges: ["Open Sat"],
    type: "sale",
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 12,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Pentagon+Area",
      "/placeholder.svg?height=200&width=300&text=Living+Space",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
    ],
    rentPrice: "$2,800/mo",
    beds: 4,
    baths: 3,
    sqft: "2,000",
    address: "3456 Pentagon Blvd, Arlington, VA 22202",
    description: "Near Pentagon/Joint Base Myer",
    lotSize: "N/A",
    hoa: "$300/mo",
    tags: ["Metro Access", "Pet Friendly", "Walkable", "Army"],
    badges: ["New Listing"],
    type: "rent",
    status: "active",
    postedBy: "Sample LLC",
  },
  {
    id: 13,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Base+Housing",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Garage",
    ],
    rentPrice: "$550,000",
    beds: 3,
    baths: 2,
    sqft: "1,900",
    address: "1111 Base St, Fort Campbell, KY 42223",
    description: "Near Fort Campbell",
    lotSize: "0.2 acres",
    hoa: "$100/mo",
    tags: ["VA Loan Ready", "Garage", "Army"],
    badges: ["New Listing"],
    type: "sale",
    status: "active",
    postedBy: "Real Estate Agent",
  },
  {
    id: 14,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Naval+Housing",
      "/placeholder.svg?height=200&width=300&text=Living+Area",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
    ],
    rentPrice: "$1,750/mo",
    beds: 2,
    baths: 1.5,
    sqft: "1,050",
    address: "2222 Military Ave, Pensacola, FL 32508",
    description: "Near NAS Pensacola",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["Pet Friendly", "Walkable", "Navy"],
    badges: ["Coming Soon"],
    type: "rent",
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 15,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Air+Force+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Pool",
    ],
    salePrice: "$675,000",
    beds: 4,
    baths: 3,
    sqft: "2,500",
    address: "3333 Officer Ln, MacDill AFB, FL 33621",
    description: "Near MacDill Air Force Base",
    lotSize: "0.3 acres",
    hoa: "$175/mo",
    tags: ["Community Pool", "VA Loan Ready", "Air Force"],
    badges: ["3D Walkthrough"],
    type: "sale",
    status: "active",
    postedBy: "Sample LLC",
  },
  {
    id: 16,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Norfolk+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Garage",
    ],
    rentPrice: "$1,950/mo",
    beds: 3,
    baths: 2,
    sqft: "1,350",
    address: "4444 Navy Way, Norfolk, VA 23511",
    description: "Near Naval Station Norfolk",
    lotSize: "N/A",
    hoa: "$125/mo",
    tags: ["Pet Friendly", "Garage", "Navy"],
    badges: [],
    type: "rent",
    status: "active",
    postedBy: "Real Estate Agent",
  },
  {
    id: 17,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Mountain+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Mountain+View",
      "/placeholder.svg?height=200&width=300&text=Backyard",
    ],
    salePrice: "$780,000",
    beds: 5,
    baths: 3.5,
    sqft: "3,100",
    address: "5555 Air Force Blvd, Colorado Springs, CO 80840",
    description: "Near Peterson Space Force Base",
    lotSize: "0.4 acres",
    hoa: "$200/mo",
    tags: ["Large Lot", "Mountain View", "Space Force"],
    badges: ["3D Walkthrough"],
    type: "sale",
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 18,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Marine+Housing",
      "/placeholder.svg?height=200&width=300&text=Living+Area",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
    ],
    rentPrice: "$2,200/mo",
    beds: 3,
    baths: 2.5,
    sqft: "1,600",
    address: "6666 Marine Dr, Camp Lejeune, NC 28547",
    description: "Near Marine Corps Base Camp Lejeune",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["New Listing", "Walkable", "Marine Corps"],
    badges: ["Coming Soon"],
    type: "rent",
    status: "active",
    postedBy: "Sample LLC",
  },
  {
    id: 19,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Army+Base+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Pool+Area",
    ],
    salePrice: "$620,000",
    beds: 3,
    baths: 2,
    sqft: "1,750",
    address: "7777 Army Ave, Fort Benning, GA 31905",
    description: "Near Fort Moore (Fort Benning)",
    lotSize: "0.25 acres",
    hoa: "$150/mo",
    tags: ["Community Pool", "VA Loan Ready", "Army"],
    badges: ["Open Sat"],
    type: "sale",
    status: "active",
    postedBy: "Real Estate Agent",
  },
  {
    id: 20,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Coast+Guard+Apt",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
      "/placeholder.svg?height=200&width=300&text=Water+View",
    ],
    rentPrice: "$1,850/mo",
    beds: 2,
    baths: 2,
    sqft: "1,150",
    address: "8888 Coast Guard St, Miami, FL 33130",
    description: "Near Coast Guard Base Miami",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["Waterfront", "Pet Friendly", "Coast Guard"],
    badges: ["3D Walkthrough"],
    type: "rent",
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 21,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Fort+Riley+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
    ],
    rentPrice: "$495,000",
    beds: 3,
    baths: 2,
    sqft: "1,750",
    address: "9999 Base Rd, Fort Riley, KS 66442",
    description: "Near Fort Riley",
    lotSize: "0.2 acres",
    hoa: "$75/mo",
    tags: ["VA Loan Ready", "Car-dependent", "Army"],
    badges: ["New Listing"],
    type: "rent",
    status: "active",
    postedBy: "Sample LLC",
  },
  {
    id: 22,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Carson+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Mountain+View",
    ],
    rentPrice: "$2,300/mo",
    beds: 4,
    baths: 3,
    sqft: "1,800",
    address: "1010 Military Rd, Fort Carson, CO 80913",
    description: "Near Fort Carson",
    lotSize: "N/A",
    hoa: "$180/mo",
    tags: ["Mountain View", "Pet Friendly", "Army"],
    badges: [],
    type: "rent",
    status: "active",
    postedBy: "Real Estate Agent",
  },
  {
    id: 23,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Large+Estate",
      "/placeholder.svg?height=200&width=300&text=Grand+Living",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Master+Suite",
      "/placeholder.svg?height=200&width=300&text=Backyard",
    ],
    salePrice: "$850,000",
    beds: 5,
    baths: 4,
    sqft: "3,400",
    address: "1111 Officer Way, Joint Base Lewis-McChord, WA 98433",
    description: "Near Joint Base Lewis-McChord",
    lotSize: "0.5 acres",
    hoa: "$220/mo",
    tags: ["Large Lot", "VA Loan Ready", "Army"],
    badges: ["3D Walkthrough"],
    type: "sale",
    status: "active",
    postedBy: "Owner",
  },
  {
    id: 24,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Lackland+Apt",
      "/placeholder.svg?height=200&width=300&text=Living+Area",
      "/placeholder.svg?height=200&width=300&text=Bedroom",
    ],
    rentPrice: "$1,700/mo",
    beds: 2,
    baths: 1.5,
    sqft: "1,050",
    address: "1212 Airman St, Lackland AFB, TX 78236",
    description: "Near Joint Base San Antonio-Lackland",
    lotSize: "N/A",
    hoa: "Included",
    tags: ["New Listing", "Walkable", "Air Force"],
    badges: ["Coming Soon"],
    type: "rent",
    status: "active",
    postedBy: "Sample LLC",
  },
  {
    id: 25,
    image: "/placeholder.svg?height=200&width=300",
    images: [
      "/placeholder.svg?height=200&width=300&text=Great+Lakes+Home",
      "/placeholder.svg?height=200&width=300&text=Living+Room",
      "/placeholder.svg?height=200&width=300&text=Kitchen",
      "/placeholder.svg?height=200&width=300&text=Pool",
    ],
    salePrice: "$590,000",
    beds: 3,
    baths: 2.5,
    sqft: "2,100",
    address: "1313 Navy Blvd, Great Lakes, IL 60088",
    description: "Near Naval Station Great Lakes",
    lotSize: "0.18 acres",
    hoa: "$140/mo",
    tags: ["Community Pool", "VA Loan Ready", "Navy"],
    badges: ["Open Sat"],
    type: "sale",
    status: "active",
    postedBy: "Real Estate Agent",
  },
];

export default function RealEstatePage() {
  const { getParam, setParam, removeParam } = useUrlState();
  const [viewMode, setViewMode] = useState<"grid" | "map">(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "grid" : "map";
    }
    return "grid";
  });
  const [bookmarkedListings, setBookmarkedListings] = useState<number[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const selectedListingId = getParam("listing");
  const selectedListing = useMemo(() => {
    if (!selectedListingId) return null;
    return (
      mockListings.find(
        (listing) => listing.id.toString() === selectedListingId
      ) || null
    );
  }, [selectedListingId]);

  const openPropertyDetails = (listing: any) => {
    setParam("listing", listing.id.toString()); // Use push for opening modal
  };

  const closePropertyDetails = () => {
    removeParam("listing"); // This will trigger back button behavior
  };

  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      const searchQuery = filters.q || "";
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        listing.address.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      let matchesListingTypeFilter = true;
      if (filters.type === "sale") {
        matchesListingTypeFilter =
          listing.type === "sale" && listing.status === "active";
      } else if (filters.type === "rent") {
        matchesListingTypeFilter =
          listing.type === "rent" && listing.status === "active";
      } else if (filters.type === "inactive") {
        matchesListingTypeFilter = listing.status === "inactive";
      }

      let matchesFilters = true;
      if (filters.price_min || filters.price_max) {
        const price = Number.parseInt(
          listing.rentPrice || listing.salePrice.replace(/[$,]/g, "")
        );
        if (filters.price_min) {
          matchesFilters =
            matchesFilters && price >= Number.parseInt(filters.price_min);
        }
        if (filters.price_max) {
          matchesFilters =
            matchesFilters && price <= Number.parseInt(filters.price_max);
        }
      }
      if (filters.beds && filters.beds !== "any") {
        matchesFilters =
          matchesFilters && listing.beds >= Number.parseInt(filters.beds);
      }
      if (filters.baths && filters.baths !== "any") {
        matchesFilters =
          matchesFilters && listing.baths >= Number.parseInt(filters.baths);
      }

      return matchesSearch && matchesListingTypeFilter && matchesFilters;
    });
  }, [filters, bookmarkedListings]);

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, endIndex);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedListings((prev) =>
      prev.includes(id)
        ? prev.filter((listingId) => listingId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "grid" : "map");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Search and Filters Component */}
      <SearchAndFilters
        onFiltersChange={handleFiltersChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        mapPropertyCount={filteredListings.length}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {viewMode === "map" ? (
          <div className="flex h-full">
            {/* Left side - Map */}
            <div className="flex-1 bg-gray-200 relative">
              <div
                className="sticky bg-gray-200 md:rounded-lg flex items-center justify-center shadow-sm overflow-hidden"
                style={{
                  top: "64px",
                  height: "calc(100vh - 64px)",
                  overflow: "hidden",
                  pointerEvents: "none",
                  userSelect: "none",
                  touchAction: "none",
                }}
              >
                <div className="text-center text-gray-500 p-4 max-w-full">
                  <Map className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-gray-400" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1">
                    Interactive Map Coming Soon
                  </h3>
                  <p className="text-xs sm:text-sm mb-2 md:mb-4">
                    Map integration in development
                  </p>
                  <div className="relative w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] mx-auto aspect-[4/3] bg-gray-100 rounded">
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="Map Placeholder"
                      className="w-full h-full object-cover rounded"
                      style={{ pointerEvents: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Property Cards (Desktop only) */}
            <div className="hidden md:flex flex-col bg-white border-l border-gray-200 w-[700px] min-h-screen">
              <div className="flex-1 overflow-y-auto">
                <div className="list-inner-map p-4 my-1.5">
                  {paginatedListings.map((listing) => (
                    <PropertyCard
                      key={listing.id}
                      listing={listing}
                      onDetailsClick={() => openPropertyDetails(listing)}
                      isBookmarked={bookmarkedListings.includes(listing.id)}
                      onBookmarkToggle={() => toggleBookmark(listing.id)}
                      showStatusBadges="inactive-only"
                    />
                  ))}

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 pb-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  currentPage === pageNum
                                    ? "bg-[#002244] text-white"
                                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 pt-4">
            <div className="grid-container-realestate">
              {paginatedListings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  onDetailsClick={() => openPropertyDetails(listing)}
                  isBookmarked={bookmarkedListings.includes(listing.id)}
                  onBookmarkToggle={() => toggleBookmark(listing.id)}
                  showStatusBadges="inactive-only"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Listing Modal - controlled by URL state */}
      <ListingModal
        listing={selectedListing}
        isOpen={!!selectedListing}
        onClose={closePropertyDetails}
      />
    </div>
  );
}
