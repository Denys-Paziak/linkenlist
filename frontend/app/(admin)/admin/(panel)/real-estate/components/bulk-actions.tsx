import { CheckCircle, XCircle, Calendar } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import { IRealestateAdminList } from "../../../../../../types/Realestate";

export function BulkActions({
  selectedListings,
}: {
  selectedListings: IRealestateAdminList[];
}) {
  const handleBulkApprove = () => {};
  const handleBulkReject = () => {};
  const handleBulkAdjustExpiration = () => {};

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={handleBulkApprove}>
        <CheckCircle className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button variant="destructive" size="sm" onClick={handleBulkReject}>
        <XCircle className="h-4 w-4 mr-1" />
        Reject
      </Button>
      <Button variant="outline" size="sm" onClick={handleBulkAdjustExpiration}>
        <Calendar className="h-4 w-4 mr-1" />
        Adjust Expiration
      </Button>
    </div>
  );
}
