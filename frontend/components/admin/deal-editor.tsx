"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  FileText,
  DollarSign,
  Star,
  Globe,
  Calendar,
  ImageIcon,
  Upload,
  Plus,
  Trash2,
  Search,
  X,
  Paperclip,
} from "lucide-react"

interface DealEditorProps {
  existingContent?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function DealEditor({ existingContent, onSave, onCancel }: DealEditorProps) {
  const [dealData, setDealData] = useState({
    // Basic fields
    title: existingContent?.title || "",
    slug: existingContent?.slug || "",
    teaser: existingContent?.teaser || "",
    category: existingContent?.category || "",
    tags: existingContent?.tags || [],
    primaryCta: existingContent?.primaryCta || { label: "", url: "" },
    featuredResource: existingContent?.featuredResource || false,
    tableOfContents: existingContent?.tableOfContents || false,

    // Offer fields
    dealType: existingContent?.dealType || "discount",
    originalPrice: existingContent?.originalPrice || "",
    yourPrice: existingContent?.yourPrice || "",
    priceCadence: existingContent?.priceCadence || "one-time",
    savings: existingContent?.savings || "",
    promoCode: existingContent?.promoCode || "",
    validFrom: existingContent?.validFrom || "",
    validUntil: existingContent?.validUntil || "",
    providerDisplayName: existingContent?.providerDisplayName || "",

    // Content fields
    contentSections: existingContent?.contentSections || [],

    // Surfacing fields
    relatedDeals: existingContent?.relatedDeals || [],
    commentsEnabled: existingContent?.commentsEnabled || true,

    // SEO fields
    metaTitle: existingContent?.metaTitle || "",
    metaDescription: existingContent?.metaDescription || "",
    ogImageType: existingContent?.ogImageType || "auto",
    customOgImage: existingContent?.customOgImage || null,
    canonicalUrl: existingContent?.canonicalUrl || "",
    noIndex: existingContent?.noIndex || false,

    // Publishing fields
    status: existingContent?.status || "draft",
    publishDate: existingContent?.publishDate || "",
    publishTime: existingContent?.publishTime || "",
    versionNotes: existingContent?.versionNotes || "",
    enableComments: existingContent?.enableComments || true,

    // Added for offer details
    originalPriceCadence: existingContent?.originalPriceCadence || "one-time",
    yourPriceCadence: existingContent?.yourPriceCadence || "one-time",
    promoCodeHint: existingContent?.promoCodeHint || "",
    isOngoing: existingContent?.isOngoing || false,

    // Added for surfacing
    autoRelated: existingContent?.autoRelated || false,
    showComments: existingContent?.showComments || true,

    // Added for hero image
    heroImage: existingContent?.heroImage || "",
    heroImageAlt: existingContent?.heroImageAlt || "",
    heroImageFocalPoint: existingContent?.heroImageFocalPoint || "center",

    // Added for SEO
    allowIndexing: existingContent?.allowIndexing !== undefined ? existingContent.allowIndexing : true,
  })

  const [activeTab, setActiveTab] = useState("basics")
  const [isDragging, setIsDragging] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [offerDetailsEnabled, setOfferDetailsEnabled] = useState(true)
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)

  const [showDealsBrowser, setShowDealsBrowser] = useState(false)
  const [selectedRelatedDeals, setSelectedRelatedDeals] = useState<string[]>([])

  const mockDeals = [
    {
      id: "1",
      title: "Military Discount at Target",
      category: "Shopping",
      status: "active",
      primaryCta: { url: "http://example.com/deal1" },
    },
    {
      id: "2",
      title: "Veterans Day Restaurant Deals",
      category: "Food & Dining",
      status: "active",
      primaryCta: { url: "http://example.com/deal2" },
    },
    {
      id: "3",
      title: "Base Housing Discounts",
      category: "Housing",
      status: "active",
      primaryCta: { url: "http://example.com/deal3" },
    },
    {
      id: "4",
      title: "Military Travel Benefits",
      category: "Travel",
      status: "active",
      primaryCta: { url: "http://example.com/deal4" },
    },
    {
      id: "5",
      title: "Education Benefits Guide",
      category: "Education",
      status: "active",
      primaryCta: { url: "http://example.com/deal5" },
    },
  ]

  const dealCategories = ["Software", "Finance", "Military", "Housing", "Travel", "Education", "Health", "Retail"]

  const dealTypes = [
    { value: "percentage", label: "Percentage Off" },
    { value: "fixed", label: "Fixed Amount Off" },
    { value: "special", label: "Special Price" },
    { value: "free", label: "Free Item/Service" },
    { value: "bogo", label: "Buy One Get One" },
  ]

  const cadenceOptions = ["one-time", "month", "year", "week", "day"]

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "review", label: "Under Review" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
    { value: "expired", label: "Expired" },
  ]

  const availableResources = [
    { id: "pcs-guide", title: "Complete PCS Checklist 2024" },
    { id: "military-benefits", title: "Military Benefits Guide" },
    { id: "deployment-prep", title: "Deployment Preparation" },
  ]

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const calculateSavings = () => {
    const original = Number.parseFloat(dealData.originalPrice) || 0
    const your = Number.parseFloat(dealData.yourPrice) || 0
    if (original > 0 && your >= 0) {
      const savings = original - your
      const percentage = Math.round((savings / original) * 100)
      return `Save $${savings.toFixed(2)} (${percentage}% off)`
    }
    return "Enter prices to see savings"
  }

  const handleTagAdd = (tag: string) => {
    if (tag && !dealData.tags.includes(tag)) {
      setDealData({ ...dealData, tags: [...dealData.tags, tag] })
    }
  }

  const handleTagRemove = (tag: string) => {
    setDealData({ ...dealData, tags: dealData.tags.filter((t) => t !== tag) })
  }

  const updateSectionName = (id: string, name: string) => {
    setDealData({
      ...dealData,
      contentSections: dealData.contentSections.map((section) => (section.id === id ? { ...section, name } : section)),
    })
  }

  const updateSectionContent = (id: string, content: string) => {
    setDealData({
      ...dealData,
      contentSections: dealData.contentSections.map((section) =>
        section.id === id ? { ...section, content } : section,
      ),
    })
  }

  const updateSectionVisibility = (id: string, visible: boolean) => {
    setDealData({
      ...dealData,
      contentSections: dealData.contentSections.map((section) =>
        section.id === id ? { ...section, visible } : section,
      ),
    })
  }

  const addRedemptionStep = (sectionId: string) => {
    setDealData({
      ...dealData,
      contentSections: dealData.contentSections.map((section) =>
        section.id === sectionId && section.type === "redeem"
          ? { ...section, steps: [...(section.steps || []), { step: "", icon: "arrow-right" }] }
          : section,
      ),
    })
  }

  const updateRedemptionStep = (sectionId: string, stepIndex: number, field: string, value: string) => {
    setDealData({
      ...dealData,
      contentSections: dealData.contentSections.map((section) =>
        section.id === sectionId && section.type === "redeem"
          ? {
              ...section,
              steps: section.steps?.map((step, index) => (index === stepIndex ? { ...step, [field]: value } : step)),
            }
          : section,
      ),
    })
  }

  const removeRedemptionStep = (sectionId: string, stepIndex: number) => {
    setDealData({
      ...dealData,
      contentSections: dealData.contentSections.map((section) =>
        section.id === sectionId && section.type === "redeem"
          ? { ...section, steps: section.steps?.filter((_, index) => index !== stepIndex) }
          : section,
      ),
    })
  }

  const addCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      name: "Custom Section",
      type: "custom",
      content: "",
      visible: true,
    }
    setDealData({
      ...dealData,
      contentSections: [...dealData.contentSections, newSection],
    })
  }

  const removeSection = (id: string) => {
    setDealData({
      ...dealData,
      contentSections: dealData.contentSections.filter((section) => section.id !== id),
    })
  }

  const moveSectionUp = (index: number) => {
    if (index > 0) {
      const newSections = [...dealData.contentSections]
      ;[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
      setDealData({ ...dealData, contentSections: newSections })
    }
  }

  const moveSectionDown = (index: number) => {
    if (index < dealData.contentSections.length - 1) {
      const newSections = [...dealData.contentSections]
      ;[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
      setDealData({ ...dealData, contentSections: newSections })
    }
  }

  const handleHeroImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDealData({ ...dealData, heroImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCustomOgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDealData({ ...dealData, customOgImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileAttachment = (sectionId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target?.result as string,
      }
      setDealData({
        ...dealData,
        contentSections: dealData.contentSections.map((section) =>
          section.id === sectionId
            ? { ...section, attachedFiles: [...(section.attachedFiles || []), fileData] }
            : section,
        ),
      })
    }
    reader.readAsDataURL(file)
  }

  const removeAttachedFile = (sectionId: string, fileIndex: number) => {
    setDealData({
      ...dealData,
      contentSections: dealData.contentSections.map((section) =>
        section.id === sectionId
          ? { ...section, attachedFiles: section.attachedFiles?.filter((_, index) => index !== fileIndex) }
          : section,
      ),
    })
  }

  const handleSave = () => {
    onSave(dealData)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleHeroImageUpload(files[0])
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Editor</h1>
          <p className="text-gray-600 mt-1">Create and edit deal articles with pricing and offer details</p>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="offer">Offer Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="surfacing">Surfacing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

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
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {dealData.heroImage ? (
                      <div
                        className="relative w-full h-48 bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
                        style={{ backgroundImage: `url(${dealData.heroImage})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <p className="text-white font-medium">Hero Image Preview</p>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setDealData({ ...dealData, heroImage: "", heroImageAlt: "" })}
                              className="bg-white text-gray-900 hover:bg-gray-100"
                            >
                              Remove Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          {isDragging ? "Drop image here" : "Upload hero image"}
                        </p>
                        <p className="text-xs text-gray-500">Recommended: 1200x630px, PNG/JPG up to 5MB</p>
                        <label htmlFor="heroImageUpload">
                          <Button variant="outline" className="mt-4 bg-transparent cursor-pointer" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                            </span>
                          </Button>
                        </label>
                        <input
                          id="heroImageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleHeroImageUpload(file)
                          }}
                        />
                      </>
                    )}
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
                      value={dealData.primaryCta.label}
                      onChange={(e) =>
                        setDealData({
                          ...dealData,
                          primaryCta: { ...dealData.primaryCta, label: e.target.value },
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
                      value={dealData.primaryCta.url}
                      onChange={(e) =>
                        setDealData({
                          ...dealData,
                          primaryCta: { ...dealData.primaryCta, url: e.target.value },
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
                    checked={dealData.tableOfContents}
                    onCheckedChange={(checked) => setDealData({ ...dealData, tableOfContents: checked })}
                  />
                  <Label htmlFor="showTOC">Show Table of Contents</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                    <div className="space-y-3">
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSectionContent(section.id, e.target.value)}
                        placeholder="Rich text content about the deal (supports H2/H3, links, lists)"
                        rows={6}
                        disabled={!section.visible}
                      />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id={`file-upload-${section.id}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileAttachment(section.id, file)
                            }}
                            disabled={!section.visible}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-upload-${section.id}`)?.click()}
                            disabled={!section.visible}
                          >
                            <Paperclip className="h-4 w-4 mr-2" />
                            Attach File
                          </Button>
                          <span className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (max 10MB)</span>
                        </div>

                        {section.attachedFiles && section.attachedFiles.length > 0 && (
                          <div className="space-y-2">
                            {section.attachedFiles.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                              >
                                <div className="flex items-center gap-2">
                                  <Paperclip className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">{file.name}</span>
                                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAttachedFile(section.id, fileIndex)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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
                    <div className="space-y-3">
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSectionContent(section.id, e.target.value)}
                        placeholder={
                          section.type === "finePrint" ? "Terms, conditions, and exclusions" : "Section content"
                        }
                        rows={4}
                        disabled={!section.visible}
                      />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id={`file-upload-${section.id}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileAttachment(section.id, file)
                            }}
                            disabled={!section.visible}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-upload-${section.id}`)?.click()}
                            disabled={!section.visible}
                          >
                            <Paperclip className="h-4 w-4 mr-2" />
                            Attach File
                          </Button>
                          <span className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (max 10MB)</span>
                        </div>

                        {section.attachedFiles && section.attachedFiles.length > 0 && (
                          <div className="space-y-2">
                            {section.attachedFiles.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                              >
                                <div className="flex items-center gap-2">
                                  <Paperclip className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">{file.name}</span>
                                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAttachedFile(section.id, fileIndex)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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
                  <div className="space-y-4">
                    {!showDealsBrowser ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Search className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Search and select related deals</p>
                        <Button
                          variant="outline"
                          className="mt-2 bg-transparent"
                          onClick={() => setShowDealsBrowser(true)}
                        >
                          Browse Deals
                        </Button>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-900">Select Related Deals</h4>
                          <Button variant="ghost" size="sm" onClick={() => setShowDealsBrowser(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {mockDeals.map((deal) => (
                            <div
                              key={deal.id}
                              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  id={`deal-${deal.id}`}
                                  checked={selectedRelatedDeals.includes(deal.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedRelatedDeals([...selectedRelatedDeals, deal.id])
                                    } else {
                                      setSelectedRelatedDeals(selectedRelatedDeals.filter((id) => id !== deal.id))
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <div>
                                  <label
                                    htmlFor={`deal-${deal.id}`}
                                    className="font-medium text-gray-900 cursor-pointer"
                                  >
                                    {deal.title}
                                  </label>
                                  <p className="text-sm text-gray-500">{deal.primaryCta?.url || "No URL set"}</p>
                                </div>
                              </div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {deal.status}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            {selectedRelatedDeals.length} deal{selectedRelatedDeals.length !== 1 ? "s" : ""} selected
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRelatedDeals([])
                                setShowDealsBrowser(false)
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                // Here you would save the selected deals to dealData
                                setDealData({ ...dealData, relatedDeals: selectedRelatedDeals })
                                setShowDealsBrowser(false)
                              }}
                            >
                              Add Selected
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  Save Deal
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
