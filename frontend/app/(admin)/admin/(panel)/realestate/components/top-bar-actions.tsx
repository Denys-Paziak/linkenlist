"use client";

import { Download, Eye, Plus } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import { IRealestateAdminList } from "../../../../../../types/Realestate";
import Link from "next/link";
import { AddPropertyDialog } from "./add-property-dialog";
import { useState } from "react";

export function TopBarActions({
  selectedListings,
}: {
  selectedListings: IRealestateAdminList[];
}) {
  const [showAddPropertyDialog, setShowAddPropertyDialog] =
    useState<boolean>(false);

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Link href={"/realestate"} target="_blank">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Public Listings
          </Button>
        </Link>
        <Button onClick={() => setShowAddPropertyDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
      <AddPropertyDialog
        isShow={showAddPropertyDialog}
        onClose={() => setShowAddPropertyDialog(false)}
      />
    </>
  );
}
