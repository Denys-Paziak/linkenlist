"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Eye, FileText, Tag } from "lucide-react"

export function AnalyticsPanel() {
  const stats = [
    { title: "Total Page Views", value: "125,432", change: "+12.5%", icon: Eye },
    { title: "Unique Visitors", value: "8,947", change: "+8.2%", icon: Users },
    { title: "Resource Views", value: "89,234", change: "+15.3%", icon: FileText },
    { title: "Deal Clicks", value: "12,567", change: "+22.1%", icon: Tag },
  ]

  const topResources = [
    { name: "Complete PCS Checklist", views: 15420, change: "+5.2%" },
    { name: "VA Disability Claims Guide", views: 12340, change: "+8.1%" },
    { name: "MyPay Portal", views: 8750, change: "+3.4%" },
    { name: "TRICARE Enrollment", views: 7890, change: "+12.3%" },
    { name: "Military Finance Guide", views: 6540, change: "+7.8%" },
  ]

  const topDeals = [
    { name: "Adobe Creative Cloud", clicks: 2340, conversion: "18.5%" },
    { name: "Microsoft Office 365", clicks: 1890, conversion: "22.1%" },
    { name: "Amazon Prime Military", clicks: 1567, conversion: "15.3%" },
    { name: "Spotify Premium", clicks: 1234, conversion: "19.8%" },
    { name: "Nike Military Discount", clicks: 987, conversion: "12.4%" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track performance and user engagement across LinkEnlist.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Top Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topResources.map((resource, index) => (
                <div key={resource.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{resource.name}</p>
                      <p className="text-sm text-gray-500">{resource.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">{resource.change}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Deals */}
        <Card>
          <CardHeader>
            <CardTitle>Top Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDeals.map((deal, index) => (
                <div key={deal.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{deal.name}</p>
                      <p className="text-sm text-gray-500">{deal.clicks.toLocaleString()} clicks</p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600">{deal.conversion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
