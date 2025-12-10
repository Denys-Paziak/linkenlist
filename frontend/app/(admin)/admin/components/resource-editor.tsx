"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  FileText,
  Monitor,
  Smartphone,
  Upload,
  ImageIcon,
  Plus,
  Trash2,
  Globe,
  Calendar,
  Star,
  Search,
  Paperclip,
  X,
} from "lucide-react"

interface ResourceEditorProps {
  existingContent?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function ResourceEditor({ existingContent, onSave, onCancel }: ResourceEditorProps) {
  const [formData, setFormData] = useState({
    // Basic resource fields
    title: existingContent?.title || "",
    slug: existingContent?.slug || "",
    teaser: existingContent?.teaser || "",
    description: existingContent?.description || "",
    category: existingContent?.category || "",
    tags: existingContent?.tags || [],

    // Hero image fields
    heroImage: existingContent?.heroImage || null,
    heroImageAlt: existingContent?.heroImageAlt || "",
    heroImageFocalPoint: existingContent?.heroImageFocalPoint || "center",

    // Primary CTA
    primaryCTA: existingContent?.primaryCTA || { label: "", url: "" },

    // Featured resource and TOC
    featuredResource: existingContent?.featuredResource || "",
    showTableOfContents: existingContent?.showTableOfContents ?? true,

    // Resource-specific content
    content: existingContent?.content || "",
    tableOfContents: existingContent?.tableOfContents ?? true,
    downloadableFiles: existingContent?.downloadableFiles || [],
    externalLinks: existingContent?.externalLinks || [],

    // Content sections (adapted for resources)
    contentSections: existingContent?.contentSections || [
      {
        id: "about",
        type: "about",
        name: "About This Resource",
        content: existingContent?.aboutResource || "",
        visible: true,
        attachedFiles: [], // Added attachedFiles array
      },
      {
        id: "usage",
        type: "usage",
        name: "How to Use",
        content: existingContent?.howToUse || "",
        visible: true,
        attachedFiles: [], // Added attachedFiles array
      },
      {
        id: "additional",
        type: "additional",
        name: "Additional Information",
        content: existingContent?.additionalInfo || "",
        visible: true,
        attachedFiles: [], // Added attachedFiles array
      },
    ],

    // Resource categorization
    resourceType: existingContent?.resourceType || "guide",
    difficulty: existingContent?.difficulty || "beginner",
    estimatedReadTime: existingContent?.estimatedReadTime || "",

    // SEO & Publishing
    metaTitle: existingContent?.metaTitle || "",
    metaDescription: existingContent?.metaDescription || "",
    ogImage: existingContent?.ogImage || null,
    customOgImage: existingContent?.customOgImage || null,
    ogImageType: existingContent?.ogImageType || "hero",
    canonicalUrl: existingContent?.canonicalUrl || "",
    allowIndexing: existingContent?.allowIndexing ?? true,

    // Publishing workflow
    status: existingContent?.status || "draft",
    schedulePublish: existingContent?.schedulePublish || "",
    scheduleExpire: existingContent?.scheduleExpire || "",
    enableComments: existingContent?.enableComments ?? true,

    // Resource-specific surfacing
    featured: existingContent?.featured ?? false,
    relatedResources: existingContent?.relatedResources || [],
    autoRelated: existingContent?.autoRelated ?? true,
    showComments: existingContent?.showComments ?? true,
  })

  const [activeTab, setActiveTab] = useState("basics")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [showResourceBrowser, setShowResourceBrowser] = useState(false)
  const [showDealBrowser, setShowDealBrowser] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedResources, setSelectedResources] = useState<string[]>([]) // Add state for tracking multiple selected resources

  const resourceCategories = ["Software", "Finance", "Military", "Housing", "Travel", "Education", "Health", "Retail"]

  const resourceTypeOptions = [
    { value: "all", label: "All Formats" },
    { value: "guide", label: "Guide" },
    { value: "reference-tool", label: "Reference Tool" },
    { value: "pdf", label: "PDF" },
  ]

  const difficultyLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ]

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "review", label: "Under Review" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ]

  const availableResources = [
    { id: "1", title: "Military Moving Checklist", category: "Military" },
    { id: "2", title: "VA Benefits Guide", category: "Military" },
    { id: "3", title: "Career Transition Worksheet", category: "Education" },
  ]

  const availableDeals = [
    { id: "1", title: "Military Discount at Home Depot", category: "Retail", savings: "10%" },
    { id: "2", title: "USAA Insurance Special Rate", category: "Finance", savings: "$200" },
    { id: "3", title: "Military Travel Deals", category: "Travel", savings: "25%" },
    { id: "4", title: "Education Benefits Program", category: "Education", savings: "$500" },
  ]

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleCustomOgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, customOgImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHeroImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, heroImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
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
    if (files.length > 0) {
      handleHeroImageUpload(files[0])
    }
  }

  const updateSectionContent = (sectionId: string, content: string) => {
    setFormData({
      ...formData,
      contentSections: formData.contentSections.map((section) =>
        section.id === sectionId ? { ...section, content } : section,
      ),
    })
  }

  const updateSectionName = (sectionId: string, name: string) => {
    setFormData({
      ...formData,
      contentSections: formData.contentSections.map((section) =>
        section.id === sectionId ? { ...section, name } : section,
      ),
    })
  }

  const updateSectionVisibility = (sectionId: string, visible: boolean) => {
    setFormData({
      ...formData,
      contentSections: formData.contentSections.map((section) =>
        section.id === sectionId ? { ...section, visible } : section,
      ),
    })
  }

  const addCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      type: "custom",
      name: "Custom Section",
      content: "",
      visible: true,
      attachedFiles: [], // Added attachedFiles array for new sections
    }
    setFormData({
      ...formData,
      contentSections: [...formData.contentSections, newSection],
    })
  }

  const removeSection = (sectionId: string) => {
    setFormData({
      ...formData,
      contentSections: formData.contentSections.filter((section) => section.id !== sectionId),
    })
  }

  const handleFileAttachment = (sectionId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileData = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target?.result as string,
      }

      setFormData({
        ...formData,
        contentSections: formData.contentSections.map((section) =>
          section.id === sectionId
            ? { ...section, attachedFiles: [...(section.attachedFiles || []), fileData] }
            : section,
        ),
      })
    }
    reader.readAsDataURL(file)
  }

  const removeAttachedFile = (sectionId: string, fileId: string) => {
    setFormData({
      ...formData,
      contentSections: formData.contentSections.map((section) =>
        section.id === sectionId
          ? { ...section, attachedFiles: (section.attachedFiles || []).filter((f) => f.id !== fileId) }
          : section,
      ),
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Editor</h1>
          <p className="text-gray-600 mt-1">Create and edit educational resources and guides</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="surfacing">Surfacing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        {/* Basics Tab - Comprehensive resource fields from v140 */}
        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    {formData.heroImage ? (
                      <div
                        className="relative w-full h-48 bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
                        style={{ backgroundImage: `url(${formData.heroImage})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <p className="text-white font-medium">Hero Image Preview</p>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setFormData({ ...formData, heroImage: null })}
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
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleHeroImageUpload(file)
                          }}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                  {formData.heroImage && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="heroImageAlt">Alt Text *</Label>
                        <Input
                          id="heroImageAlt"
                          value={formData.heroImageAlt}
                          onChange={(e) => setFormData({ ...formData, heroImageAlt: e.target.value })}
                          placeholder="Describe the image for accessibility"
                        />
                      </div>
                      <div>
                        <Label htmlFor="focalPoint">Focal Point</Label>
                        <Select
                          value={formData.heroImageFocalPoint}
                          onValueChange={(value) => setFormData({ ...formData, heroImageFocalPoint: value })}
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
                  <Label htmlFor="title">Resource Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value
                      setFormData((prev) => ({
                        ...prev,
                        title: newTitle,
                        slug: prev.slug || generateSlug(newTitle),
                        metaTitle: prev.metaTitle || newTitle,
                      }))
                    }}
                    placeholder="Enter resource title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">linkenlist.com/resources/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-slug"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="teaser">Teaser / Subtitle</Label>
                <Textarea
                  id="teaser"
                  value={formData.teaser}
                  onChange={(e) => setFormData({ ...formData, teaser: e.target.value })}
                  placeholder="1-2 lines under title (used for resource card generation)"
                  rows={2}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">{formData.teaser.length}/200 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={showCustomCategory ? "other" : formData.category}
                    onValueChange={(value) => {
                      if (value === "other") {
                        setShowCustomCategory(true)
                        setFormData((prev) => ({ ...prev, category: "" }))
                      } else {
                        setShowCustomCategory(false)
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceCategories.map((cat) => (
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
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Enter custom category"
                      required
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="resourceType">Resource Type *</Label>
                  <Select
                    value={formData.resourceType}
                    onValueChange={(value) => setFormData({ ...formData, resourceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tags / Badges</Label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
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
                      placeholder="Add tag (e.g., 'Essential', 'Popular', 'Updated')"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleTagAdd(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <div className="flex gap-1">
                      {["Essential", "Popular", "Updated", "Free"].map((quickTag) => (
                        <Button
                          key={quickTag}
                          variant="outline"
                          size="sm"
                          onClick={() => handleTagAdd(quickTag)}
                          disabled={formData.tags.includes(quickTag)}
                        >
                          {quickTag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="featuredDeal">Featured Deal</Label>
                  <div className="flex gap-2">
                    <Input
                      value={
                        formData.featuredResource
                          ? availableDeals.find((d) => d.id === formData.featuredResource)?.title ||
                            formData.featuredResource
                          : ""
                      }
                      placeholder="Select from /deals directory"
                      readOnly
                      className="cursor-pointer"
                      onClick={() => setShowDealBrowser(true)}
                    />
                    <Button type="button" variant="outline" onClick={() => setShowDealBrowser(true)}>
                      Browse
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="showTOC"
                    checked={formData.showTableOfContents}
                    onCheckedChange={(checked) => setFormData({ ...formData, showTableOfContents: checked })}
                  />
                  <Label htmlFor="showTOC">Show Table of Contents</Label>
                </div>
              </div>
            </CardContent>
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
              {formData.contentSections.map((section, index) => (
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

                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSectionContent(section.id, e.target.value)}
                    placeholder={
                      section.type === "about"
                        ? "Rich text content about the resource (supports H2/H3, links, lists)"
                        : section.type === "usage"
                          ? "Instructions on how to use this resource"
                          : section.type === "additional"
                            ? "Additional information, tips, or related content"
                            : "Section content"
                    }
                    rows={6}
                    disabled={!section.visible}
                  />

                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id={`file-upload-${section.id}`}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileAttachment(section.id, file)
                            e.target.value = "" // Reset input
                          }
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
                      <span className="text-xs text-gray-500">PDF, DOC, XLS, images (max 10MB)</span>
                    </div>

                    {/* Display attached files */}
                    {section.attachedFiles && section.attachedFiles.length > 0 && (
                      <div className="space-y-2">
                        {section.attachedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachedFile(section.id, file.id)}
                              className="text-red-600 hover:text-red-700 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured Resource</Label>
              </div>

              <div>
                <Label>Related Resources</Label>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoRelated"
                      checked={formData.autoRelated}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoRelated: checked })}
                    />
                    <Label htmlFor="autoRelated" className="text-sm">
                      Auto-select
                    </Label>
                  </div>
                </div>
                {!formData.autoRelated && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Search className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Search and select related resources</p>
                    <Button
                      variant="outline"
                      className="mt-2 bg-transparent"
                      onClick={() => setShowResourceBrowser(true)}
                    >
                      Browse Resources
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showComments"
                  checked={formData.showComments}
                  onCheckedChange={(checked) => setFormData({ ...formData, showComments: checked })}
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
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title (auto-filled from resource title)"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description (auto-filled from teaser)"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
              </div>

              <div>
                <Label>Open Graph Image</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="ogDefault"
                      name="ogImage"
                      checked={formData.ogImageType === "hero"}
                      onChange={() => setFormData({ ...formData, ogImageType: "hero" })}
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
                      checked={formData.ogImageType === "custom"}
                      onChange={() => setFormData({ ...formData, ogImageType: "custom" })}
                    />
                    <Label htmlFor="ogCustom" className="text-sm">
                      Upload custom image
                    </Label>
                  </div>

                  {formData.ogImageType === "custom" && (
                    <div className="ml-6 space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {formData.customOgImage ? (
                          <div className="space-y-3">
                            <img
                              src={formData.customOgImage || "/placeholder.svg"}
                              alt="Custom OG Image Preview"
                              className="max-w-full h-32 object-cover mx-auto rounded"
                            />
                            <p className="text-sm text-gray-600">Custom OG image uploaded</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData({ ...formData, customOgImage: null })}
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
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://example.com/canonical-url"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowIndexing"
                  checked={formData.allowIndexing}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowIndexing: checked })}
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
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
                    value={formData.schedulePublish}
                    onChange={(e) => setFormData({ ...formData, schedulePublish: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduleExpire">Schedule Expire</Label>
                  <Input
                    id="scheduleExpire"
                    type="datetime-local"
                    value={formData.scheduleExpire}
                    onChange={(e) => setFormData({ ...formData, scheduleExpire: e.target.value })}
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
                    <span>Published Version 1.1</span>
                    <span>3 days ago</span>
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
                  checked={formData.enableComments}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableComments: checked })}
                />
                <Label htmlFor="enableComments">Enable Comments for this Resource</Label>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={() => onSave({ ...formData, status: "draft" })}>
                    Save Draft
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">Preview</Button>
                  <Button onClick={() => onSave({ ...formData, status: "published" })}>Save & Publish</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showResourceBrowser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Browse Resources</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowResourceBrowser(false)}>
                ×
              </Button>
            </div>
            <div className="space-y-3">
              {availableResources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{resource.title}</h4>
                    <a
                      href={`/resources/${resource.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Resource →
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`resource-${resource.id}`}
                      checked={selectedResources.includes(resource.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedResources((prev) => [...prev, resource.id])
                        } else {
                          setSelectedResources((prev) => prev.filter((id) => id !== resource.id))
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`resource-${resource.id}`} className="text-sm font-medium text-gray-700">
                      Select
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center gap-2 mt-6">
              <div className="text-sm text-gray-600">
                {selectedResources.length} resource{selectedResources.length !== 1 ? "s" : ""} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowResourceBrowser(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Handle the selected resources here
                    console.log("Selected resources:", selectedResources)
                    setShowResourceBrowser(false)
                  }}
                  disabled={selectedResources.length === 0}
                >
                  Add Selected ({selectedResources.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDealBrowser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Browse Deals</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDealBrowser(false)}>
                ×
              </Button>
            </div>
            <div className="space-y-3">
              {availableDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{deal.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{deal.category}</span>
                      <span>•</span>
                      <span className="text-green-600 font-medium">Save {deal.savings}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFormData({ ...formData, featuredResource: deal.id })
                      setShowDealBrowser(false)
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowDealBrowser(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
