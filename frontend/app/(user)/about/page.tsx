"use client";

import { useEffect } from "react";

export default function AboutPage() {
  // Auto-scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#222222] mb-4">
          About LinkEnlist
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Built by a military family, for the military community.
        </p>
      </div>

      {/* Content sections */}
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            LinkEnlist.com exists to cut the noise and put the right tools in
            one place—whether you're prepping for a PCS, managing pay and
            benefits, or looking for a home near your next duty station.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Make military life easier by organizing trusted links, real-estate
            listings, resources, and deals into a clean, searchable hub that
            saves you time.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
            What We Offer
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Real-Estate Marketplace
              </h3>
              <p>
                List or find homes near bases, with base-proximity maps, BAH
                tools, and military-friendly tags (PCS-Ready, VA Eligible,
                Assumable Loan, 3D Tour).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Official Links Directory
              </h3>
              <p>
                Curated, verified links to DoD/service portals, finance,
                healthcare, education, travel, and more—organized and easy to
                search.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Resource Library
              </h3>
              <p>
                Practical guides and checklists (PCS timelines, moving tips,
                benefits how-tos).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Military Deals
              </h3>
              <p>
                Vetted discounts for service members, veterans, and families.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Personalization
              </h3>
              <p>
                Save favorites, track updates, and return to what you use most.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
            How We Work
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Independent & Transparent
              </h3>
              <p>
                We're not affiliated with the U.S. government or DoD; we simply
                point you to the official sources and tools that matter.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Quality Over Quantity
              </h3>
              <p>
                Every link is reviewed, categorized, and monitored; broken or
                outdated items are removed quickly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Privacy-First
              </h3>
              <p>
                Your data is never sold. We collect only what we need to run
                core features.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
            Important Notice
          </h2>
          <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
            <p className="text-gray-700 leading-relaxed">
              <strong>Disclaimer:</strong> LinkEnlist.com is not affiliated
              with, endorsed by, or operated by any branch of the U.S.
              government or the Department of Defense (DoD). We are an
              independent platform that provides links to official government
              resources for informational purposes only.
            </p>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-gray-700 text-center">
              Have a link to suggest or a property to list? We'd love to hear
              from you.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
