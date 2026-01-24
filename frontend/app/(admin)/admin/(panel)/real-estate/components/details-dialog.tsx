import {
  Shield,
  AlertCircle,
  Copy,
  Flag,
  AlertTriangle,
  Badge,
  Edit,
} from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import {
  EListingStatus,
  IRealestateAdminList,
} from "../../../../../../types/Realestate";
import { renderAddress } from "../../../../../../components/realestate-card";
import {
  StatusChip,
  TStatus,
} from "../../../../../../components/ui/status-chip";
import { daysUntil } from "../../../../../../lib/utils";

export function DetailsDialog({
  isShow,
  onClose,
  selectedListing,
}: {
  isShow: boolean;
  onClose: () => void;
  selectedListing: IRealestateAdminList;
}) {
  return (
    <Dialog open={isShow} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Listing Details & Reports</DialogTitle>
          <DialogDescription>
            Detailed information about this listing including any reports or
            flags.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-lg">{selectedListing.title}</h4>
            <p className="text-sm text-gray-600">
              {renderAddress(selectedListing)}
            </p>
            <div className="flex items-center gap-4">
              {selectedListing?.isExpired ? (
                <StatusChip text={"expired"} status={"expired"} />
              ) : (
                <StatusChip
                  text={selectedListing.status}
                  status={
                    (
                      {
                        [EListingStatus.ACTIVE]: "published",
                        [EListingStatus.DRAFT]: "draft",
                        [EListingStatus.INACTIVE]: "archived",
                        [EListingStatus.PENDING]: "scheduled",
                        [EListingStatus.REJECTED]: "expired",
                      } as Record<EListingStatus, TStatus>
                    )[selectedListing.status]
                  }
                />
              )}
              <span className="text-sm text-gray-500">
                {selectedListing.totalViews} views
              </span>
            </div>
          </div>

          {/* Listing Details */}
          <div className="border rounded-lg p-4 space-y-3">
            <h5 className="font-medium">Listing Information</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Posted by:</span>
                <p>
                  {selectedListing.owner.firstName +
                    " " +
                    selectedListing.owner.lastName}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Package:</span>
                <p className="capitalize">{selectedListing.package}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Submitted:</span>
                <p>{selectedListing.createdAt.toLocaleDateString()}</p>
              </div>
              {selectedListing.expiresAt && (
                <div>
                  <span className="font-medium text-gray-600">Expires in:</span>
                  <p>{daysUntil(selectedListing.expiresAt)} days</p>
                </div>
              )}
            </div>
          </div>

          {/* Flags and Warnings */}
          {(selectedListing.freeListingUsed ||
            selectedListing.ownershipConflict ||
            selectedListing.duplicateWarning ||
            selectedListing.flaggedReasons.length > 0) && (
            <div className="border rounded-lg p-4 space-y-3">
              <h5 className="font-medium text-red-600">Flags & Warnings</h5>
              <div className="space-y-2">
                {selectedListing.freeListingUsed && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      Free listing quota already used
                    </span>
                  </div>
                )}
                {selectedListing.ownershipConflict && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Ownership conflict detected</span>
                  </div>
                )}
                {selectedListing.duplicateWarning && (
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Potential duplicate listing</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reported Issues */}
          {selectedListing.flaggedReasons.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <h5 className="font-medium text-red-600">Reported Issues</h5>
              <div className="space-y-2">
                {selectedListing.flaggedReasons.map(
                  (reason: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{reason}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => handleEditListing(selectedListing?.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
