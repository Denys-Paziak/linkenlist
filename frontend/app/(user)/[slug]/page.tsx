"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Copy,
  CheckCircle,
  Tag,
  Users,
  Shield,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { ScrollButtons } from "@/components/scroll-buttons";
import { mockResources } from "@/data/mock-resources";
import { useUser } from "@/contexts/user-context";

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

// Find resource by slug
const getResourceBySlug = (slug: string) => {
  return mockResources.find(
    (resource) => generateSlug(resource.title) === slug
  );
};

// Get related resources based on matching tags
const getRelatedResources = (currentResource: any, limit = 4) => {
  if (!currentResource) return [];

  return mockResources
    .filter(
      (resource) =>
        resource.id !== currentResource.id &&
        resource.tags.some((tag) => currentResource.tags.includes(tag))
    )
    .slice(0, limit);
};

interface ResourcePageProps {
  params: {
    slug: string;
  };
}

export default function ResourcePage({ params }: ResourcePageProps) {
  const [copied, setCopied] = useState(false);
  const [clickTracked, setClickTracked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user, toggleFavorite } = useUser();

  const resource = getResourceBySlug(params.slug);
  const relatedResources = resource ? getRelatedResources(resource) : [];

  // Track analytics on external link click
  const handleExternalClick = () => {
    if (!clickTracked && resource) {
      setClickTracked(true);

      // Track with Google Analytics if available
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "external_link_click", {
          resource_title: resource.title,
          resource_url: resource.url,
          resource_category: resource.category || "uncategorized",
        });
      }

      // Custom tracking logic could go here
      console.log("External link clicked:", {
        title: resource.title,
        url: resource.url,
        timestamp: new Date().toISOString(),
      });
    }

    if (resource?.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleFavoriteClick = () => {
    if (resource) {
      toggleFavorite(resource.id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError || !resource?.screenshotImage) {
      return "/placeholder.svg?height=400&width=800&text=Website+Preview";
    }
    return resource.screenshotImage;
  };

  if (!resource) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] relative flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <Globe className="h-16 w-16 text-[#222222]/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#222222] mb-4">
              Resource Not Found
            </h1>
            <p className="text-[#222222]/70 mb-6">
              The resource you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <button className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFavorited = user.favorites.includes(resource.id);

  // Mock login options - in real app, this would come from resource data
  const loginOptions = ["CAC", "ID.me", "DS Logon", "Username/Password"];

  // Mock access requirements
  const accessRequirements = [
    "Active duty military personnel (all branches)",
    "Veterans with valid military ID",
    "Military spouses and dependents with ID",
    "National Guard and Reserve members",
    "Retired military personnel",
  ];

  // Mock how to access steps
  const howToAccess = [
    "Visit the website using the link below",
    "Select your preferred login method (CAC, ID.me, etc.)",
    "Complete authentication with your military credentials",
    "Verify your military status if prompted",
    "Access the full features of the platform",
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4] relative">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Related Resources */}
          <aside className="w-full lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-20 space-y-6">
              {/* Back Button */}
              <div>
                <Link href="/">
                  <button className="w-full flex items-center gap-2 text-[#222222]/70 hover:text-[#222222] transition-colors text-sm font-medium bg-white rounded-lg border border-[#e5e5e5] p-3 shadow-sm hover:shadow-md">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </button>
                </Link>
              </div>

              {/* Table of Contents */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
                <h3 className="font-medium text-gray-800 text-sm mb-3">
                  Contents
                </h3>
                <nav className="space-y-2">
                  <button
                    onClick={() =>
                      document
                        .getElementById("about-deal")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
                    <span className="leading-relaxed break-words">
                      About This Deal
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("eligibility")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
                    <span className="leading-relaxed break-words">
                      Eligibility
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("how-to-redeem")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
                    <span className="leading-relaxed break-words">
                      How to Redeem
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("offer-details")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
                    <span className="leading-relaxed break-words">
                      Offer Details
                    </span>
                  </button>
                </nav>
              </div>

              {/* Related Resources */}
              <div className="bg-white rounded-xl shadow-md border border-[#e5e5e5] p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">
                  Featured Resource
                </h3>
                <div className="space-y-3">
                  <div className="group cursor-pointer">
                    <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=120&width=200&text=Featured+Resource"
                        alt="Featured Resource"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                      Military Finance Basics: TSP and Beyond
                    </h4>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      Essential financial planning strategies for service
                      members and their families.
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                        Finance
                      </span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full">
                        TSP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Resource Content */}
          <main className="flex-1 order-1 lg:order-2 lg:col-span-3">
            <div className="space-y-8">
              {/* Banner Image */}
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src={getImageSrc() || "/placeholder.svg"}
                  alt={resource.title}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                  onError={handleImageError}
                />
              </div>

              {/* Resource Summary */}
              <div className="bg-white rounded-xl shadow-lg border border-primary/30 p-6">
                <div className="relative mb-4">
                  <div className="pr-40 lg:pr-48">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#222222]">
                      {resource.title}
                    </h1>
                  </div>

                  {/* Go to Website Button - Absolutely positioned top right */}
                  <div className="absolute top-0 right-0">
                    <button
                      onClick={handleExternalClick}
                      className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 text-lg shadow-lg whitespace-nowrap"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Go to Website
                    </button>
                  </div>
                </div>

                <p className="text-lg text-[#222222]/70 mb-6">
                  {resource.description}
                </p>

                {/* Tags and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/?branch=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/50 font-medium hover:bg-primary/30 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200 font-medium">
                      Military Resource
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {user.isLoggedIn && (
                      <button
                        onClick={handleFavoriteClick}
                        className={`p-2 rounded-lg transition-colors ${
                          isFavorited
                            ? "bg-accent/10 text-accent border border-accent/30"
                            : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-accent/10 hover:text-accent"
                        }`}
                        title={
                          isFavorited
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isFavorited ? "fill-accent" : ""
                          }`}
                        />
                      </button>
                    )}

                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                      title="Copy link"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* About This Resource */}
              <section className="bg-white rounded-xl shadow-lg border border-primary/30 p-6">
                <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  About This Resource
                </h2>
                <div className="text-[#222222]/80 leading-relaxed">
                  {resource.description} This platform provides essential
                  services and tools for military personnel, offering secure
                  access to important military resources and information. The
                  system is designed to streamline military processes and
                  provide easy access to critical services.
                </div>
              </section>

              {/* Access Requirements */}
              <section className="bg-white rounded-xl shadow-lg border border-primary/30 p-6">
                <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Access Requirements
                </h2>
                <ul className="space-y-3">
                  {accessRequirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[#222222]/80"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Login Methods */}
              <section className="bg-white rounded-xl shadow-lg border border-primary/30 p-6">
                <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Available Login Methods
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {loginOptions.map((option) => (
                    <div
                      key={option}
                      className="bg-secondary/50 border border-gray-300 rounded-lg p-4 text-center"
                    >
                      <div className="font-medium text-[#222222] text-sm">
                        {option}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* How to Access */}
              <section className="bg-white rounded-xl shadow-lg border border-primary/30 p-6">
                <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  How to Access
                </h2>
                <ol className="space-y-4">
                  {howToAccess.map((step, index) => (
                    <li key={index} className="flex gap-4 text-[#222222]/80">
                      <span className="bg-accent text-white font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-sm">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Resource Details */}
              <section className="bg-white rounded-xl shadow-lg border border-primary/30 p-6">
                <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Resource Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#222222]/70">Category:</span>
                    <span className="font-medium text-[#222222]">
                      {resource.category || "Military Resource"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#222222]/70">Access Level:</span>
                    <span className="font-medium text-[#222222]">
                      Military Credentials Required
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#222222]/70">Availability:</span>
                    <span className="font-medium text-[#222222]">
                      24/7 Online Access
                    </span>
                  </div>

                  <div className="border-t border-[#222222]/10 pt-4">
                    <div className="flex justify-between">
                      <span className="text-[#222222]/70">Last Updated:</span>
                      <span className="font-medium text-[#222222]">
                        Recently verified
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom CTA */}
              <div className="bg-white rounded-xl shadow-lg border border-primary/30 p-6 text-center">
                <button
                  onClick={handleExternalClick}
                  className="w-full max-w-md bg-accent hover:bg-accent/90 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow-lg mx-auto"
                >
                  <ExternalLink className="h-5 w-5" />
                  Go to Website
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer with bottom padding for mobile sticky button */}
      <div>
        <ScrollButtons />
      </div>
    </div>
  );
}
