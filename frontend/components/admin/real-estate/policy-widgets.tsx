"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Shield, AlertCircle, Copy, Users, MapPin, FileText, CheckCircle } from "lucide-react"

interface PolicyWidgetsProps {
  listingData: {
    id: string
    postedById: string
    postedBy: string
    address: string
    freeListingUsed: boolean
    ownershipConflict: boolean
    duplicateWarning: boolean
    type: string
    description: string
    title: string
  }
  onOverride?: (type: string, note: string) => void
}

export function PolicyWidgets({ listingData, onOverride }: PolicyWidgetsProps) {
  const [showOverrideDialog, setShowOverrideDialog] = useState(false)
  const [overrideType, setOverrideType] = useState("")
  const [overrideNote, setOverrideNote] = useState("")
  const [showComplianceDialog, setShowComplianceDialog] = useState(false)

  // Mock data for demonstration
  const userListingHistory = {
    freeListingsUsed: 1,
    totalListings: 3,
    lastFreeListingDate: "2024-01-15",
  }

  const duplicateAddresses = [
    {
      id: "2",
      title: "Cozy 2BR Townhouse",
      postedBy: "Tom Davis",
      status: "active",
      price: "$1,750/month",
    },
  ]

  const ownershipConflicts = [
    {
      userId: "user456",
      userName: "Sarah Johnson",
      conflictType: "Same address, different owner",
      listingId: "2",
    },
  ]

  const complianceIssues = analyzeCompliance(listingData.description, listingData.title)

  const handleOverride = () => {
    if (onOverride && overrideNote.trim()) {
      onOverride(overrideType, overrideNote)
      setShowOverrideDialog(false)
      setOverrideNote("")
      setOverrideType("")
    }
  }

  const openOverrideDialog = (type: string) => {
    setOverrideType(type)
    setShowOverrideDialog(true)
  }

  return (
    <div className="space-y-4">
      {/* Free Listing Policy Widget */}
      <Card className={listingData.freeListingUsed ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4" />
            Free Listing Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                User: {listingData.postedBy} ({listingData.postedById})
              </p>
              <p className="text-xs text-gray-600">
                Free listings used: {userListingHistory.freeListingsUsed}/1 per year
              </p>
              {userListingHistory.lastFreeListingDate && (
                <p className="text-xs text-gray-600">Last free listing: {userListingHistory.lastFreeListingDate}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {listingData.freeListingUsed ? (
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Limit Exceeded
                </Badge>
              ) : (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Within Limit
                </Badge>
              )}
            </div>
          </div>

          {listingData.freeListingUsed && (
            <div className="pt-2 border-t">
              <p className="text-xs text-orange-600 mb-2">
                This user has exceeded their free listing limit. Admin override required.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openOverrideDialog("free-listing")}
                className="text-xs"
              >
                Override Policy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Duplicate Address Warning */}
      {listingData.duplicateWarning && duplicateAddresses.length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Copy className="h-4 w-4" />
              Duplicate Address Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-purple-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{listingData.address}</p>
                <p className="text-xs text-gray-600">{duplicateAddresses.length} other listing(s) at this address</p>
              </div>
            </div>

            <div className="space-y-2">
              {duplicateAddresses.map((duplicate) => (
                <div key={duplicate.id} className="bg-white p-3 rounded border text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{duplicate.title}</p>
                      <p className="text-gray-800">Posted by: {duplicate.postedBy}</p>
                      <p className="text-gray-600">{duplicate.price}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {duplicate.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  Merge Listings
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openOverrideDialog("duplicate-address")}
                  className="text-xs"
                >
                  Allow Duplicate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ownership Conflict Warning */}
      {listingData.ownershipConflict && ownershipConflicts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Ownership Conflict
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {ownershipConflicts.map((conflict, idx) => (
                <div key={idx} className="bg-white p-3 rounded border text-xs">
                  <div className="space-y-1">
                    <p className="font-medium text-red-600">{conflict.conflictType}</p>
                    <p className="text-gray-600">
                      Conflicting user: {conflict.userName} ({conflict.userId})
                    </p>
                    <p className="text-gray-600">Listing ID: {conflict.listingId}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  Investigate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openOverrideDialog("ownership-conflict")}
                  className="text-xs"
                >
                  Resolve Conflict
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Issues */}
      {complianceIssues.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Compliance Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {complianceIssues.map((issue, idx) => (
                <div key={idx} className="bg-white p-3 rounded border text-xs">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600" />
                    <div className="space-y-1">
                      <p className="font-medium">{issue.type}</p>
                      <p className="text-gray-600">{issue.description}</p>
                      {issue.suggestion && <p className="text-blue-600 italic">Suggestion: {issue.suggestion}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t">
              <Button size="sm" variant="outline" onClick={() => setShowComplianceDialog(true)} className="text-xs">
                View Compliance Guidelines
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SCRA Clause for Rentals */}
      {listingData.type.includes("Rent") && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              SCRA Compliance (Rentals)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">SCRA Clause Required</p>
                <p className="text-xs text-gray-600">
                  Rental listings must include Servicemembers Civil Relief Act clause
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="text-xs text-blue-600 bg-white p-2 rounded border">
              <p className="font-medium mb-1">Standard SCRA Clause:</p>
              <p className="italic">
                "In accordance with the Servicemembers Civil Relief Act, military personnel may terminate this lease
                with 30 days written notice if they receive PCS orders or deployment orders of 90 days or more."
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Override Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Policy Override</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-600" />
                <div className="text-sm">
                  <p className="font-medium">Policy Override Required</p>
                  <p className="text-gray-600">
                    You are about to override a system policy. Please provide a detailed justification.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label>Override Type</Label>
              <p className="text-sm text-gray-600 capitalize">{overrideType.replace("-", " ")}</p>
            </div>

            <div>
              <Label>Justification Note *</Label>
              <Textarea
                value={overrideNote}
                onChange={(e) => setOverrideNote(e.target.value)}
                placeholder="Provide a detailed explanation for this policy override..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowOverrideDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleOverride} disabled={!overrideNote.trim()}>
                Apply Override
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Compliance Guidelines Dialog */}
      <Dialog open={showComplianceDialog} onOpenChange={setShowComplianceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fair Housing & Compliance Guidelines</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-2">Prohibited Language</h4>
                <div className="text-xs space-y-1 text-gray-600">
                  <p>• References to race, color, religion, sex, national origin, familial status, or disability</p>
                  <p>• "Adults only", "No children", "Mature individuals"</p>
                  <p>• "Christian home", "Muslim family preferred"</p>
                  <p>• "Perfect for singles", "Ideal for professionals"</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Acceptable Language</h4>
                <div className="text-xs space-y-1 text-gray-600">
                  <p>• "Quiet neighborhood", "Family-friendly community"</p>
                  <p>• "Near schools", "Close to parks"</p>
                  <p>• "Military-friendly", "VA loan accepted"</p>
                  <p>• "Pet-friendly" (with reasonable restrictions)</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Military-Specific Guidelines</h4>
                <div className="text-xs space-y-1 text-gray-600">
                  <p>• SCRA clause required for all rental agreements</p>
                  <p>• BAH/OHA payment acceptance should be clearly stated</p>
                  <p>• PCS-friendly terms and early termination clauses</p>
                  <p>• Security deposit alternatives for military families</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Compliance analysis function
function analyzeCompliance(description: string, title: string) {
  const issues = []
  const text = `${title} ${description}`.toLowerCase()

  // Prohibited phrases
  const prohibitedPhrases = [
    { phrase: "adults only", type: "Fair Housing Violation", suggestion: "Remove age restrictions" },
    { phrase: "no children", type: "Fair Housing Violation", suggestion: "Remove familial status restrictions" },
    { phrase: "christian", type: "Fair Housing Violation", suggestion: "Remove religious references" },
    { phrase: "muslim", type: "Fair Housing Violation", suggestion: "Remove religious references" },
    { phrase: "perfect for singles", type: "Fair Housing Violation", suggestion: "Use neutral language" },
    { phrase: "mature individuals", type: "Fair Housing Violation", suggestion: "Remove age-related language" },
  ]

  // Risky phrases that need review
  const riskyPhrases = [
    { phrase: "quiet", type: "Potentially Discriminatory", suggestion: "Consider if this excludes families" },
    { phrase: "professional", type: "Potentially Discriminatory", suggestion: "May imply income discrimination" },
    { phrase: "executive", type: "Potentially Discriminatory", suggestion: "May imply income discrimination" },
  ]

  prohibitedPhrases.forEach(({ phrase, type, suggestion }) => {
    if (text.includes(phrase)) {
      issues.push({ type, description: `Contains prohibited phrase: "${phrase}"`, suggestion })
    }
  })

  riskyPhrases.forEach(({ phrase, type, suggestion }) => {
    if (text.includes(phrase)) {
      issues.push({ type, description: `Contains potentially risky phrase: "${phrase}"`, suggestion })
    }
  })

  // Missing SCRA clause check would be handled separately for rentals

  return issues
}
