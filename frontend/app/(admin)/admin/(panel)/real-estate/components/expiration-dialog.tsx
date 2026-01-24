"use client";

import { Button } from "../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { StatusChip } from "../../../../../../components/ui/status-chip";
import { useState } from "react";
import { IRealestateAdminList } from "../../../../../../types/Realestate";
import { renderAddress } from "../../../../../../components/realestate-card";
import { ArrowUpDown } from "lucide-react";

export function ExpirationDialog({
  isShow,
  onClose,
  selectedListings,
}: {
  isShow: boolean;
  onClose: () => void;
  selectedListings: IRealestateAdminList[];
}) {
  const [newExpirationDays, setNewExpirationDays] = useState<{
    [listingId: number]: number;
  }>({});
  const [sortBy, setSortBy] = useState<string>("title");

  const getSortedExpirationListings = () => {
    const listings = [...selectedListings];

    switch (sortBy) {
      case "title":
        listings.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "id":
        listings.sort((a, b) => a.id - b.id);
        break;
      case "package":
        listings.sort((a, b) => a.package.localeCompare(b.package));
        break;
      case "expiration-asc":
        listings.sort((a, b) => {
          const dateA = a.expiresAt ? new Date(a.expiresAt).getTime() : 0;
          const dateB = b.expiresAt ? new Date(b.expiresAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case "expiration-desc":
        listings.sort((a, b) => {
          const dateA = a.expiresAt ? new Date(a.expiresAt).getTime() : 0;
          const dateB = b.expiresAt ? new Date(b.expiresAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return listings;
  };

  const expirationChange = (listingId: number, value: number) => {
    setNewExpirationDays((prev) => ({ ...prev, [listingId]: value }));
  };

  const handleExpirationUpdate = () => {};

  return (
    <Dialog open={isShow} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adjust Listing Expiration</DialogTitle>
          <DialogDescription>
            Update the expiration dates for the selected listings. Changes will
            be applied immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 pb-4 border-b">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <Label htmlFor="sort-select" className="text-sm font-medium">
            Sort by:
          </Label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-[200px]"
          >
            <option value="title">Title (A-Z)</option>
            <option value="id">Listing ID</option>
            <option value="package">Package Type</option>
            <option value="expiration-asc">Expiration (Low to High)</option>
            <option value="expiration-desc">Expiration (High to Low)</option>
          </select>
        </div>

        <div className="space-y-4">
          {getSortedExpirationListings().map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              expirationValue={newExpirationDays[listing.id]}
              expirationChange={expirationChange}
            />
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExpirationUpdate}>Update Expiration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ListingCard({
  listing,
  expirationValue,
  expirationChange,
}: {
  listing: IRealestateAdminList;
  expirationValue: number;
  expirationChange: (listingId: number, value: number) => void;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-sm">{listing.title}</h4>
          <p className="text-xs text-gray-500">{renderAddress(listing)}</p>
        </div>
        <StatusChip
          text={listing.package}
          status={listing.package === "premium" ? "published" : "archived"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-xs font-medium text-gray-600">
            Listing ID
          </Label>
          <p className="font-mono">{listing.id}</p>
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-600">
            Package Type
          </Label>
          <p className="capitalize">{listing.package}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor={`days-${listing.id}`}
            className="text-xs font-medium text-gray-600"
          >
            Days Until Expiration
          </Label>
          <Input
            id={`days-${listing.id}`}
            type="number"
            min="0"
            max="365"
            value={expirationValue}
            onChange={(e) =>
              expirationChange(listing.id, Number(e.target.value))
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-600">
            Expiration Date
          </Label>
          <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">
            {listing.expiresAt?.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
