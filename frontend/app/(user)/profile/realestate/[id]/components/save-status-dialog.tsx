"use client";

import { Button } from "../../../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../../../../components/ui/dialog";

export function SaveStatusDialog({
    showDialog,
    handleCancel,
    text
}: {
    showDialog: boolean;
    handleCancel: () => void;
    text: string
}) {
    return (
        <Dialog open={showDialog} onOpenChange={() => handleCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Listing Saved</DialogTitle>
                    <DialogDescription>{text}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleCancel()}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
