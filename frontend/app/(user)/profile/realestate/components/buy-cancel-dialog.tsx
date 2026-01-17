"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";

export function BuyCancelDialog() {
  const query = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleCancel = () => {
    router.replace(pathname);
  };

  return (
    <Dialog
      open={query.get("popup") === "cancel"}
      onOpenChange={() => handleCancel()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment canceled</DialogTitle>
          <DialogDescription>
            The payment was canceled or there was an error.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleCancel()}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
