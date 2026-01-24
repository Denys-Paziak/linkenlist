"use client";

import { XCircle } from "lucide-react";
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
import { IRealestateAdminList } from "../../../../../../types/Realestate";
import { useState } from "react";

export function BulkRejectDialog({
  isShow,
  onClose,
  selectedListings,
}: {
  isShow: boolean;
  onClose: () => void;
  selectedListings: IRealestateAdminList[];
}) {
  const [comments, setComments] = useState<{ [listingId: number]: string }>({});

  const commentChange = (listingId: number, value: string) => {
    setComments((prev) => ({ ...prev, [listingId]: value }));
  };

  const handleBulkReject = () => {};

  return (
    <Dialog open={isShow} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reject Selected Listings</DialogTitle>
          <DialogDescription>
            Add comments for each user whose listings will be rejected. These
            messages will be sent to the users along with the rejection
            notification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {selectedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              commentValue={comments[listing.id]}
              commentChange={commentChange}
            />
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleBulkReject}>
            <XCircle className="h-4 w-4 mr-2" />
            Reject All with Comments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ListingCard({
  listing,
  commentValue,
  commentChange,
}: {
  listing: IRealestateAdminList;
  commentValue: string;
  commentChange: (listingId: number, value: string) => void;
}) {
  const userName = listing.owner.firstName + " " + listing.owner.lastName;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{userName}</h4>
          <p className="text-sm text-gray-500">{listing.title}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`comment-${listing.owner.id}`}
          className="text-sm font-medium"
        >
          Rejection Message for {userName}
        </Label>
        <textarea
          id={`comment-${listing.owner.id}`}
          placeholder="Enter your message to the user explaining the rejection..."
          value={commentValue}
          onChange={(e) => commentChange(listing.id, e.target.value)}
          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
