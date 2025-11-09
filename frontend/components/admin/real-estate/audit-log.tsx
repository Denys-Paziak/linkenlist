"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Edit, Clock, Star, EyeOff, Users, Copy, FileText } from "lucide-react"

interface AuditLogEntry {
  id: string
  timestamp: string
  action: string
  performedBy: string
  performedById: string
  listingId: string
  listingTitle: string
  details: any
  previousState?: any
  newState?: any
  notes?: string
  ipAddress?: string
  userAgent?: string
}

interface AuditLogProps {
  listingId?: string
  showAllListings?: boolean
}

export function AuditLog({ listingId, showAllListings = false }: AuditLogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null)

  // Mock audit log data
  const mockAuditLog: AuditLogEntry[] = [
    {
      id: "audit_001",
      timestamp: "2024-01-15T14:30:00Z",
      action: "approved",
      performedBy: "Admin User",
      performedById: "admin_123",
      listingId: "1",
      listingTitle: "Beautiful 3BR Home Near Fort Bragg",
      details: {
        reason: "All requirements met",
        notifyOwner: true,
      },
      previousState: { status: "pending" },
      newState: { status: "approved", approvedAt: "2024-01-15T14:30:00Z" },
      notes: "Listing meets all quality standards",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
    },
    {
      id: "audit_002",
      timestamp: "2024-01-14T10:15:00Z",
      action: "rejected",
      performedBy: "Moderator Jane",
      performedById: "mod_456",
      listingId: "2",
      listingTitle: "Modern 2BR Apartment",
      details: {
        reason: "incomplete-info",
        reasonLabel: "Incomplete Information",
        notes: "Missing interior photos and detailed description",
        allowResubmit: true,
      },
      previousState: { status: "pending" },
      newState: { status: "rejected", rejectedAt: "2024-01-14T10:15:00Z" },
      ipAddress: "192.168.1.101",
    },
    {
      id: "audit_003",
      timestamp: "2024-01-13T16:45:00Z",
      action: "request-edits",
      performedBy: "Admin User",
      performedById: "admin_123",
      listingId: "1",
      listingTitle: "Beautiful 3BR Home Near Fort Bragg",
      details: {
        template: "photos",
        message: "Please add more high-quality photos of the interior spaces.",
        deadline: "7",
      },
      notes: "Owner contacted via email",
      ipAddress: "192.168.1.100",
    },
    {
      id: "audit_004",
      timestamp: "2024-01-12T09:20:00Z",
      action: "featured",
      performedBy: "Marketing Team",
      performedById: "marketing_789",
      listingId: "3",
      listingTitle: "Spacious 4BR Family Home",
      details: {
        duration: "30",
        notes: "Premium listing promotion",
      },
      previousState: { featured: false },
      newState: { featured: true, featuredUntil: "2024-02-12T09:20:00Z" },
      ipAddress: "192.168.1.102",
    },
    {
      id: "audit_005",
      timestamp: "2024-01-11T13:10:00Z",
      action: "created",
      performedBy: "John Smith",
      performedById: "user_123",
      listingId: "1",
      listingTitle: "Beautiful 3BR Home Near Fort Bragg",
      details: {
        package: "free",
        autoSubmitted: false,
      },
      newState: { status: "pending", createdAt: "2024-01-11T13:10:00Z" },
      ipAddress: "192.168.1.200",
    },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "request-edits":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "featured":
      case "unfeatured":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "expired":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "hidden":
        return <EyeOff className="h-4 w-4 text-gray-600" />
      case "merged":
        return <Copy className="h-4 w-4 text-purple-600" />
      case "impersonated":
        return <Users className="h-4 w-4 text-red-600" />
      case "created":
        return <FileText className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionBadge = (action: string) => {
    const colors = {\
      approved: "bg
