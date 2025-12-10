"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Save,
  Upload,
  FileText,
  AlertCircle,
  DollarSign,
  Monitor,
  Smartphone,
  Calendar,
  ExternalLink,
  Clock,
  Star,
  Search,
  Globe,
  ImageIcon,
  X,
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface ContentEditorProps {
  type: "resource" | "link" | "deal"
  existingContent?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function ContentEditor({ type, existingContent, onSave, onCancel }: ContentEditorProps) {
  const [dealData, setDealData] = useState({
    // Basics
    title: existingContent?.title || "",
    slug: existingContent?.slug || "",
    teaser: existingContent?.teaser || "",
    merchant: existingContent?.merchant || "",
    category: existingContent?.category || "",
    tags: existingContent?.tags || [],
    primaryCTA: {
      label: existingContent?.primaryCTA?.label || "Go to Deal",
      url: existingContent?.primaryCTA?.url || "",
    },
    featuredResource: existingContent?.featuredResource || "",
    showTableOfContents: existingContent?.showTableOfContents ?? true,
    heroImage: existingContent?.heroImage || null,
    heroImageAlt: existingContent?.heroImageAlt || "",
    heroImageFocalPoint: existingContent?.heroImageFocalPoint || "center",

    // Offer Details
    dealType: existingContent?.dealType || "percentage",
    originalPrice: existingContent?.originalPrice || "",
    originalPriceCadence: existingContent?.originalPriceCadence || "month",
    yourPrice: existingContent?.yourPrice || "",
    yourPriceCadence: existingContent?.yourPriceCadence || "month",
    promoCode: existingContent?.promoCode || "",
    promoCodeHint: existingContent?.promoCodeHint || "",
    validFrom: existingContent?.validFrom || "",
    validUntil: existingContent?.validUntil || "",
    isOngoing: existingContent?.isOngoing ?? false,
    providerDisplayName: existingContent?.providerDisplayName || "",

    // Content Blocks
    aboutDeal: existingContent?.aboutDeal || "",
    howToRedeem: existingContent?.howToRedeem || [],
    finePrint: existingContent?.finePrint || "",
    sectionOrder: existingContent?.sectionOrder || ["about", "redeem", "offer"],
    sectionVisibility: existingContent?.sectionVisibility || {
      about: true,
      redeem: true,
      offer: true,
      finePrint: true,
    },

    // Surfacing & Layout
    featureOnHome: existingContent?.featureOnHome ?? false,
    pinInCategory: existingContent?.pinInCategory ?? false,
    relatedDeals: existingContent?.relatedDeals || [],
    autoRelated: existingContent?.autoRelated ?? true,
    showComments: existingContent?.showComments ?? true,

    // QA & Housekeeping
    lastVerified: existingContent?.lastVerified || "",
    reminderDate: existingContent?.reminderDate || "",

    // SEO & Social
    metaTitle: existingContent?.metaTitle || "",
    metaDescription: existingContent?.metaDescription || "",
    ogImage: existingContent?.ogImage || null,
    customOgImage: existingContent?.customOgImage || null,
    ogImageType: existingContent?.ogImageType || "hero", // "hero" or "custom"
    canonicalUrl: existingContent?.canonicalUrl || "",
    allowIndexing: existingContent?.allowIndexing ?? true,

    // Publishing Workflow
    status: existingContent?.status || "draft",
    schedulePublish: existingContent?.schedulePublish || "",
    scheduleExpire: existingContent?.scheduleExpire || "",

    // Comments Moderation
    enableComments: existingContent?.enableComments ?? true,

    // Content Sections
    contentSections: existingContent?.contentSections || [
      {
        id: uuidv4(),
        type: "about",
        name: "About This Deal",
        content: existingContent?.aboutDeal || "",
        visible: existingContent?.sectionVisibility?.about ?? true,
      },
      {
        id: uuidv4(),
        type: "redeem",
        name: "How to Redeem",
        steps: existingContent?.howToRedeem || [],
        visible: existingContent?.sectionVisibility?.redeem ?? true,
      },
      {
        id: uuidv4(),
        type: "finePrint",
        name: "Fine Print",
        content: existingContent?.finePrint || "",
        visible: existingContent?.sectionVisibility?.finePrint ?? true,
      },
    ],
  })

  const [customCategory, setCustomCategory] = useState("")
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [availableResources, setAvailableResources] = useState([
    { id: "military-housing-guide", title: "Military Housing Guide", slug: "military-housing-guide" },
    { id: "pcs-checklist", title: "PCS Checklist", slug: "pcs-checklist" },
    { id: "va-benefits-overview", title: "VA Benefits Overview", slug: "va-benefits-overview" },
    { id: "deployment-prep", title: "Deployment Preparation Guide", slug: "deployment-prep" },
    { id: "education-benefits", title: "Education Benefits Guide", slug: "education-benefits" },
  ])

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [activeTab, setActiveTab] = useState("basics")

  const [offerDetailsEnabled, setOfferDetailsEnabled] = useState(true)

  const dealCategories = [
    "Military Discount",
    "Software",
    "Travel",
    "Education",
    "Finance",
    "Health",
    "Shopping",
    "Entertainment",
  ]
  const dealTypes = [
    { value: "percentage", label: "% Off" },
    { value: "fixed", label: "Fixed Price" },
    { value: "amount", label: "Amount Off" },
    { value: "free", label: "Free" },
    { value: "bogo", label: "BOGO" },
  ]
  const cadenceOptions = ["month", "year", "one-time"]
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "review", label: "In Review" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ]

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const calculateSavings = () => {
    const original = Number.parseFloat(dealData.originalPrice) || 0
    const yours = Number.parseFloat(dealData.yourPrice) || 0

    if (dealData.dealType === "percentage") {
      return `${original}%`
    } else if (dealData.dealType === "amount") {
      return `$${original}`
    } else if (original > 0 && yours > 0) {
      const savings = original - yours
      const percentage = Math.round((savings / original) * 100)
      return `$${savings.toFixed(2)} (${percentage}%)`
    }
    return "N/A"
  }

  const addRedemptionStep = (sectionId: string) => {
    setDealData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              steps: [...(section.steps || []), { step: "", icon: "arrow-right" }],
            }
          : section,
      ),
    }))
  }

  const updateRedemptionStep = (sectionId: string, stepIndex: number, field: string, value: string) => {
    setDealData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              steps: section.steps?.map((step, index) => (index === stepIndex ? { ...step, [field]: value } : step)),
            }
          : section,
      ),
    }))
  }

  const removeRedemptionStep = (sectionId: string, stepIndex: number) => {
    setDealData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              steps: section.steps?.filter((_, i) => i !== stepIndex),
            }
          : section,
      ),
    }))
  }

  const handleTagAdd = (tag: string) => {
    if (tag && !dealData.tags.includes(tag)) {
      setDealData({ ...dealData, tags: [...dealData.tags, tag] })
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setDealData({ ...dealData, tags: dealData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const addCustomSection = () => {
    setDealData((prev) => ({
      ...prev,
      contentSections: [
        ...prev.contentSections,
        {
          id: uuidv4(),
          type: "custom",
          name: "New Section",
          content: "",
          visible: true,
        },
      ],
    }))
  }

  const removeSection = (sectionId: string) => {
    setDealData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.filter((section) => section.id !== sectionId),
    }))
  }

  const updateSectionName = (sectionId: string, name: string) => {
    setDealData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.map((section) =>
        section.id === sectionId ? { ...section, name } : section,
      ),
    }))
  }

  const updateSectionVisibility = (sectionId: string, visible: boolean) => {
    setDealData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.map((section) =>
        section.id === sectionId ? { ...section, visible } : section,
      ),
    }))
  }

  const updateSectionContent = (sectionId: string, content: string) => {
    setDealData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.map((section) =>
        section.id === sectionId ? { ...section, content } : section,
      ),
    }))
  }

  const moveSectionUp = (index: number) => {
    if (index > 0) {
      const newSections = [...dealData.contentSections]
      ;[newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]]
      setDealData((prev) => ({ ...prev, contentSections: newSections }))
    }
  }

  const moveSectionDown = (index: number) => {
    if (index < dealData.contentSections.length - 1) {
      const newSections = [...dealData.contentSections]
      ;[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
      setDealData((prev) => ({ ...prev, contentSections: newSections }))
    }
  }

  const handleCustomOgImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create a preview URL for the uploaded image
      const imageUrl = URL.createObjectURL(file)
      setDealData({
        ...dealData,
        customOgImage: imageUrl,
        ogImageType: "custom",
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Article Editor</h1>
          <p className="text-gray-600 mt-1">Create comprehensive deal articles with structured content</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
          <div className="flex border rounded-lg">
            <Button
              variant={previewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="offer">Offer Details</TabsTrigger>
          <TabsTrigger value="content">Content Blocks</TabsTrigger>
          <TabsTrigger value="surfacing">Surfacing</TabsTrigger>
          <TabsTrigger value="qa">QA</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        {/* Basics Tab */}
        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Image Upload */}
              <div>
                <Label>Hero Image *</Label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload hero image</p>
                    <p className="text-xs text-gray-500">Recommended: 1200x630px, PNG/JPG up to 5MB</p>
                    <Button variant="outline" className="mt-4 bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  {dealData.heroImage && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="heroImageAlt">Alt Text *</Label>
                        <Input
                          id="heroImageAlt"
                          value={dealData.heroImageAlt}
                          onChange={(e) => setDealData({ ...dealData, heroImageAlt: e.target.value })}
                          placeholder="Describe the image for accessibility"
                        />
                      </div>
                      <div>
                        <Label htmlFor="focalPoint">Focal Point</Label>
                        <Select
                          value={dealData.heroImageFocalPoint}
                          onValueChange={(value) => setDealData({ ...dealData, heroImageFocalPoint: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Deal Title *</Label>
                  <Input
                    id="title"
                    value={dealData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value
                      setDealData((prev) => ({
                        ...prev,
                        title: newTitle,
                        slug: prev.slug || generateSlug(newTitle),
                        metaTitle: prev.metaTitle || newTitle,
                      }))
                    }}
                    placeholder="Enter deal title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">linkenlist.com/deals/</span>
                    <Input
                      id="slug"
                      value={dealData.slug}
                      onChange={(e) => setDealData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-slug"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="teaser">Teaser / Subtitle</Label>
                <Textarea
                  id="teaser"
                  value={dealData.teaser}
                  onChange={(e) => setDealData({ ...dealData, teaser: e.target.value })}
                  placeholder="1-2 lines under title (used for deal card generation)"
                  rows={2}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">{dealData.teaser.length}/200 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={showCustomCategory ? "other" : dealData.category}
                    onValueChange={(value) => {
                      if (value === "other") {
                        setShowCustomCategory(true)
                        setDealData((prev) => ({ ...prev, category: "" }))
                      } else {
                        setShowCustomCategory(false)
                        setDealData((prev) => ({ ...prev, category: value }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dealCategories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, "-")}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomCategory && (
                    <Input
                      className="mt-2"
                      value={dealData.category}
                      onChange={(e) => setDealData((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Enter custom category"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Tags/Badges */}
              <div>
                <Label>Tags / Badges</Label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {dealData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button onClick={() => handleTagRemove(tag)} className="ml-1 hover:text-red-600">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag (e.g., '60% OFF', 'Popular', 'Verified')"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleTagAdd(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <div className="flex gap-1">
                      {["60% OFF", "Popular", "Verified", "Free"].map((quickTag) => (
                        <Button
                          key={quickTag}
                          variant="outline"
                          size="sm"
                          onClick={() => handleTagAdd(quickTag)}
                          disabled={dealData.tags.includes(quickTag)}
                        >
                          {quickTag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <div>
                <Label>Primary Call-to-Action</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ctaLabel">Button Label</Label>
                    <Input
                      id="ctaLabel"
                      value={dealData.primaryCTA.label}
                      onChange={(e) =>
                        setDealData({
                          ...dealData,
                          primaryCTA: { ...dealData.primaryCTA, label: e.target.value },
                        })
                      }
                      placeholder="Go to Deal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaUrl">Outbound URL *</Label>
                    <Input
                      id="ctaUrl"
                      type="url"
                      value={dealData.primaryCTA.url}
                      onChange={(e) =>
                        setDealData({
                          ...dealData,
                          primaryCTA: { ...dealData.primaryCTA, url: e.target.value },
                        })
                      }
                      placeholder="https://example.com/deal"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Resource & TOC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="featuredResource">Featured Resource</Label>
                  <div className="flex gap-2">
                    <Input
                      value={
                        dealData.featuredResource
                          ? availableResources.find((r) => r.id === dealData.featuredResource)?.title ||
                            dealData.featuredResource
                          : ""
                      }
                      placeholder="Select from /resources directory"
                      readOnly
                      className="cursor-pointer"
                      onClick={() => setShowResourceModal(true)}
                    />
                    <Button type="button" variant="outline" onClick={() => setShowResourceModal(true)}>
                      Browse
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="showTOC"
                    checked={dealData.showTableOfContents}
                    onCheckedChange={(checked) => setDealData({ ...dealData, showTableOfContents: checked })}
                  />
                  <Label htmlFor="showTOC">Show Table of Contents</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offer Details Tab */}
        <TabsContent value="offer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Offer Details
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="offer-details-toggle" className="text-sm text-gray-600">
                    Enable Section
                  </label>
                  <Switch
                    id="offer-details-toggle"
                    checked={offerDetailsEnabled}
                    onCheckedChange={setOfferDetailsEnabled}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            {offerDetailsEnabled && (
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="dealType">Deal Type *</Label>
                  <Select
                    value={dealData.dealType}
                    onValueChange={(value) => setDealData({ ...dealData, dealType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dealTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <div className="flex gap-2">
                      <Input
                        id="originalPrice"
                        value={dealData.originalPrice}
                        onChange={(e) => setDealData({ ...dealData, originalPrice: e.target.value })}
                        placeholder={dealData.dealType === "percentage" ? "50" : "99.99"}
                      />
                      <Select
                        value={dealData.originalPriceCadence}
                        onValueChange={(value) => setDealData({ ...dealData, originalPriceCadence: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cadenceOptions.map((cadence) => (
                            <SelectItem key={cadence} value={cadence}>
                              {cadence}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="yourPrice">Your Price</Label>
                    <div className="flex gap-2">
                      <Input
                        id="yourPrice"
                        value={dealData.yourPrice}
                        onChange={(e) => setDealData({ ...dealData, yourPrice: e.target.value })}
                        placeholder={dealData.dealType === "free" ? "0" : "49.99"}
                      />
                      <Select
                        value={dealData.yourPriceCadence}
                        onValueChange={(value) => setDealData({ ...dealData, yourPriceCadence: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cadenceOptions.map((cadence) => (
                            <SelectItem key={cadence} value={cadence}>
                              {cadence}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700">Savings Preview</Label>
                  <p className="text-lg font-bold text-green-600">{calculateSavings()}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="promoCode">Promo Code (optional)</Label>
                    <Input
                      id="promoCode"
                      value={dealData.promoCode}
                      onChange={(e) => setDealData({ ...dealData, promoCode: e.target.value })}
                      placeholder="MILITARY50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="promoCodeHint">Where to Enter Code</Label>
                    <Input
                      id="promoCodeHint"
                      value={dealData.promoCodeHint}
                      onChange={(e) => setDealData({ ...dealData, promoCodeHint: e.target.value })}
                      placeholder="At checkout, in the promo code field"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="isOngoing"
                      checked={dealData.isOngoing}
                      onCheckedChange={(checked) => setDealData({ ...dealData, isOngoing: checked })}
                    />
                    <Label htmlFor="isOngoing">Ongoing Offer (no expiration)</Label>
                  </div>

                  {!dealData.isOngoing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="validFrom">Valid From</Label>
                        <Input
                          id="validFrom"
                          type="date"
                          value={dealData.validFrom}
                          onChange={(e) => setDealData({ ...dealData, validFrom: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="validUntil">Valid Until</Label>
                        <Input
                          id="validUntil"
                          type="date"
                          value={dealData.validUntil}
                          onChange={(e) => setDealData({ ...dealData, validUntil: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="providerDisplayName">Provider Display Name (override)</Label>
                  <Input
                    id="providerDisplayName"
                    value={dealData.providerDisplayName}
                    onChange={(e) => setDealData({ ...dealData, providerDisplayName: e.target.value })}
                    placeholder="Leave blank to use merchant name"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Content Blocks Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Blocks
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {dealData.contentSections.map((section, index) => (
                <div key={section.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Input
                        value={section.name}
                        onChange={(e) => updateSectionName(section.id, e.target.value)}
                        className="font-medium max-w-xs"
                        placeholder="Section name"
                      />
                      <Switch
                        checked={section.visible}
                        onCheckedChange={(checked) => updateSectionVisibility(section.id, checked)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => moveSectionUp(index)} disabled={index === 0}>
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveSectionDown(index)}
                        disabled={index === dealData.contentSections.length - 1}
                      >
                        ↓
                      </Button>
                      {section.type === "custom" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {section.type === "about" && (
                    <Textarea
                      value={section.content}
                      onChange={(e) => updateSectionContent(section.id, e.target.value)}
                      placeholder="Rich text content about the deal (supports H2/H3, links, lists)"
                      rows={6}
                      disabled={!section.visible}
                    />
                  )}

                  {section.type === "redeem" && (
                    <div className="space-y-3">
                      {section.steps?.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            {stepIndex + 1}
                          </div>
                          <Input
                            value={step.step}
                            onChange={(e) => updateRedemptionStep(section.id, stepIndex, "step", e.target.value)}
                            placeholder={`Step ${stepIndex + 1}`}
                            className="flex-1"
                            disabled={!section.visible}
                          />
                          <Select
                            value={step.icon}
                            onValueChange={(value) => updateRedemptionStep(section.id, stepIndex, "icon", value)}
                            disabled={!section.visible}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="arrow-right">Arrow</SelectItem>
                              <SelectItem value="click">Click</SelectItem>
                              <SelectItem value="check">Check</SelectItem>
                              <SelectItem value="download">Download</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeRedemptionStep(section.id, stepIndex)}
                            disabled={!section.visible}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => addRedemptionStep(section.id)}
                        disabled={!section.visible}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    </div>
                  )}

                  {(section.type === "finePrint" || section.type === "custom") && (
                    <Textarea
                      value={section.content}
                      onChange={(e) => updateSectionContent(section.id, e.target.value)}
                      placeholder={
                        section.type === "finePrint" ? "Terms, conditions, and exclusions" : "Section content"
                      }
                      rows={4}
                      disabled={!section.visible}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-2">
                <Button variant="outline" onClick={addCustomSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Section
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Surfacing & Layout Tab */}
        <TabsContent value="surfacing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Surfacing & Layout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Related Deals</Label>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoRelated"
                      checked={dealData.autoRelated}
                      onCheckedChange={(checked) => setDealData({ ...dealData, autoRelated: checked })}
                    />
                    <Label htmlFor="autoRelated" className="text-sm">
                      Auto-select
                    </Label>
                  </div>
                </div>
                {!dealData.autoRelated && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Search className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Search and select related deals</p>
                    <Button variant="outline" className="mt-2 bg-transparent">
                      Browse Deals
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showComments"
                  checked={dealData.showComments}
                  onCheckedChange={(checked) => setDealData({ ...dealData, showComments: checked })}
                />
                <Label htmlFor="showComments">Show Comments Section</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* QA & Housekeeping Tab */}
        <TabsContent value="qa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                QA & Housekeeping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="lastVerified">Last Verified Date</Label>
                  <Input
                    id="lastVerified"
                    type="date"
                    value={dealData.lastVerified}
                    onChange={(e) => setDealData({ ...dealData, lastVerified: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="reminderDate">Reminder Date</Label>
                  <Input
                    id="reminderDate"
                    type="date"
                    value={dealData.reminderDate}
                    onChange={(e) => setDealData({ ...dealData, reminderDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify Now
                </Button>
                <Button variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Run Link Check
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Verification Status</h4>
                <p className="text-sm text-yellow-700">
                  This deal was last verified on {dealData.lastVerified || "Never"}.
                  {dealData.reminderDate && ` Next check scheduled for ${dealData.reminderDate}.`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Social Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO & Social
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={dealData.metaTitle}
                  onChange={(e) => setDealData({ ...dealData, metaTitle: e.target.value })}
                  placeholder="SEO title (auto-filled from deal title)"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">{dealData.metaTitle.length}/60 characters</p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={dealData.metaDescription}
                  onChange={(e) => setDealData({ ...dealData, metaDescription: e.target.value })}
                  placeholder="SEO description (auto-filled from teaser)"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">{dealData.metaDescription.length}/160 characters</p>
              </div>

              <div>
                <Label>Open Graph Image</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="ogDefault"
                      name="ogImage"
                      checked={dealData.ogImageType === "hero"}
                      onChange={() => setDealData({ ...dealData, ogImageType: "hero" })}
                    />
                    <Label htmlFor="ogDefault" className="text-sm">
                      Use hero image
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="ogCustom"
                      name="ogImage"
                      checked={dealData.ogImageType === "custom"}
                      onChange={() => setDealData({ ...dealData, ogImageType: "custom" })}
                    />
                    <Label htmlFor="ogCustom" className="text-sm">
                      Upload custom image
                    </Label>
                  </div>

                  {dealData.ogImageType === "custom" && (
                    <div className="ml-6 space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {dealData.customOgImage ? (
                          <div className="space-y-3">
                            <img
                              src={dealData.customOgImage || "/placeholder.svg"}
                              alt="Custom OG Image Preview"
                              className="max-w-full h-32 object-cover mx-auto rounded"
                            />
                            <p className="text-sm text-gray-600">Custom OG image uploaded</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDealData({ ...dealData, customOgImage: null })}
                            >
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Upload custom OG image</p>
                            <p className="text-xs text-gray-500 mb-3">Recommended: 1200x630px, PNG/JPG up to 5MB</p>
                            <label htmlFor="customOgImageUpload">
                              <Button variant="outline" size="sm" className="cursor-pointer bg-transparent" asChild>
                                <span>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Choose File
                                </span>
                              </Button>
                            </label>
                            <input
                              id="customOgImageUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleCustomOgImageUpload}
                              className="hidden"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL (optional)</Label>
                <Input
                  id="canonicalUrl"
                  type="url"
                  value={dealData.canonicalUrl}
                  onChange={(e) => setDealData({ ...dealData, canonicalUrl: e.target.value })}
                  placeholder="https://example.com/canonical-url"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowIndexing"
                  checked={dealData.allowIndexing}
                  onCheckedChange={(checked) => setDealData({ ...dealData, allowIndexing: checked })}
                />
                <Label htmlFor="allowIndexing">Allow search engine indexing</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Publishing Workflow Tab */}
        <TabsContent value="publishing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Publishing Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={dealData.status} onValueChange={(value) => setDealData({ ...dealData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="schedulePublish">Schedule Publish</Label>
                  <Input
                    id="schedulePublish"
                    type="datetime-local"
                    value={dealData.schedulePublish}
                    onChange={(e) => setDealData({ ...dealData, schedulePublish: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduleExpire">Schedule Expire</Label>
                  <Input
                    id="scheduleExpire"
                    type="datetime-local"
                    value={dealData.scheduleExpire}
                    onChange={(e) => setDealData({ ...dealData, scheduleExpire: e.target.value })}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Version History</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Current Draft</span>
                    <span>Just now</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Published Version 1.2</span>
                    <span>2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Initial Version 1.0</span>
                    <span>1 week ago</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableComments"
                  checked={dealData.enableComments}
                  onCheckedChange={(checked) => setDealData({ ...dealData, enableComments: checked })}
                />
                <Label htmlFor="enableComments">Enable Comments for this Deal</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Featured Resource</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowResourceModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {availableResources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setDealData((prev) => ({ ...prev, featuredResource: resource.id }))
                    setShowResourceModal(false)
                  }}
                >
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-sm text-gray-500">/resources/{resource.slug}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDealData((prev) => ({ ...prev, featuredResource: "" }))
                  setShowResourceModal(false)
                }}
              >
                Clear Selection
              </Button>
              <Button variant="outline" onClick={() => setShowResourceModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex gap-3">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Deal
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const slug =
                  dealData.slug ||
                  dealData.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")
                window.open(`/deals/${slug}`, "_blank")
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Live
            </Button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(dealData)}
            className="bg-primary hover:bg-primary/90"
            disabled={!dealData.title || !dealData.primaryCTA.url}
          >
            <Save className="h-4 w-4 mr-2" />
            {dealData.status === "published" ? "Update Deal" : "Save & Publish"}
          </Button>
        </div>
      </div>
    </div>
  )
}
