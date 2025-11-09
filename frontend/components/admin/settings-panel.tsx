"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    siteName: "LinkEnlist",
    siteDescription: "Military Resources and Tools Directory",
    contactEmail: "admin@linkenlist.com",
    supportEmail: "support@linkenlist.com",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    moderateSubmissions: true,
    enableAnalytics: true,
    analyticsId: "GA-XXXXXXXXX",
    maxFileSize: "10",
    allowedFileTypes: "pdf,doc,docx,jpg,png",
    emailNotifications: true,
    weeklyReports: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-2">Configure global settings for LinkEnlist.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Site Features */}
        <Card>
          <CardHeader>
            <CardTitle>Site Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: !!checked })}
                />
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: !!checked })}
                />
                <Label htmlFor="allowRegistration">Allow User Registration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: !!checked })}
                />
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="moderateSubmissions"
                  checked={settings.moderateSubmissions}
                  onCheckedChange={(checked) => setSettings({ ...settings, moderateSubmissions: !!checked })}
                />
                <Label htmlFor="moderateSubmissions">Moderate User Submissions</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableAnalytics"
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: !!checked })}
              />
              <Label htmlFor="enableAnalytics">Enable Google Analytics</Label>
            </div>
            {settings.enableAnalytics && (
              <div>
                <Label htmlFor="analyticsId">Analytics ID</Label>
                <Input
                  id="analyticsId"
                  value={settings.analyticsId}
                  onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
                  placeholder="GA-XXXXXXXXX"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Upload Settings */}
        <Card>
          <CardHeader>
            <CardTitle>File Upload Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Select
                value={settings.maxFileSize}
                onValueChange={(value) => setSettings({ ...settings, maxFileSize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 MB</SelectItem>
                  <SelectItem value="10">10 MB</SelectItem>
                  <SelectItem value="25">25 MB</SelectItem>
                  <SelectItem value="50">50 MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
                placeholder="pdf,doc,docx,jpg,png"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button className="bg-primary hover:bg-primary/90">Save Settings</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  )
}
