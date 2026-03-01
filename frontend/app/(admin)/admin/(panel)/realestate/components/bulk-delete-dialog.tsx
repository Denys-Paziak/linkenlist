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
import { IRealestateAdminList } from "../../../../../../types/Realestate";
import { useEffect, useState } from "react";
import {
    ButtonSubmit,
    ButtonSubmitStatus,
} from "../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { mutate } from "swr";

export function BulkDeleteDialog({
    isShow,
    onClose,
    selectedListings,
}: {
    isShow: boolean;
    onClose: () => void;
    selectedListings: IRealestateAdminList[];
}) {
    const [status, setStatus] = useState<ButtonSubmitStatus>("idle");

    const handleBulkDelete = async () => {
        setStatus("loading");

        try {
            await fetcherAdmin("/admin/listings/bulk-delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    listingsIds: selectedListings.map((item) => item.id),
                }),
            });

            setStatus("success");
            mutate(
                (key) => typeof key === "string" && key.startsWith("/admin/listings"),
                undefined,
                { revalidate: true },
            );
        } catch (err: any) {
            setStatus("error");
        }
    };

    useEffect(() => {
        if (status === "success" || status === "error") {
            const timer = setTimeout(() => setStatus("idle"), 2000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <Dialog open={isShow} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Delete Selected Listings</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete these listings?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <ButtonSubmit
                        variant="destructive"
                        status={status}
                        statusText={{
                            loading: "Deleting...",
                            success: "Deleted!",
                            error: "Try again",
                        }}
                        disabled={status === "loading"}
                        size="sm"
                        onClick={handleBulkDelete}
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Delete
                    </ButtonSubmit>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}