"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

export function MainPageManager() {
  const [activeTab, setActiveTab] = useState<"hero" | "resources" | "settings">("hero")

  const HeroSection = () => {
    const [heroData, setHeroData] = useState({
      title: "Find direct links to your military websites. Faster.",
      subtitle: "LinkEnlist is independently operated and is not affiliated with the Department of Defense.",
      searchPlaceholder: "Search 300+ official military and DoD tools, logins, and resources…",
      backgroundImage: "",
      showStats: true,
      stats: {
        totalResources: "300+",
        totalDeals: "89",
        activeUsers: "2,847",
      },
    })

    return (
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="heroTitle">Main Title</Label>
            <Input
              id="heroTitle"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              placeholder="Main headline"
            />
          </div>

          <div>
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              placeholder="Supporting text"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="searchPlaceholder">Search Bar Placeholder</Label>
            <Input
              id="searchPlaceholder"
              value={heroData.searchPlaceholder}
              onChange={(e) => setHeroData({ ...heroData, searchPlaceholder: e.target.value })}
              placeholder="Search placeholder text"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showStats"
              checked={heroData.showStats}
              onCheckedChange={(checked) => setHeroData({ ...heroData, showStats: !!checked })}
            />
            <Label htmlFor="showStats">Show Statistics</Label>
          </div>

          {heroData.showStats && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="totalResources">Total Resources</Label>
                <Input
                  id="totalResources"
                  value={heroData.stats.totalResources}
                  onChange={(e) =>
                    setHeroData({
                      ...heroData,
                      stats: { ...heroData.stats, totalResources: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="totalDeals">Total Deals</Label>
                <Input
                  id="totalDeals"
                  value={heroData.stats.totalDeals}
                  onChange={(e) =>
                    setHeroData({
                      ...heroData,
                      stats: { ...heroData.stats, totalDeals: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="activeUsers">Active Users</Label>
                <Input
                  id="activeUsers"
                  value={heroData.stats.activeUsers}
                  onChange={(e) =>
                    setHeroData({
                      ...heroData,
                      stats: { ...heroData.stats, activeUsers: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}

          <Button className="bg-primary hover:bg-primary/90">Update Hero Section</Button>
        </CardContent>
      </Card>
    )
  }

  const ResourceGrid = () => {
    const [gridSettings, setGridSettings] = useState({
      itemsPerPage: 24,
      defaultSort: "newest",
      showFilters: true,
      enableSearch: true,
      categories: ["Army", "Navy", "Air Force", "Marines", "Space Force", "Coast Guard", "VA"],
      displayMode: "grid",
    })

    return (
      <Card>
        <CardHeader>
          <CardTitle>Resource Grid Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="itemsPerPage">Items Per Page</Label>
              <Select
                value={gridSettings.itemsPerPage.toString()}
                onValueChange={(value) => setGridSettings({ ...gridSettings, itemsPerPage: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                  <SelectItem value="96">96</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="defaultSort">Default Sort</Label>
              <Select
                value={gridSettings.defaultSort}
                onValueChange={(value) => setGridSettings({ ...gridSettings, defaultSort: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="category">By Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Display Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showFilters"
                  checked={gridSettings.showFilters}
                  onCheckedChange={(checked) => setGridSettings({ ...gridSettings, showFilters: !!checked })}
                />
                <Label htmlFor="showFilters">Show Filter Options</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableSearch"
                  checked={gridSettings.enableSearch}
                  onCheckedChange={(checked) => setGridSettings({ ...gridSettings, enableSearch: !!checked })}
                />
                <Label htmlFor="enableSearch">Enable Search Bar</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Available Categories</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {gridSettings.categories.map((category) => (
                <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{category}</span>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <Button className="bg-primary hover:bg-primary/90">Update Grid Settings</Button>
        </CardContent>
      </Card>
    )
  }

  const PageSettings = () => {
    const [pageSettings, setPageSettings] = useState({
      seoTitle: "LinkEnlist - Military Resources and Tools Directory",
      seoDescription:
        "Find direct links to official military websites, tools, and resources. Faster access to DoD systems, benefits, and services.",
      seoKeywords: "military, resources, DoD, benefits, tools, links",
      analyticsId: "GA-XXXXXXXXX",
      maintenanceMode: false,
      allowUserRegistration: true,
      requireEmailVerification: true,
      enableComments: false,
      enableRatings: true,
    })

    return (
      <Card>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SEO Settings</h3>
            <div>
              <Label htmlFor="seoTitle">Page Title</Label>
              <Input
                id="seoTitle"
                value={pageSettings.seoTitle}
                onChange={(e) => setPageSettings({ ...pageSettings, seoTitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="seoDescription">Meta Description</Label>
              <Textarea
                id="seoDescription"
                value={pageSettings.seoDescription}
                onChange={(e) => setPageSettings({ ...pageSettings, seoDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="seoKeywords">Keywords (comma-separated)</Label>
              <Input
                id="seoKeywords"
                value={pageSettings.seoKeywords}
                onChange={(e) => setPageSettings({ ...pageSettings, seoKeywords: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Site Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maintenanceMode"
                  checked={pageSettings.maintenanceMode}
                  onCheckedChange={(checked) => setPageSettings({ ...pageSettings, maintenanceMode: !!checked })}
                />
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowUserRegistration"
                  checked={pageSettings.allowUserRegistration}
                  onCheckedChange={(checked) => setPageSettings({ ...pageSettings, allowUserRegistration: !!checked })}
                />
                <Label htmlFor="allowUserRegistration">Allow User Registration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireEmailVerification"
                  checked={pageSettings.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    setPageSettings({ ...pageSettings, requireEmailVerification: !!checked })
                  }
                />
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableRatings"
                  checked={pageSettings.enableRatings}
                  onCheckedChange={(checked) => setPageSettings({ ...pageSettings, enableRatings: !!checked })}
                />
                <Label htmlFor="enableRatings">Enable Resource Ratings</Label>
              </div>
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90">Save Settings</Button>
        </CardContent>
      </Card>
    )
  }

  const tabs = [
    { id: "hero", label: "Hero Section", component: HeroSection },
    { id: "resources", label: "Resource Grid", component: ResourceGrid },
    { id: "settings", label: "Page Settings", component: PageSettings },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || HeroSection

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Main Page Management</h1>
        <p className="text-gray-600 mt-2">Configure the homepage layout, content, and settings.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <ActiveComponent />
    </div>
  )
}
