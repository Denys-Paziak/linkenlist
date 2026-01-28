"use client";

import {
  AlertCircle,
  Calendar,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import {
  EListingStatus,
  IRealestateOwnerList,
} from "../../../../../types/Realestate";
import Link from "next/link";
import { PublishDialog } from "./publish-dialog";
import { useState } from "react";
import { ExpirationDialog } from "./expiration-dialog";
import { DeleteDialog } from "./delete-dialog";
import { DeactivateDialog } from "./deactivate-dialog";

export function ListingDropMenu({ data }: { data: IRealestateOwnerList }) {
  const [showPublishDialog, setShowPublishDialog] = useState<boolean>(false);
  const [showExpirationDialog, setShowExpirationDialog] =
    useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showDeactivateDialog, setShowDeactivateDialog] =
    useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="w-6 h-6 p-0 bg-white hover:bg-white shadow-sm"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border shadow-lg">
          {data.status !== EListingStatus.ACTIVE &&
            data.status !== EListingStatus.PENDING &&
            !data.isExpired && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setShowPublishDialog(true);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Publish Listing
              </DropdownMenuItem>
            )}

          {data.status === EListingStatus.ACTIVE && (
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/realestate/${data.slug}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href={`/profile/realestate/${data.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Link>
          </DropdownMenuItem>

          {data.expiresAt && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setShowExpirationDialog(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Expiration
            </DropdownMenuItem>
          )}

          {(data.status === EListingStatus.ACTIVE ||
            data.status === EListingStatus.PENDING) && (
            <DropdownMenuItem
              onClick={() => setShowDeactivateDialog(true)}
              className="cursor-pointer text-orange-600 focus:text-orange-600 hover:bg-orange-50 focus:bg-orange-50"
            >
              <AlertCircle className="h-4 w-4 mr-2" /> Deactivate Listing
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Permanently
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeactivateDialog
        listing={data}
        showDialog={showDeactivateDialog}
        handleCancel={() => setShowDeactivateDialog(false)}
      />
      <PublishDialog
        listing={data}
        showDialog={showPublishDialog}
        handleCancel={() => setShowPublishDialog(false)}
      />
      <ExpirationDialog
        listing={data}
        showDialog={showExpirationDialog}
        handleCancel={() => setShowExpirationDialog(false)}
      />
      <DeleteDialog
        listing={data}
        showDialog={showDeleteDialog}
        handleCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
