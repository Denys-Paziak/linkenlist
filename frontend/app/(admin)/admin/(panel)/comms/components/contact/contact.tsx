"use client";

import { Badge, CheckCircle, Clock, Eye, Mail, Search } from "lucide-react";
import { Card, CardContent } from "../../../../../../../components/ui/card";
import { Input } from "../../../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import { Button } from "../../../../../../../components/ui/button";
import { useState } from "react";
import { StatusChip } from "../../../../../../../components/ui/status-chip";
import { ContactDetailDialog } from "./detail-dialog";

export function Contact() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageStatusFilter, setMessageStatusFilter] = useState("all");
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const handleMessageAction = (action: string, messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              status:
                action === "resolved"
                  ? "Resolved"
                  : action === "open"
                  ? "Open"
                  : message.status,
            }
          : message
      )
    );
  };

  const openMessageDetail = (message: any) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      searchQuery === "" ||
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      messageStatusFilter === "all" ||
      message.status.toLowerCase() === messageStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Contact Messages Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search name, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={messageStatusFilter}
              onValueChange={setMessageStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Type</th>
                  <th className="p-4 text-left font-medium">Name</th>
                  <th className="p-4 text-left font-medium">Email</th>
                  <th className="p-4 text-left font-medium">Subject</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className={`border-b hover:bg-gray-50 ${
                      message.status.toLowerCase() === "resolved"
                        ? "bg-green-50 opacity-75"
                        : ""
                    }`}
                  >
                    <td className="p-4 text-sm text-gray-600">
                      {message.date}
                    </td>
                    <td className="p-4">
                      <StatusChip
                        text={message.type}
                        status={
                          message.type === "Report" ? "expired" : "published"
                        }
                      />
                    </td>
                    <td className="p-4 font-medium">{message.name}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {message.email}
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{message.subject}</div>
                        <div className="text-sm text-gray-600">
                          {message.preview}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusChip
                        text={message.status}
                        status={
                          message.status.toLowerCase() === "new"
                            ? "expired"
                            : message.status.toLowerCase() === "open"
                            ? "scheduled"
                            : "published"
                        }
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openMessageDetail(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleMessageAction("open", message.id)
                          }
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleMessageAction("resolved", message.id)
                          }
                          className={
                            message.status.toLowerCase() === "resolved"
                              ? "text-green-600"
                              : ""
                          }
                        >
                          <CheckCircle
                            className={`h-4 w-4 ${
                              message.status.toLowerCase() === "resolved"
                                ? "fill-green-600"
                                : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ContactDetailDialog />
    </>
  );
}

export function ContactButton() {
  return (
    <>
      <Mail className="h-4 w-4" />
      Contact Inbox ({0})
    </>
  );
}
