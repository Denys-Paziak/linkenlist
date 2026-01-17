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

export function BuySuccessDialog() {
  const query = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleCancel = () => {
    router.replace(pathname);
  };

  return (
    <Dialog
      open={query.get("popup") === "success"}
      onOpenChange={() => handleCancel()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment successful</DialogTitle>
          <DialogDescription>
            Your premium package has been successfully paid for.
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
