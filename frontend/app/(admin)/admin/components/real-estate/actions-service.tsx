"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, XCircle, Edit, Clock, Star, EyeOff, Users, Copy } from "lucide-react"

interface ActionsServiceProps {
  selectedListings: string[]
  onActionComplete: (action: string, listingIds: string[], result: any) => void
  onClose: () => void
}

interface ActionDialog {
  type: string
  title: string
  isOpen: boolean
  isBulk: boolean
  listingIds: string[]
}

export function ActionsService({ selectedListings, onActionComplete, onClose }: ActionsServiceProps) {
  const [currentDialog, setCurrentDialog] = useState<ActionDialog | null>(null)
  const [actionData, setActionData] = useState<any>({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Canned rejection reasons
  const rejectionReasons = [
    { value: "incomplete-info", label: "Incomplete Information", description: "Missing required details or photos" },
    { value: "inappropriate-content", label: "Inappropriate Content", description: "Violates content guidelines" },
    { value: "duplicate", label: "Duplicate Listing", description: "Already exists in the system" },
    { value: "pricing-issues", label: "Pricing Issues", description: "Unrealistic or incorrect pricing" },
    { value: "policy-violation", label: "Policy Violation", description: "Violates platform policies" },
    { value: "fair-housing", label: "Fair Housing Violation", description: "Contains discriminatory language" },
    { value: "spam", label: "Spam/Fraudulent", description: "Appears to be spam or fraudulent" },
    { value: "location-mismatch", label: "Location Mismatch", description: "Address doesn't match military base area" },
    { value: "poor-quality", label: "Poor Quality", description: "Low quality photos or description" },
    { value: "other", label: "Other", description: "Custom reason (please specify)" },
  ]

  // Edit request templates
  const editRequestTemplates = [
    {
      value: "photos",
      label: "Photo Issues",
      template:
        "Please update the photos for this listing:\n• Add more high-quality images\n• Ensure photos are well-lit and clear\n• Include exterior and interior shots",
    },
    {
      value: "description",
      label: "Description Issues",
      template:
        "Please improve the listing description:\n• Add more details about the property\n• Include information about nearby amenities\n• Mention military-friendly features",
    },
    {
      value: "pricing",
      label: "Pricing Clarification",
      template:
        "Please clarify the pricing information:\n• Verify the listed price is accurate\n• Include any additional fees (HOA, utilities)\n• Specify if utilities are included",
    },
    {
      value: "compliance",
      label: "Compliance Issues",
      template:
        "Please address the following compliance issues:\n• Remove any potentially discriminatory language\n• Add required SCRA clause for rentals\n• Ensure fair housing compliance",
    },
    {
      value: "location",
      label: "Location Information",
      template:
        "Please verify and update location details:\n• Confirm the address is correct\n• Add distance to nearest military base\n• Include neighborhood information",
    },
    {
      value: "custom",
      label: "Custom Request",
      template: "",
    },
  ]

  const openDialog = (type: string, listingIds: string[]) => {
    const isBulk = listingIds.length > 1
    setCurrentDialog({
      type,
      title: getDialogTitle(type, isBulk),
      isOpen: true,
      isBulk,
      listingIds,
    })
    setActionData({})
  }

  const closeDialog = () => {
    setCurrentDialog(null)
    setActionData({})
    setIsProcessing(false)
  }

  const getDialogTitle = (type: string, isBulk: boolean) => {
    const suffix = isBulk ? " Listings" : " Listing"
    switch (type) {
      case "approve":
        return `Approve${suffix}`
      case "reject":
        return `Reject${suffix}`
      case "request-edits":
        return `Request Edits for${suffix}`
      case "feature":
        return `Feature${suffix}`
      case "unfeature":
        return `Unfeature${suffix}`
      case "expire":
        return `Expire${suffix}`
      case "hide":
        return `Hide${suffix}`
      case "suspend":
        return `Suspend${suffix}`
      case "merge":
        return "Merge Duplicate Listings"
      case "impersonate":
        return "Impersonate Owner"
      default:
        return `Action${suffix}`
    }
  }

  const handleAction = async () => {
    if (!currentDialog) return

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = {
        action: currentDialog.type,
        listingIds: currentDialog.listingIds,
        data: actionData,
        timestamp: new Date().toISOString(),
        success: true,
      }

      // Log the action for audit trail
      console.log(`[v0] Action executed:`, result)

      onActionComplete(currentDialog.type, currentDialog.listingIds, result)
      closeDialog()
    } catch (error) {
      console.error(`[v0] Action failed:`, error)
      setIsProcessing(false)
    }
  }

  const renderDialogContent = () => {
    if (!currentDialog) return null

    switch (currentDialog.type) {
      case "approve":
        return (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {currentDialog.isBulk
                  ? `You are about to approve ${currentDialog.listingIds.length} listings. They will be published and visible to users.`
                  : "This listing will be approved and published immediately."}
              </AlertDescription>
            </Alert>

            <div>
              <Label>Approval Notes (Optional)</Label>
              <Textarea
                value={actionData.notes || ""}
                onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                placeholder="Add any notes about this approval..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notify-owner"
                checked={actionData.notifyOwner !== false}
                onCheckedChange={(checked) => setActionData({ ...actionData, notifyOwner: checked })}
              />
              <Label htmlFor="notify-owner" className="text-sm">
                Notify listing owner via email
              </Label>
            </div>
          </div>
        )

      case "reject":
        return (
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {currentDialog.isBulk
                  ? `You are about to reject ${currentDialog.listingIds.length} listings. Owners will be notified.`
                  : "This listing will be rejected and the owner will be notified."}
              </AlertDescription>
            </Alert>

            <div>
              <Label>Rejection Reason *</Label>
              <Select
                value={actionData.reason}
                onValueChange={(value) => {
                  const selectedReason = rejectionReasons.find((r) => r.value === value)
                  setActionData({
                    ...actionData,
                    reason: value,
                    reasonLabel: selectedReason?.label,
                    reasonDescription: selectedReason?.description,
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a rejection reason..." />
                </SelectTrigger>
                <SelectContent>
                  {rejectionReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      <div>
                        <p className="font-medium">{reason.label}</p>
                        <p className="text-xs text-gray-500">{reason.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Additional Notes {actionData.reason === "other" && "*"}</Label>
              <Textarea
                value={actionData.notes || ""}
                onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                placeholder={
                  actionData.reason === "other"
                    ? "Please specify the reason for rejection..."
                    : "Provide additional context or specific issues..."
                }
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="allow-resubmit"
                checked={actionData.allowResubmit !== false}
                onCheckedChange={(checked) => setActionData({ ...actionData, allowResubmit: checked })}
              />
              <Label htmlFor="allow-resubmit" className="text-sm">
                Allow owner to resubmit after corrections
              </Label>
            </div>
          </div>
        )

      case "request-edits":
        return (
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Edit className="h-4 w-4" />
              <AlertDescription>
                The listing owner will receive an email with your edit requests and instructions.
              </AlertDescription>
            </Alert>

            <div>
              <Label>Edit Request Type</Label>
              <Select
                value={actionData.template}
                onValueChange={(value) => {
                  const selectedTemplate = editRequestTemplates.find((t) => t.value === value)
                  setActionData({
                    ...actionData,
                    template: value,
                    message: selectedTemplate?.template || "",
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type..." />
                </SelectTrigger>
                <SelectContent>
                  {editRequestTemplates.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Edit Request Message *</Label>
              <Textarea
                value={actionData.message || ""}
                onChange={(e) => setActionData({ ...actionData, message: e.target.value })}
                placeholder="Describe what changes are needed..."
                className="min-h-[120px]"
              />
            </div>

            <div>
              <Label>Response Deadline</Label>
              <Select
                value={actionData.deadline || "7"}
                onValueChange={(value) => setActionData({ ...actionData, deadline: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days (recommended)</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "feature":
      case "unfeature":
        return (
          <div className="space-y-4">
            <Alert className="border-yellow-200 bg-yellow-50">
              <Star className="h-4 w-4" />
              <AlertDescription>
                {currentDialog.type === "feature"
                  ? currentDialog.isBulk
                    ? `${currentDialog.listingIds.length} listings will be featured and appear at the top of search results.`
                    : "This listing will be featured and appear at the top of search results."
                  : currentDialog.isBulk
                    ? `${currentDialog.listingIds.length} listings will be unfeatured and return to normal positioning.`
                    : "This listing will be unfeatured and return to normal positioning."}
              </AlertDescription>
            </Alert>

            {currentDialog.type === "feature" && (
              <div>
                <Label>Feature Duration</Label>
                <Select
                  value={actionData.duration || "30"}
                  onValueChange={(value) => setActionData({ ...actionData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days (recommended)</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={actionData.notes || ""}
                onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                placeholder="Add any notes about this action..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        )

      case "expire":
        return (
          <div className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {currentDialog.isBulk
                  ? `${currentDialog.listingIds.length} listings will be expired and removed from public view.`
                  : "This listing will be expired and removed from public view."}
              </AlertDescription>
            </Alert>

            <div>
              <Label>Expiration Reason</Label>
              <Select
                value={actionData.reason}
                onValueChange={(value) => setActionData({ ...actionData, reason: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time-limit">Time limit reached</SelectItem>
                  <SelectItem value="owner-request">Owner request</SelectItem>
                  <SelectItem value="policy-violation">Policy violation</SelectItem>
                  <SelectItem value="duplicate">Duplicate listing</SelectItem>
                  <SelectItem value="sold-rented">Property sold/rented</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={actionData.notes || ""}
                onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                placeholder="Add any notes about the expiration..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notify-expiration"
                checked={actionData.notifyOwner !== false}
                onCheckedChange={(checked) => setActionData({ ...actionData, notifyOwner: checked })}
              />
              <Label htmlFor="notify-expiration" className="text-sm">
                Notify listing owner
              </Label>
            </div>
          </div>
        )

      case "hide":
        return (
          <div className="space-y-4">
            <Alert className="border-gray-200 bg-gray-50">
              <EyeOff className="h-4 w-4" />
              <AlertDescription>
                {currentDialog.isBulk
                  ? `${currentDialog.listingIds.length} listings will be hidden from public view but remain in the system.`
                  : "This listing will be hidden from public view but remain in the system."}
              </AlertDescription>
            </Alert>

            <div>
              <Label>Hide Reason</Label>
              <Select
                value={actionData.reason}
                onValueChange={(value) => setActionData({ ...actionData, reason: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-review">Under review</SelectItem>
                  <SelectItem value="pending-verification">Pending verification</SelectItem>
                  <SelectItem value="owner-request">Owner request</SelectItem>
                  <SelectItem value="maintenance">System maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={actionData.notes || ""}
                onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                placeholder="Explain why this listing is being hidden..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        )

      case "merge":
        return (
          <div className="space-y-4">
            <Alert className="border-purple-200 bg-purple-50">
              <Copy className="h-4 w-4" />
              <AlertDescription>
                Merge duplicate listings into a single listing. The primary listing will be kept and others will be
                archived.
              </AlertDescription>
            </Alert>

            <div>
              <Label>Primary Listing (to keep)</Label>
              <Select
                value={actionData.primaryListing}
                onValueChange={(value) => setActionData({ ...actionData, primaryListing: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary listing..." />
                </SelectTrigger>
                <SelectContent>
                  {currentDialog.listingIds.map((id) => (
                    <SelectItem key={id} value={id}>
                      Listing {id} - Mock Title
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Merge Notes</Label>
              <Textarea
                value={actionData.notes || ""}
                onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                placeholder="Document the reason for merging and any important details..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notify-affected-owners"
                checked={actionData.notifyOwners !== false}
                onCheckedChange={(checked) => setActionData({ ...actionData, notifyOwners: checked })}
              />
              <Label htmlFor="notify-affected-owners" className="text-sm">
                Notify all affected listing owners
              </Label>
            </div>
          </div>
        )

      case "impersonate":
        return (
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Support Only:</strong> This action allows you to impersonate the listing owner for support
                purposes. Use with extreme caution.
              </AlertDescription>
            </Alert>

            <div>
              <Label>Support Ticket ID *</Label>
              <Input
                value={actionData.ticketId || ""}
                onChange={(e) => setActionData({ ...actionData, ticketId: e.target.value })}
                placeholder="Enter support ticket ID..."
              />
            </div>

            <div>
              <Label>Impersonation Reason *</Label>
              <Textarea
                value={actionData.reason || ""}
                onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                placeholder="Explain why impersonation is necessary..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label>Session Duration</Label>
              <Select
                value={actionData.duration || "30"}
                onValueChange={(value) => setActionData({ ...actionData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <p>Action configuration for {currentDialog.type} is not implemented yet.</p>
          </div>
        )
    }
  }

  const isActionValid = () => {
    if (!currentDialog) return false

    switch (currentDialog.type) {
      case "reject":
        return actionData.reason && (actionData.reason !== "other" || actionData.notes?.trim())
      case "request-edits":
        return actionData.message?.trim()
      case "impersonate":
        return actionData.ticketId?.trim() && actionData.reason?.trim()
      case "merge":
        return actionData.primaryListing
      default:
        return true
    }
  }

  // Public methods for external components to trigger actions
  const triggerAction = (action: string, listingIds: string[]) => {
    openDialog(action, listingIds)
  }

  return (
    <>
      <Dialog open={currentDialog?.isOpen || false} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentDialog?.type === "approve" && <CheckCircle className="h-5 w-5 text-green-600" />}
              {currentDialog?.type === "reject" && <XCircle className="h-5 w-5 text-red-600" />}
              {currentDialog?.type === "request-edits" && <Edit className="h-5 w-5 text-blue-600" />}
              {currentDialog?.type === "feature" && <Star className="h-5 w-5 text-yellow-600" />}
              {currentDialog?.type === "expire" && <Clock className="h-5 w-5 text-orange-600" />}
              {currentDialog?.type === "hide" && <EyeOff className="h-5 w-5 text-gray-600" />}
              {currentDialog?.type === "merge" && <Copy className="h-5 w-5 text-purple-600" />}
              {currentDialog?.type === "impersonate" && <Users className="h-5 w-5 text-red-600" />}
              {currentDialog?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {currentDialog?.isBulk && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-800">
                  Bulk Action: {currentDialog.listingIds.length} listings selected
                </p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {currentDialog.listingIds.map((id) => (
                    <Badge key={id} variant="outline" className="text-xs">
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {renderDialogContent()}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={closeDialog} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleAction} disabled={!isActionValid() || isProcessing}>
                {isProcessing ? "Processing..." : `Confirm ${currentDialog?.type}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Export the trigger function for external use
export const useActionsService = () => {
  const [actionsService, setActionsService] = useState<{
    triggerAction: (action: string, listingIds: string[]) => void
  } | null>(null)

  return {
    ActionsServiceComponent: ActionsService,
    triggerAction: actionsService?.triggerAction,
    setActionsService,
  }
}
