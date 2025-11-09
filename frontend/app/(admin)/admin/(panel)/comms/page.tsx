"use client"

import { useState } from "react"
import { Search, Eye, MessageSquare, Mail, Clock, CheckCircle, Trash2, Reply, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for comments
const mockComments = [
  {
    id: "1",
    date: "2024-01-15",
    pageType: "Deal",
    pageTitle: "Military Discount on Home Security",
    userName: "John Smith",
    userEmail: "john@example.com",
    comment:
      "This is a great deal! I've been looking for something like this for months. The discount is substantial and the service looks reliable.",
    status: "Pending",
    ip: "192.168.1.100",
    userId: "user1",
    joinedDate: "2023-12-01",
    isPinned: false,
  },
  {
    id: "2",
    date: "2024-01-14",
    pageType: "Resource",
    pageTitle: "PCS Moving Checklist 2024",
    userName: "Sarah Johnson",
    userEmail: "sarah@example.com",
    comment: "Very helpful resource! Could you add information about overseas moves?",
    status: "Approved",
    ip: "10.0.0.50",
    userId: "user2",
    joinedDate: "2023-11-15",
    isPinned: true,
  },
  {
    id: "3",
    date: "2024-01-13",
    pageType: "Deal",
    pageTitle: "VA Loan Special Rates",
    userName: "Mike Wilson",
    userEmail: "mike@example.com",
    comment: "I want to report this as potentially misleading. The rates don't seem accurate.",
    status: "Hidden",
    ip: "172.16.0.25",
    userId: "user3",
    joinedDate: "2024-01-10",
    isPinned: false,
  },
]

// Mock data for contact messages
const mockMessages = [
  {
    id: "1",
    date: "2024-01-15",
    name: "Jennifer Davis",
    email: "jennifer@example.com",
    subject: "Issue with Real Estate Listing",
    type: "Contact us",
    status: "New",
    preview: "I'm having trouble with my listing submission...",
    thread: [
      {
        id: "msg1",
        from: "user",
        content:
          "I'm having trouble with my listing submission. The photos won't upload properly and I keep getting an error message.",
        timestamp: "2024-01-15 10:30",
      },
    ],
  },
  {
    id: "2",
    date: "2024-01-14",
    name: "Robert Chen",
    email: "robert@example.com",
    subject: "Report: Fraudulent Real Estate Listing - 1234 Marine Dr",
    type: "Report",
    status: "Open",
    preview: "I believe this listing at 1234 Marine Dr is fraudulent...",
    thread: [
      {
        id: "msg2",
        from: "user",
        content:
          "I believe this listing at 1234 Marine Dr, Oceanside, CA is fraudulent. The photos appear to be stock images and the price is unrealistically low for the area. The contact information seems fake and the listing has been reposted multiple times with different details.",
        timestamp: "2024-01-14 14:20",
      },
      {
        id: "msg3",
        from: "admin",
        content:
          "Thank you for reporting this listing. We are investigating the property and will take appropriate action if fraud is confirmed.",
        timestamp: "2024-01-14 16:45",
      },
    ],
  },
]

export default function CommsPage() {
  const [activeTab, setActiveTab] = useState("comments")
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [selectedComment, setSelectedComment] = useState<any>(null)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [pageTypeFilter, setPageTypeFilter] = useState("all")
  const [messageStatusFilter, setMessageStatusFilter] = useState("all")
  const [showCommentDetail, setShowCommentDetail] = useState(false)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [sendEmail, setSendEmail] = useState(false)
  const [messages, setMessages] = useState(mockMessages)
  const { toast } = useToast()

  const filteredComments = mockComments.filter((comment) => {
    const matchesSearch =
      searchQuery === "" ||
      comment.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.userEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || comment.status.toLowerCase() === statusFilter
    const matchesPageType = pageTypeFilter === "all" || comment.pageType.toLowerCase() === pageTypeFilter

    return matchesSearch && matchesStatus && matchesPageType
  })

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      searchQuery === "" ||
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = messageStatusFilter === "all" || message.status.toLowerCase() === messageStatusFilter

    return matchesSearch && matchesStatus
  })

  const handleCommentAction = (action: string, commentId: string) => {
    toast({
      title: "Action completed",
      description: `Comment ${action} successfully`,
    })
  }

  const handleBatchAction = (action: string) => {
    if (selectedComments.length === 0) {
      toast({
        title: "No comments selected",
        description: "Please select comments to perform batch actions",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Batch action completed",
      description: `${selectedComments.length} comments ${action}`,
    })
    setSelectedComments([])
  }

  const handleMessageAction = (action: string, messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId
          ? { ...message, status: action === "resolved" ? "Resolved" : action === "open" ? "Open" : message.status }
          : message,
      ),
    )

    toast({
      title: "Message updated",
      description: `Message marked as ${action}`,
    })
  }

  const openCommentDetail = (comment: any) => {
    setSelectedComment(comment)
    setShowCommentDetail(true)
  }

  const openMessageDetail = (message: any) => {
    setSelectedMessage(message)
    setShowMessageDetail(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      hidden: "outline",
      deleted: "destructive",
    }
    return <Badge variant={variants[status.toLowerCase()] || "secondary"}>{status}</Badge>
  }

  const getMessageStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      new: "destructive",
      open: "secondary",
      resolved: "default",
    }
    return <Badge variant={variants[status.toLowerCase()] || "secondary"}>{status}</Badge>
  }

  const handleDeleteConfirmation = () => {
    handleBatchAction("deleted")
    setShowDeleteConfirmation(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comms & Moderation</h1>
          <p className="text-gray-600">Manage comments and contact messages</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({mockComments.length})
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Inbox ({messages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="space-y-4">
          {/* Comments Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search comments, users, or emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={pageTypeFilter} onValueChange={setPageTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Page Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deal">Deals</SelectItem>
                    <SelectItem value="resource">Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Batch Actions */}
          {selectedComments.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {selectedComments.length} comment{selectedComments.length !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleBatchAction("approved")}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBatchAction("hidden")}>
                      <Eye className="h-4 w-4 mr-1" />
                      Hide
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedComments(filteredComments.map((c) => c.id))
                            } else {
                              setSelectedComments([])
                            }
                          }}
                        />
                      </th>
                      <th className="p-4 text-left font-medium">Date</th>
                      <th className="p-4 text-left font-medium">Page</th>
                      <th className="p-4 text-left font-medium">User</th>
                      <th className="p-4 text-left font-medium">Comment</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComments.map((comment) => (
                      <tr key={comment.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedComments.includes(comment.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedComments([...selectedComments, comment.id])
                              } else {
                                setSelectedComments(selectedComments.filter((id) => id !== comment.id))
                              }
                            }}
                          />
                        </td>
                        <td className="p-4 text-sm text-gray-600">{comment.date}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{comment.pageType}</Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{comment.userName}</div>
                            <div className="text-sm text-gray-600">{comment.userEmail}</div>
                          </div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-sm truncate">{comment.comment.substring(0, 120)}...</span>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(comment.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openCommentDetail(comment)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCommentAction("approved", comment.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
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
                <Select value={messageStatusFilter} onValueChange={setMessageStatusFilter}>
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
                          message.status.toLowerCase() === "resolved" ? "bg-green-50 opacity-75" : ""
                        }`}
                      >
                        <td className="p-4 text-sm text-gray-600">{message.date}</td>
                        <td className="p-4">
                          <Badge variant={message.type === "Report" ? "destructive" : "default"}>{message.type}</Badge>
                        </td>
                        <td className="p-4 font-medium">{message.name}</td>
                        <td className="p-4 text-sm text-gray-600">{message.email}</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{message.subject}</div>
                            <div className="text-sm text-gray-600">{message.preview}</div>
                          </div>
                        </td>
                        <td className="p-4">{getMessageStatusBadge(message.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openMessageDetail(message)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleMessageAction("open", message.id)}>
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMessageAction("resolved", message.id)}
                              className={message.status.toLowerCase() === "resolved" ? "text-green-600" : ""}
                            >
                              <CheckCircle
                                className={`h-4 w-4 ${message.status.toLowerCase() === "resolved" ? "fill-green-600" : ""}`}
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
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to delete {selectedComments.length} comment
              {selectedComments.length !== 1 ? "s" : ""}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirmation}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Comments
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment Detail Dialog */}
      <Dialog open={showCommentDetail} onOpenChange={setShowCommentDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comment Details</DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-6">
              {/* Comment ID and deep link URL for quick navigation */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Comment ID</Label>
                  <div className="flex items-center gap-2">
                    <p className="font-mono">#{selectedComment.id}</p>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Deep Link URL</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-blue-600 truncate">
                      /{selectedComment.pageType.toLowerCase()}s/
                      {selectedComment.pageTitle.toLowerCase().replace(/\s+/g, "-")}#comment-{selectedComment.id}
                    </p>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comment Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">User</Label>
                  <p>
                    {selectedComment.userName} ({selectedComment.userEmail})
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Joined Date</Label>
                  <p>{selectedComment.joinedDate}</p>
                </div>
                <div>
                  <Label className="font-medium">Page</Label>
                  <div className="flex items-center gap-2">
                    <p>
                      {selectedComment.pageType}: {selectedComment.pageTitle}
                    </p>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">IP Address</Label>
                  <p className="font-mono">{selectedComment.ip}</p>
                </div>
                {/* Source URL for quick access to the original content */}
              </div>

              {/* Comment Text */}
              <div className="space-y-2">
                <Label>Comment</Label>
                <div className="p-3 border rounded-md bg-gray-50 text-sm">{selectedComment.comment}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => handleCommentAction("approved", selectedComment.id)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>

              {/* Reply Section */}
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="reply-text">Reply as LinkEnlist</Label>
                <Textarea
                  id="reply-text"
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <Button size="sm">
                  <Reply className="h-4 w-4 mr-1" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Detail Dialog */}
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
                  <p>{getMessageStatusBadge(selectedMessage.status)}</p>
                </div>
              </div>

              {/* Reported Listing Info for Report type messages */}
              {selectedMessage.type === "Report" && (
                <div className="border rounded-lg p-4 bg-red-50">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <Label className="font-medium text-red-800">Reported By</Label>
                      <p className="font-medium">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <Label className="font-medium text-red-800">Reported Listing</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-blue-600">1234 Marine Dr, Oceanside, CA 92057</p>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">View listing: /realestate?listing=mbo1523970</p>
                    </div>
                    <div>
                      <Label className="font-medium text-red-800">Report Type</Label>
                      <Badge variant="destructive">Fraudulent Listing</Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Thread */}
              <div className="space-y-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
                {selectedMessage.thread.map((msg: any) => (
                  <div key={msg.id} className={`p-3 rounded ${msg.from === "user" ? "bg-gray-50" : "bg-blue-50"}`}>
                    <div className="text-sm text-gray-600 mb-1">
                      {msg.from === "user" ? selectedMessage.name : "LinkEnlist Admin"} - {msg.timestamp}
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
                    <Checkbox id="send-email" checked={sendEmail} onCheckedChange={setSendEmail} />
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
    </div>
  )
}
