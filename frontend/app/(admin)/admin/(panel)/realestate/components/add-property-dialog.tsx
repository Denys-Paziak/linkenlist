"use client";

import { useState } from "react";
import { Button } from "../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { useRouter } from "next/navigation";

export function AddPropertyDialog({
  isShow,
  onClose,
}: {
  isShow: boolean;
  onClose: () => void;
}) {
  const [username, setUsername] = useState<string | null>(null);
  const [packageType, setPackageType] = useState<string>("premium");

  const router = useRouter();

  const handleCreate = async () => {
    router.push(`/profile/realestate/new?package=${packageType}&username=${username}`);
  };

  return (
    <Dialog open={isShow} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Enter username and select a package to create an listing
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <div>
            <Input
              label="Username"
              placeholder="Enter username"
              value={username || ""}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
          </div>
          <div className="pb-4">
            <Label htmlFor="package-select" className="text-sm font-medium">
              Package
            </Label>
            <select
              id="package-select"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              className="flex h-10 w-full  rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-[200px]"
            >
              <option value="premium">Premium</option>
              <option value="basic">Basic</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
