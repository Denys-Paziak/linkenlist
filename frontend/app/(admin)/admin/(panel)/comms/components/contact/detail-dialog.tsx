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
import { useState } from "react";
import { StatusChip } from "../../../../../../../components/ui/status-chip";

export function ContactDetailDialog() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  return (
    <Dialog open={showMessageDetail} onOpenChange={setShowMessageDetail}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Message Thread</DialogTitle>
        </DialogHeader>
        {selectedMessage && (
          <div className="space-y-6">
            {/* Message Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">From</Label>
                <p>
                  {selectedMessage.name} ({selectedMessage.email})
                </p>
              </div>
              <div>
                <Label className="font-medium">Subject</Label>
                <p>{selectedMessage.subject}</p>
              </div>
              <div>
                <Label className="font-medium">Date</Label>
                <p>{selectedMessage.date}</p>
              </div>
              <div>
                <Label className="font-medium">Status</Label>
                <StatusChip
                  text={selectedMessage.status}
                  status={
                    selectedMessage.status.toLowerCase() === "new"
                      ? "expired"
                      : selectedMessage.status.toLowerCase() === "open"
                      ? "scheduled"
                      : "published"
                  }
                />
              </div>
            </div>

            {/* Reported Listing Info for Report type messages */}
            {selectedMessage.type === "Report" && (
              <div className="border rounded-lg p-4 bg-red-50">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <Label className="font-medium text-red-800">
                      Reported By
                    </Label>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <Label className="font-medium text-red-800">
                      Reported Listing
                    </Label>
                    <div className="flex items-center gap-2">
                      <p className="text-blue-600">
                        1234 Marine Dr, Oceanside, CA 92057
                      </p>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      View listing: /realestate?listing=mbo1523970
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium text-red-800">
                      Report Type
                    </Label>
                    <StatusChip text="Fraudulent Listing" status="expired" />
                  </div>
                </div>
              </div>
            )}

            {/* Thread */}
            <div className="space-y-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
              {selectedMessage.thread.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded ${
                    msg.from === "user" ? "bg-gray-50" : "bg-blue-50"
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-1">
                    {msg.from === "user"
                      ? selectedMessage.name
                      : "LinkEnlist Admin"}{" "}
                    - {msg.timestamp}
                  </div>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Reply */}
            <div className="space-y-2">
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
                  <Label htmlFor="send-email" className="text-sm">
                    Send an email
                  </Label>
                </div>
                <Button size="sm">
                  <Reply className="h-4 w-4 mr-1" />
                  Send Notification Response
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
