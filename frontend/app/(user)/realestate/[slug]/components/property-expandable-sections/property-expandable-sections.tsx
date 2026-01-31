"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Flag, ExternalLink } from "lucide-react";
import { IRealestate } from "../../../../../../types/Realestate";
import { MapLocation } from "./components/map-location";
import { ReportDialog } from "./components/report-dialog";
import { HomesForYou } from "./components/homes-for-you";

export function PropertyExpandableSections({
  listing,
}: {
  listing: IRealestate;
}) {
  const [showReportForm, setShowReportForm] = useState(false);

  const handleExternalVideoLink = () => {
    if (listing.virtualTourUrl) {
      window.open(listing.virtualTourUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mt-8 space-y-4 ml-1.5 mr-1.5">
      <MapLocation listing={listing} />

      {/* Video Tour */}
      {listing.virtualTourUrl && (
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleExternalVideoLink}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-gray-600" />
                <div>
                  <h3 className="font-bold text-gray-900">Video Tour</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {listing.virtualTourUrl}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ExternalLink className="h-4 w-4" />
                <span>External site</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <HomesForYou listingId={listing.id}/>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 flex-1">
            All calculations are estimates and provided by LinkEnlist (NodEd
            LLC) for informational purposes only. Actual amounts may vary.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReportForm(true)}
            className="ml-4 w-8 h-8 p-0 text-gray-600 hover:text-white bg-transparent border-gray-300 hover:border-gray-400"
            title="Report this listing"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ReportDialog
        isShow={showReportForm}
        onClose={() => setShowReportForm(false)}
        listing={listing}
      />
    </div>
  );
}
