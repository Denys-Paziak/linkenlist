import { Bookmark, Home, Link } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { RealestateCard } from "../../../../../components/realestate-card";

export function SavedListings() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
        <Card>
          <CardContent className="p-2 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Saved
                </p>
                <p className="text-lg md:text-2xl font-bold text-[#002244]">
                  {savedListings.length}
                </p>
              </div>
              <Bookmark className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  For Sale
                </p>
                <p className="text-lg md:text-2xl font-bold text-[#002244]">
                  {savedListings.filter((l) => l.type === "sale").length}
                </p>
              </div>
              <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  For Rent
                </p>
                <p className="text-lg md:text-2xl font-bold text-[#002244]">
                  {savedListings.filter((l) => l.type === "rent").length}
                </p>
              </div>
              <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {savedListings.length === 0 ? (
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              No Saved Listings
            </h2>
            <p className="text-gray-600 mb-8">
              Browse properties and bookmark the ones you're interested in to
              see them here.
            </p>
            <Link href="/realestate">
              <Button className="bg-[#002244] hover:bg-[#001122]">
                Browse Properties
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid-container-profile">
          {savedListings.map((listing) => (
            <div key={listing.id} className="relative">
              <RealestateCard
                listing={listing}
                onDetailsClick={() => handleCardClick(listing)}
                isBookmarked={true}
                onBookmarkToggle={(e) =>
                  handleRemoveSavedListing(listing.id, e)
                }
                showStatusBadges="all" // Changed from "active-pending-only" to "all" to show all 4 statuses
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
