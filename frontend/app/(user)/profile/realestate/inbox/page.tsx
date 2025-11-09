"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUser } from "@/contexts/user-context"
import { Mail, MailOpen, Send, X, ArrowLeft, MessageSquare, User, Phone, ExternalLink } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// Mock leads data
const mockLeads = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    propertyId: 1,
    propertyAddress: "123 Oak Street, Fayetteville, NC 28301",
    status: "needs_reply",
    lastMessage: "I'm interested in this property. Please contact me with more information.",
    timestamp: "2024-01-15T10:30:00Z",
    messages: [
      {
        id: 1,
        from: "Sarah Johnson",
        message: "I'm interested in this property. Please contact me with more information.",
        timestamp: "2024-01-15T10:30:00Z",
        type: "inquiry",
      },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 987-6543",
    propertyId: 2,
    propertyAddress: "456 Pine Avenue, Fayetteville, NC 28303",
    status: "replied",
    lastMessage: "Thank you for the information. When would be a good time to schedule a viewing?",
    timestamp: "2024-01-14T15:45:00Z",
    messages: [
      {
        id: 1,
        from: "Michael Chen",
        message: "I'm interested in this property. Please contact me with more information.",
        timestamp: "2024-01-14T14:30:00Z",
        type: "inquiry",
      },
      {
        id: 2,
        from: "You",
        message:
          "Hi Michael, thanks for your interest! This property is still available. It's a great 2BR apartment with utilities included. Would you like to schedule a viewing?",
        timestamp: "2024-01-14T15:15:00Z",
        type: "reply",
      },
      {
        id: 3,
        from: "Michael Chen",
        message: "Thank you for the information. When would be a good time to schedule a viewing?",
        timestamp: "2024-01-14T15:45:00Z",
        type: "inquiry",
      },
    ],
  },
  {
    id: 3,
    name: "Jennifer Martinez",
    email: "j.martinez@email.com",
    phone: "(555) 456-7890",
    propertyId: 4,
    propertyAddress: "321 Cedar Lane, Fayetteville, NC 28304",
    status: "needs_reply",
    lastMessage: "Is this property pet-friendly? I have a small dog.",
    timestamp: "2024-01-13T09:15:00Z",
    messages: [
      {
        id: 1,
        from: "Jennifer Martinez",
        message: "Is this property pet-friendly? I have a small dog.",
        timestamp: "2024-01-13T09:15:00Z",
        type: "inquiry",
      },
    ],
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.w@email.com",
    phone: "(555) 321-0987",
    propertyId: 1,
    propertyAddress: "123 Oak Street, Fayetteville, NC 28301",
    status: "replied",
    lastMessage: "Perfect, I'll be there at 2 PM on Saturday. Thank you!",
    timestamp: "2024-01-12T16:20:00Z",
    messages: [
      {
        id: 1,
        from: "David Wilson",
        message: "I'm interested in scheduling a viewing for this weekend if possible.",
        timestamp: "2024-01-12T14:00:00Z",
        type: "inquiry",
      },
      {
        id: 2,
        from: "You",
        message: "Hi David, I have availability this Saturday at 2 PM. Does that work for you?",
        timestamp: "2024-01-12T15:30:00Z",
        type: "reply",
      },
      {
        id: 3,
        from: "David Wilson",
        message: "Perfect, I'll be there at 2 PM on Saturday. Thank you!",
        timestamp: "2024-01-12T16:20:00Z",
        type: "inquiry",
      },
    ],
  },
]

export default function InboxPage() {
  const { user } = useUser()
  const [leads, setLeads] = useState(mockLeads)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [filter, setFilter] = useState<"all" | "needs_reply">("all")
  const [replyMessage, setReplyMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [showAgentProfile, setShowAgentProfile] = useState(false)

  // Filter leads based on selected filter
  const filteredLeads = leads.filter((lead) => (filter === "all" ? true : lead.status === "needs_reply"))

  // Handle lead selection
  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead)
    setShowPanel(true)
  }

  // Handle closing panel
  const handleClosePanel = () => {
    setShowPanel(false)
    setSelectedLead(null)
    setReplyMessage("")
  }

  useEffect(() => {
    const isMobile = window.innerWidth < 1024 // lg breakpoint
    if (showPanel && isMobile) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showPanel])

  // Handle ESC key to close panel
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClosePanel()
      }
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [])

  // Handle quick reply
  const handleQuickReply = (message: string) => {
    setReplyMessage(message)
  }

  // Handle send reply
  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedLead) return

    setIsSending(true)

    try {
      // Mock API call
      await fetch(`/api/profile/realestate/leads/${selectedLead.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      })

      // Update lead status
      await fetch(`/api/profile/realestate/leads/${selectedLead.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "replied" }),
      })

      const newMessage = {
        id: Date.now(),
        from: "You",
        message: replyMessage,
        timestamp: new Date().toISOString(),
        type: "reply",
      }

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === selectedLead.id
            ? {
                ...lead,
                status: "replied",
                messages: [...lead.messages, newMessage],
                lastMessage: replyMessage,
                timestamp: new Date().toISOString(),
              }
            : lead,
        ),
      )

      setSelectedLead((prev) => ({
        ...prev,
        status: "replied",
        messages: [...prev.messages, newMessage],
        lastMessage: replyMessage,
        timestamp: new Date().toISOString(),
      }))

      setReplyMessage("")
    } catch (error) {
      console.error("Failed to send reply:", error)
    } finally {
      setIsSending(false)
    }
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <Mail className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
              <p className="text-gray-600 mb-8">You need to be signed in to view your inbox.</p>
              <Button onClick={() => (window.location.href = "/signin")}>Sign In</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 py-4 md:py-8 pb-20 md:pb-8">
        {/* Header Section */}
        <div className="px-4 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/profile/realestate" className="text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inbox</h1>
              </div>
              <p className="text-gray-600">Manage inquiries from potential tenants and buyers</p>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-240px)] md:h-[calc(100vh-200px)]">
            {/* Left Panel - Leads List */}
            <div className="lg:w-1/3 flex flex-col h-full">
              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  All ({leads.length})
                </Button>
                <Button
                  variant={filter === "needs_reply" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("needs_reply")}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Needs Reply ({leads.filter((l) => l.status === "needs_reply").length})
                </Button>
              </div>

              <div
                className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200"
                style={{
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                <div className="p-4 space-y-2">
                  {filteredLeads.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No leads found</p>
                    </div>
                  ) : (
                    filteredLeads.map((lead) => (
                      <Card
                        key={lead.id}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedLead?.id === lead.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => handleSelectLead(lead)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900">{lead.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lead.status === "needs_reply" ? (
                                <Badge variant="destructive" className="text-xs">
                                  Needs Reply
                                </Badge>
                              ) : (
                                <MailOpen className="h-4 w-4 text-green-500" />
                              )}
                              <span className="text-xs text-gray-500">{formatTime(lead.timestamp)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 truncate">{lead.propertyAddress}</p>
                          <p className="text-sm text-gray-800 line-clamp-2">{lead.lastMessage}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Thread View (Desktop) */}
            <div className="hidden lg:block lg:w-2/3 h-full">
              {selectedLead ? (
                <Card className="h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Thread Header */}
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowAgentProfile(true)}
                            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-semibold hover:bg-slate-700 transition-colors"
                          >
                            {selectedLead.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </button>
                          <div>
                            <h3 className="font-semibold text-gray-900">{selectedLead.name}</h3>
                            <p className="text-sm text-gray-600">{selectedLead.propertyAddress}</p>
                            <a
                              href={`/realestate?listing=${selectedLead.propertyId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Listing
                            </a>
                          </div>
                        </div>
                        <Badge variant={selectedLead.status === "needs_reply" ? "destructive" : "secondary"}>
                          {selectedLead.status === "needs_reply" ? "Needs Reply" : "Replied"}
                        </Badge>
                      </div>
                    </div>

                    {/* Messages */}
                    <div
                      className="flex-1 p-4 overflow-y-auto space-y-4"
                      style={{
                        WebkitOverflowScrolling: "touch",
                        touchAction: "pan-y",
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                    >
                      {selectedLead.messages.map((message: any) => (
                        <div
                          key={message.id}
                          className={`flex ${message.from === "You" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.from === "You" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${message.from === "You" ? "text-blue-100" : "text-gray-500"}`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Section */}
                    <div className="p-4 border-t bg-gray-50">
                      <div className="mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply("Still available?")}
                          className="text-xs"
                        >
                          Still available?
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className="flex-1 min-h-[80px] resize-none"
                        />
                        <Button
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim() || isSending}
                          className="self-end"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a lead to view the conversation</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {showPanel && selectedLead && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={handleClosePanel}>
            <div
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Panel Header */}
                <div className="p-4 border-b bg-gray-50 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <Button variant="ghost" size="sm" onClick={handleClosePanel} className="hover:bg-gray-200 -ml-2">
                      <X className="h-5 w-5" />
                    </Button>
                    <Badge variant={selectedLead.status === "needs_reply" ? "destructive" : "secondary"}>
                      {selectedLead.status === "needs_reply" ? "Needs Reply" : "Replied"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAgentProfile(true)}
                      className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-semibold hover:bg-slate-700 transition-colors"
                    >
                      {selectedLead.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </button>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedLead.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{selectedLead.propertyAddress}</p>
                      <a
                        href={`/realestate?listing=${selectedLead.propertyId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Listing
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="flex-1 p-4 overflow-y-auto space-y-4"
                  style={{
                    WebkitOverflowScrolling: "touch",
                    touchAction: "pan-y",
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                >
                  {selectedLead.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.from === "You" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.from === "You" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.from === "You" ? "text-blue-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Section */}
                <div className="p-4 border-t bg-gray-50 flex-shrink-0">
                  <div className="mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply("Still available?")}
                      className="text-xs"
                    >
                      Still available?
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="flex-1 min-h-[60px] resize-none text-sm"
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || isSending}
                      size="sm"
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={showAgentProfile} onOpenChange={setShowAgentProfile}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl border border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#222222]">Profile</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Profile Section */}
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  SM
                </div>
                <h2 className="text-2xl font-bold text-[#222222]">Sarah Martinez</h2>
                <p className="text-[#222222]/70">Real Estate Agent</p>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[#222222]/70">
                    <Phone className="h-4 w-4" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#222222]/70">
                    <Mail className="h-4 w-4" />
                    <span>sarah.martinez@exprealty.com</span>
                  </div>
                </div>
              </div>

              {/* LinkEnlist Experience */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">LinkEnlist Experience</h3>
                <p className="text-[#222222]/70">Member since: March 2021 (3 years, 5 months)</p>
              </div>

              {/* Property Listings */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">Property Listings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-primary">For Sale</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">8</div>
                    <div className="text-sm text-red-600">For Rent</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
