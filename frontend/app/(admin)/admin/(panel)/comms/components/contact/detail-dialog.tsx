"use client";

import { ExternalLink, Reply } from "lucide-react";
import { Button } from "../../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../../../components/ui/dialog";
import { Textarea } from "../../../../../../../components/ui/textarea";
import { Label } from "../../../../../../../components/ui/label";
import { Checkbox } from "../../../../../../../components/ui/checkbox";
import { useEffect, useState } from "react";
import { StatusChip } from "../../../../../../../components/ui/status-chip";
import {
  EContactInboxStatus,
  IContactInbox,
} from "../../../../../../../types/ContactInbox";
import { renderAddress } from "../../../../../../../components/realestate-card";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";
import { mutate } from "swr";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function ContactDetailDialog({
  message,
  isShow,
  onClose,
}: {
  message: IContactInbox | null;
  isShow: boolean;
  onClose: () => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  const [saveStatus, setSaveStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const handleSubmit = async () => {
    setFormError(null);

    if (!replyText) {
      setFormError("Fill in the reply text.");
      return;
    }

    setSaveStatus("loading");

    try {
      await fetcherAdmin(`/admin/contact-inbox/${message?.id}/reply`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: replyText,
          sendEmail,
        }),
      });

      setSaveStatus("success");
      setReplyText("")
      setSendEmail(false)
      const params = new URLSearchParams(searchParams);
      params.set("page", searchParams.get("page") || "1")
      params.set("limit", searchParams.get("limit") || "40")
      const key = `/admin/contact-inbox?${params.toString()}`;
      mutate(key);
    } catch (err) {
      setFormError(
        (err as any).message ||
          "An unexpected error occurred. Please try again.",
      );
      setSaveStatus("error");
    }
  };

  useEffect(() => {
    if (saveStatus === "success" || saveStatus === "error") {
      const timer = setTimeout(() => setSaveStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  return (
    <Dialog open={isShow} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Message Thread</DialogTitle>
        </DialogHeader>

        {message && (
          <div className="space-y-6">
            {/* Message Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">From</Label>
                <p>
                  {message.name} ({message.email})
                </p>
              </div>
              <div>
                <Label className="font-medium">Subject</Label>
                <p>{message.subject}</p>
              </div>
              <div>
                <Label className="font-medium">Date</Label>
                <p>{new Date(message.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="font-medium">Status</Label>
                <StatusChip
                  text={message.status}
                  status={
                    message.status.toLowerCase() === EContactInboxStatus.NEW
                      ? "expired"
                      : message.status.toLowerCase() ===
                          EContactInboxStatus.OPEN
                        ? "scheduled"
                        : "published"
                  }
                />
              </div>
            </div>

            {/* Reported Listing Info for Report type messages */}
            {message.reportListing && (
              <div className="border rounded-lg p-4 bg-red-50">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <Label className="font-medium text-red-800">
                      Reported By
                    </Label>
                    <p className="font-medium">{message.name}</p>
                  </div>
                  <div>
                    <Label className="font-medium text-red-800">
                      Reported Listing
                    </Label>
                    <Link href={`/realestate/${message.reportListing.slug}`} target="_blank" className="flex items-center gap-2">
                      <p className="text-blue-600">
                        {renderAddress(message.reportListing)}
                      </p>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-600 mt-1">
                      View listing: /realestate/{message.reportListing.slug}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium text-red-800">
                      Report Type
                    </Label>
                    <StatusChip text={message.reportReason || ""} status="expired" />
                  </div>
                </div>
              </div>
            )}

            {/* Thread */}
            <div className="space-y-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
              {message.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded ${
                    msg.name === "LinkEnlist Admin"
                      ? "bg-blue-50"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-1">
                    {msg.name} -{" "}
                    {new Intl.DateTimeFormat("sv-SE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                      .format(new Date(msg.createdAt))
                      .replace(",", "")}
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Reply */}
            {
              message.email !== "Not registered" && (
                <div className="space-y-2">
                  {formError ? <ErrorAlert message={formError} /> : null}
                  <Label htmlFor="message-reply">Reply</Label>
                  <Textarea
                    id="message-reply"
                    placeholder="Type your response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex items-center justify-end gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="send-email"
                        checked={sendEmail}
                        onCheckedChange={(value) =>
                          setSendEmail(value === "indeterminate" ? false : value)
                        }
                      />
                      <Label htmlFor="send-email" className="text-sm mb-0">
                        Send an email
                      </Label>
                    </div>
                    <ButtonSubmit
                      type="button"
                      status={saveStatus}
                      statusText={{
                        loading: "Sending...",
                        success: "Sent",
                        error: "Try again",
                      }}
                      size="sm"
                      onClick={handleSubmit}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Send Notification Response
                    </ButtonSubmit>
                  </div>
                </div>
              )
            }
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
