"use client"

import { useState } from "react"
import { Bell, Calendar, Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockNotifications = [
  {
    id: 1,
    type: "system",
    title: "New Military Discount Available",
    message:
      "Adobe Creative Cloud is now offering 60% off for military members. Check out the deals page for more information.",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    type: "system",
    title: "Profile Update Required",
    message: "Please update your profile information to ensure you receive the latest military benefits and discounts.",
    timestamp: "1 day ago",
    isRead: false,
  },
  {
    id: 3,
    type: "system",
    title: "New Resources Added",
    message: "We've added new PCS checklists and military spouse resources to help with your next move.",
    timestamp: "2 days ago",
    isRead: true,
  },
  {
    id: 4,
    type: "system",
    title: "System Maintenance Scheduled",
    message:
      "LinkEnlist will undergo scheduled maintenance on Sunday from 2:00 AM to 4:00 AM EST. Some features may be temporarily unavailable.",
    timestamp: "3 days ago",
    isRead: true,
  },
  {
    id: 5,
    type: "system",
    title: "Welcome to LinkEnlist",
    message: "Thank you for joining LinkEnlist! Explore our resources, deals, and connect with the military community.",
    timestamp: "1 week ago",
    isRead: true,
  },
]

export default function Plug() {
  return null 
}


function NotificationsPage() {
  const [notificationslter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNotification, setSelectedNotification] = useState<(typeof mockNotifications)[0] | null>(null)

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter = filter === "all" || (filter === "unread" && !notification.isRead)

    const matchesSearch =
      searchTerm === "" ||
      notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const openNotification = (notification: (typeof mockNotifications)[0]) => {
    setSelectedNotification(notification)
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
  }

  const closeModal = () => {
    setSelectedNotification(null)
  }

  return (
    <>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with system notifications and important updates</p>
            </div>
          </div>
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            Mark All as Read
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notifications found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white border rounded-lg p-6 transition-all hover:shadow-md cursor-pointer ${
                  !notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : "border-gray-200"
                }`}
                onClick={() => openNotification(notification)}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {notification.timestamp}
                        </p>
                        {!notification.isRead && (
                          <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">New</div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.message.length > 230
                        ? `${notification.message.substring(0, 230)}...`
                        : notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {selectedNotification && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10003] p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-2">{selectedNotification.title}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedNotification.timestamp}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedNotification.message}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
