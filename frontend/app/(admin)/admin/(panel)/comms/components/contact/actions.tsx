"use client";

import { CheckCircle, Clock, Eye, Loader2 } from "lucide-react";
import { Button } from "../../../../../../../components/ui/button";
import {
  EContactInboxStatus,
  IContactInbox,
} from "../../../../../../../types/ContactInbox";
import { ContactDetailDialog } from "./detail-dialog";
import { useState } from "react";
import { mutate } from "swr";
import { fetcherAdmin } from "../../../../../../../lib/fetcher";
import { useSearchParams } from "next/navigation";

export function Actions({ message }: { message: IContactInbox }) {
  const [showMessageDetail, setShowMessageDetail] = useState<boolean>(false);

  const [loadChangeOpen, setLoadChangeOpen] = useState<boolean>(false);
  const [loadChangeResolved, setLoadChangeResolved] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const openMessageDetail = () => {
    setShowMessageDetail(true);
  };
  const handleMessageAction = async (status: EContactInboxStatus) => {
    if (status === EContactInboxStatus.OPEN) {
      setLoadChangeOpen(true);
    }
    if (status === EContactInboxStatus.RESOLVED) {
      setLoadChangeResolved(true);
    }

    try {
      await fetcherAdmin(`/admin/contact-inbox/${message?.id}/change-status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const params = new URLSearchParams(searchParams);
      params.set("page", searchParams.get("page") || "1");
      params.set("limit", searchParams.get("limit") || "40");
      const key = `/admin/contact-inbox?${params.toString()}`;
      mutate(key);
    } catch {}

    if (status === EContactInboxStatus.OPEN) {
      setLoadChangeOpen(false);
    }
    if (status === EContactInboxStatus.RESOLVED) {
      setLoadChangeResolved(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={openMessageDetail}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleMessageAction(EContactInboxStatus.OPEN)}
        >
          {loadChangeOpen ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleMessageAction(EContactInboxStatus.RESOLVED)}
        >
          {loadChangeResolved ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className={"h-4 w-4"} />
          )}
        </Button>
      </div>

      {showMessageDetail && (
        <ContactDetailDialog
          message={message}
          isShow
          onClose={() => setShowMessageDetail(false)}
        />
      )}
    </>
  );
}
