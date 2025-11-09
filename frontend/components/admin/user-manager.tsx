"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Eye, Shield, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X, AlertTriangle } from "lucide-react"

export function UserManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userStatus, setUserStatus] = useState("")
  const [banLength, setBanLength] = useState("")
  const [banReason, setBanReason] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [sendEmail, setSendEmail] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const mockUsers = [
    {
      id: "1",
      email: "john.smith@military.mil",
      name: "John Smith",
      role: "user",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-01-20",
      favoriteCount: 12,
      submissionCount: 3,
    },
    {
      id: "2",
      email: "admin@linkenlist.com",
      name: "Admin User",
      role: "admin",
      status: "active",
      joinDate: "2023-12-01",
      lastLogin: "2024-01-21",
      favoriteCount: 0,
      submissionCount: 45,
    },
    {
      id: "3",
      email: "sarah.jones@navy.mil",
      name: "Sarah Jones",
      role: "moderator",
      status: "active",
      joinDate: "2024-01-10",
      lastLogin: "2024-01-19",
      favoriteCount: 8,
      submissionCount: 7,
    },
    {
      id: "4",
      email: "mike.wilson@army.mil",
      name: "Mike Wilson",
      role: "user",
      status: "suspended",
      joinDate: "2024-01-05",
      lastLogin: "2024-01-18",
      favoriteCount: 5,
      submissionCount: 1,
    },
  ]

  const handleShieldClick = (user) => {
    setSelectedUser(user)
    setUserStatus(user.status)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    setBanLength("")
    setBanReason("")
    setCustomMessage("")
    setSendEmail(false)
    setShowDeleteConfirm(false)
  }

  const calculateBanEndDate = () => {
    if (!banLength) return ""
    const days = Number.parseInt(banLength)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)
    return endDate.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Join Date</th>
                  <th className="text-left py-3 px-4">Last Login</th>
                  <th className="text-left py-3 px-4">Activity</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : user.role === "moderator" ? "secondary" : "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                    </td>
                    <td className="py-3 px-4">{user.joinDate}</td>
                    <td className="py-3 px-4">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{user.favoriteCount} favorites</div>
                        <div>{user.submissionCount} submissions</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleShieldClick(user)}>
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* User Moderation Modal */}
      {isModalOpen && selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Moderate User: {selectedUser.name}</span>
                <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Left Column: User Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">User Information</h3>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Join Date</Label>
                    <p className="text-sm text-gray-900">{selectedUser.joinDate}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Login</Label>
                    <p className="text-sm text-gray-900">{selectedUser.lastLogin}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                    <Badge variant={selectedUser.status === "active" ? "default" : "destructive"}>
                      {selectedUser.status}
                    </Badge>
                  </div>

                  {(userStatus === "suspended" || userStatus === "banned") && banLength && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Ban Ends In</Label>
                      <p className="text-sm text-gray-900">
                        {banLength} days ({calculateBanEndDate()})
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Total Submissions</Label>
                    <p className="text-sm text-gray-900">{selectedUser.submissionCount}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Total Favorites</Label>
                    <p className="text-sm text-gray-900">{selectedUser.favoriteCount}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Moderator Actions */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Moderator Actions</h3>

                {/* Status Management */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">Status Management</Label>
                  <Select value={userStatus} onValueChange={setUserStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>

                  {(userStatus === "suspended" || userStatus === "banned") && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Ban Length (days)</Label>
                        <Input
                          type="number"
                          value={banLength}
                          onChange={(e) => setBanLength(e.target.value)}
                          placeholder="Enter number of days"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-900">Reason for {userStatus}</Label>
                        <Textarea
                          value={banReason}
                          onChange={(e) => setBanReason(e.target.value)}
                          placeholder="Enter reason for moderation action..."
                          rows={3}
                        />
                      </div>

                      {banLength && <p className="text-sm text-gray-600">Ban ends on: {calculateBanEndDate()}</p>}
                    </div>
                  )}
                </div>

                {/* Password Tools */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">Password Tools</Label>
                  <Button variant="outline" className="w-full bg-transparent">
                    Send Password Reset Email
                  </Button>
                </div>

                {/* Send Notifications */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">Send Notifications</Label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Write a custom message to the user..."
                    rows={3}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch id="send-email" checked={sendEmail} onCheckedChange={setSendEmail} />
                    <Label htmlFor="send-email" className="text-sm">
                      Also send email to user
                    </Label>
                  </div>
                  <Button className="w-full bg-blue-900 hover:bg-blue-800">Send Notification</Button>
                </div>

                {/* View & Moderate Content */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">View & Moderate Content</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Submitted Content
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Comments
                    </Button>
                  </div>
                </div>

                {/* Delete User */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">Danger Zone</Label>
                  {!showDeleteConfirm ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      style={{ backgroundColor: "#E53935" }}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Permanently Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-800">This action cannot be undone!</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant="destructive" className="flex-1" style={{ backgroundColor: "#E53935" }}>
                          Confirm Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button className="bg-blue-900 hover:bg-blue-800 px-8">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
