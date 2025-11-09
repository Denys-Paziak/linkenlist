"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, XCircle, Info, Shield, FileText, Eye, AlertCircle } from "lucide-react"

interface ComplianceCheckerProps {
  title: string
  description: string
  type: string
  onComplianceChange?: (isCompliant: boolean, issues: any[]) => void
}

export function ComplianceChecker({ title, description, type, onComplianceChange }: ComplianceCheckerProps) {
  const [issues, setIssues] = useState<any[]>([])
  const [scraEnabled, setScraEnabled] = useState(type.includes("Rent"))
  const [fairHousingAcknowledged, setFairHousingAcknowledged] = useState(false)

  useEffect(() => {
    const complianceIssues = analyzeCompliance(title, description, type)
    setIssues(complianceIssues)

    const isCompliant = complianceIssues.filter((issue) => issue.severity === "high").length === 0
    onComplianceChange?.(isCompliant, complianceIssues)
  }, [title, description, type, onComplianceChange])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            High Risk
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium Risk
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            <Info className="h-3 w-3 mr-1" />
            Low Risk
          </Badge>
        )
      default:
        return null
    }
  }

  const highRiskIssues = issues.filter((issue) => issue.severity === "high")
  const mediumRiskIssues = issues.filter((issue) => issue.severity === "medium")
  const lowRiskIssues = issues.filter((issue) => issue.severity === "low")

  return (
    <div className="space-y-4">
      {/* Compliance Overview */}
      <Card className={highRiskIssues.length > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{highRiskIssues.length === 0 ? "Compliant" : "Issues Detected"}</p>
              <p className="text-xs text-gray-600">
                {issues.length === 0
                  ? "No compliance issues found"
                  : `${issues.length} issue(s) detected - ${highRiskIssues.length} high risk`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {highRiskIssues.length === 0 ? (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compliant
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Non-Compliant
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Risk Issues */}
      {highRiskIssues.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-red-700">
              <XCircle className="h-4 w-4" />
              Critical Issues ({highRiskIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {highRiskIssues.map((issue, idx) => (
              <Alert key={idx} className="border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{issue.type}</p>
                    <p className="text-xs text-gray-600">{issue.description}</p>
                    {issue.suggestion && <p className="text-xs text-blue-600 italic">Suggestion: {issue.suggestion}</p>}
                    {issue.phrase && <p className="text-xs bg-red-100 px-2 py-1 rounded font-mono">"{issue.phrase}"</p>}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Medium Risk Issues */}
      {mediumRiskIssues.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              Review Recommended ({mediumRiskIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mediumRiskIssues.map((issue, idx) => (
              <Alert key={idx} className="border-yellow-200">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{issue.type}</p>
                    <p className="text-xs text-gray-600">{issue.description}</p>
                    {issue.suggestion && <p className="text-xs text-blue-600 italic">Suggestion: {issue.suggestion}</p>}
                    {issue.phrase && (
                      <p className="text-xs bg-yellow-100 px-2 py-1 rounded font-mono">"{issue.phrase}"</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SCRA Clause for Rentals */}
      {type.includes("Rent") && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              SCRA Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="scra-toggle" className="text-sm font-medium">
                  Include SCRA Clause
                </Label>
                <p className="text-xs text-gray-600">Required for all rental listings</p>
              </div>
              <Switch id="scra-toggle" checked={scraEnabled} onCheckedChange={setScraEnabled} />
            </div>

            {scraEnabled && (
              <div className="text-xs text-blue-700 bg-white p-3 rounded border">
                <p className="font-medium mb-2">Standard SCRA Clause:</p>
                <p className="italic leading-relaxed">
                  "In accordance with the Servicemembers Civil Relief Act (SCRA), active duty military personnel may
                  terminate this lease agreement with thirty (30) days written notice upon receipt of permanent change
                  of station (PCS) orders or deployment orders of ninety (90) days or more."
                </p>
              </div>
            )}

            {!scraEnabled && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  SCRA clause is required for all rental listings. Please enable to ensure compliance.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fair Housing Acknowledgment */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4" />
            Fair Housing Acknowledgment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Switch id="fair-housing" checked={fairHousingAcknowledged} onCheckedChange={setFairHousingAcknowledged} />
            <div className="space-y-1">
              <Label htmlFor="fair-housing" className="text-sm font-medium">
                I acknowledge this listing complies with Fair Housing laws
              </Label>
              <p className="text-xs text-gray-600">
                This listing does not discriminate based on race, color, religion, sex, national origin, familial
                status, or disability.
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p className="font-medium mb-1">Fair Housing Reminder:</p>
            <p>
              All listings must comply with federal, state, and local fair housing laws. Avoid language that could be
              interpreted as discriminatory or preferential toward any protected class.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Low Risk Issues (Collapsible) */}
      {lowRiskIssues.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-blue-700">
              <Info className="h-4 w-4" />
              Informational ({lowRiskIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowRiskIssues.map((issue, idx) => (
              <div key={idx} className="text-xs bg-white p-2 rounded border">
                <p className="font-medium">{issue.type}</p>
                <p className="text-gray-600">{issue.description}</p>
                {issue.suggestion && <p className="text-blue-600 italic">Tip: {issue.suggestion}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Enhanced compliance analysis function
function analyzeCompliance(title: string, description: string, type: string) {
  const issues = []
  const text = `${title} ${description}`.toLowerCase()

  // High-risk prohibited phrases (Fair Housing violations)
  const prohibitedPhrases = [
    {
      phrase: "adults only",
      type: "Fair Housing Violation",
      severity: "high",
      suggestion: "Remove age restrictions - violates familial status protections",
    },
    {
      phrase: "no children",
      type: "Fair Housing Violation",
      severity: "high",
      suggestion: "Remove familial status restrictions",
    },
    {
      phrase: "mature individuals",
      type: "Fair Housing Violation",
      severity: "high",
      suggestion: "Remove age-related language",
    },
    {
      phrase: "christian",
      type: "Fair Housing Violation",
      severity: "high",
      suggestion: "Remove religious references",
    },
    {
      phrase: "muslim",
      type: "Fair Housing Violation",
      severity: "high",
      suggestion: "Remove religious references",
    },
    {
      phrase: "no section 8",
      type: "Fair Housing Violation",
      severity: "high",
      suggestion: "Cannot discriminate against voucher holders in many jurisdictions",
    },
  ]

  // Medium-risk phrases that need review
  const riskyPhrases = [
    {
      phrase: "perfect for singles",
      type: "Potentially Discriminatory",
      severity: "medium",
      suggestion: "May discourage families - use neutral language",
    },
    {
      phrase: "ideal for professionals",
      type: "Potentially Discriminatory",
      severity: "medium",
      suggestion: "May imply income or occupation discrimination",
    },
    {
      phrase: "executive",
      type: "Potentially Discriminatory",
      severity: "medium",
      suggestion: "May imply income discrimination",
    },
    {
      phrase: "upscale",
      type: "Potentially Discriminatory",
      severity: "medium",
      suggestion: "May discourage certain economic groups",
    },
  ]

  // Low-risk informational items
  const informationalPhrases = [
    {
      phrase: "quiet",
      type: "Review Recommended",
      severity: "low",
      suggestion: "Ensure this doesn't discourage families with children",
    },
    {
      phrase: "peaceful",
      type: "Review Recommended",
      severity: "low",
      suggestion: "Generally acceptable but ensure context is appropriate",
    },
  ]

  // Check for prohibited phrases
  prohibitedPhrases.forEach(({ phrase, type, severity, suggestion }) => {
    if (text.includes(phrase)) {
      issues.push({ phrase, type, severity, description: `Contains prohibited phrase: "${phrase}"`, suggestion })
    }
  })

  // Check for risky phrases
  riskyPhrases.forEach(({ phrase, type, severity, suggestion }) => {
    if (text.includes(phrase)) {
      issues.push({
        phrase,
        type,
        severity,
        description: `Contains potentially discriminatory phrase: "${phrase}"`,
        suggestion,
      })
    }
  })

  // Check for informational phrases
  informationalPhrases.forEach(({ phrase, type, severity, suggestion }) => {
    if (text.includes(phrase)) {
      issues.push({ phrase, type, severity, description: `Review recommended for phrase: "${phrase}"`, suggestion })
    }
  })

  // Check for missing required elements
  if (type.includes("Rent")) {
    if (!text.includes("scra") && !text.includes("military") && !text.includes("servicemember")) {
      issues.push({
        type: "Missing SCRA Reference",
        severity: "medium",
        description: "Rental listings should reference SCRA protections for military families",
        suggestion: "Add SCRA clause or mention military-friendly policies",
      })
    }
  }

  // Check for positive military-friendly language
  const militaryFriendlyTerms = ["military", "va loan", "bah", "pcs", "deployment", "servicemember"]
  const hasMilitaryTerms = militaryFriendlyTerms.some((term) => text.includes(term))

  if (!hasMilitaryTerms) {
    issues.push({
      type: "Military-Friendly Enhancement",
      severity: "low",
      description: "Consider adding military-friendly language to attract service members",
      suggestion: "Mention VA loan acceptance, BAH payments, or PCS-friendly terms",
    })
  }

  return issues
}
