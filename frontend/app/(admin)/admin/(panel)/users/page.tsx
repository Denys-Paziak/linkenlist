"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Eye, CreditCard, Mail, LogOut, Trash2, CheckCircle, XCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  username?: string // Added username field
  phone?: string
  role: "Renter" | "Owner" | "Agent" | "Admin"
  status: "Active" | "Suspended"
  suspendedUntil?: string
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  joinedDate: string
  lastSeen: string
  listingsCount: number
  freeListingUsed: number
  loginIP?: string
  reportedListings: number
  permissions: {
    bypassReview: boolean
    canFeatureListings: boolean
  }
  listings: Array<{
    id: string
    title: string
    address: string
    type: "Sale" | "Rent"
    plan: "Free" | "Premium"
    status: "Active" | "Pending" | "Expired"
    expires: string
  }>
  activity: Array<{
    id: string
    action: string
    timestamp: string
    note?: string
  }>
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Martinez",
    email: "sarah.martinez@email.com",
    username: "smartinez", // Added username
    phone: "+1 (555) 123-4567",
    role: "Agent",
    status: "Active",
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    joinedDate: "2024-01-15",
    lastSeen: "2024-09-07",
    listingsCount: 12,
    freeListingUsed: 1,
    loginIP: "192.168.1.100",
    reportedListings: 2,
    permissions: {
      bypassReview: false,
      canFeatureListings: true,
    },
    listings: [
      {
        id: "1",
        title: "Beautiful Family Home",
        address: "1234 Marine Dr, Oceanside, CA 92057",
        type: "Sale",
        plan: "Premium",
        status: "Active",
        expires: "2024-12-15",
      },
      {
        id: "2",
        title: "Downtown Apartment",
        address: "567 Main St, San Diego, CA 92101",
        type: "Rent",
        plan: "Free",
        status: "Pending",
        expires: "2024-10-15",
      },
    ],
    activity: [
      { id: "1", action: "Listed new property", timestamp: "2024-09-06 14:30", note: "Beautiful Family Home" },
      { id: "2", action: "Profile updated", timestamp: "2024-09-05 09:15" },
    ],
    companyName: "Martinez Realty",
  },
  {
    id: "2",
    name: "Michael Johnson",
    email: "michael.j@email.com",
    username: "mjohnson", // Added username
    role: "Owner",
    status: "Active",
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: true,
    joinedDate: "2024-02-20",
    lastSeen: "2024-09-06",
    listingsCount: 3,
    freeListingUsed: 0,
    loginIP: "10.0.0.50",
    reportedListings: 0,
    permissions: {
      bypassReview: false,
      canFeatureListings: false,
    },
    listings: [
      {
        id: "3",
        title: "Cozy Studio",
        address: "890 Park Ave, Los Angeles, CA 90210",
        type: "Rent",
        plan: "Free",
        status: "Active",
        expires: "2024-11-20",
      },
    ],
    activity: [{ id: "3", action: "Account created", timestamp: "2024-02-20 10:00" }],
    companyName: "Johnson Properties",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    username: "edavis", // Added username
    role: "Renter",
    status: "Suspended",
    suspendedUntil: "2024-12-15",
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false,
    joinedDate: "2024-03-10",
    lastSeen: "2024-08-15",
    listingsCount: 0,
    freeListingUsed: 0,
    loginIP: "172.16.0.25",
    reportedListings: 1,
    permissions: {
      bypassReview: false,
      canFeatureListings: false,
    },
    listings: [],
    activity: [{ id: "4", action: "Account suspended", timestamp: "2024-08-16 16:45", note: "Policy violation" }],
    companyName: "Davis Rentals",
  },
]

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [verificationFilter, setVerificationFilter] = useState<string>("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isClosingDialog, setIsClosingDialog] = useState(false)
  const pageSize = 25
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const userId = searchParams.get("user")
    if (userId && !isClosingDialog) {
      const user = users.find((u) => u.id === userId)
      if (user) {
        setSelectedUser(user)
      }
    } else if (!userId) {
      setSelectedUser(null)
      setIsClosingDialog(false)
    }
  }, [searchParams, users, isClosingDialog])

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) // Added search by username
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter
        const matchesVerification =
          verificationFilter === "all" ||
          (verificationFilter === "email" && user.emailVerified) ||
          (verificationFilter === "phone" && user.phoneVerified)

        return matchesSearch && matchesRole && matchesStatus && matchesVerification
      })
      setFilteredUsers(filtered)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, roleFilter, statusFilter, verificationFilter, users])

  const openUserDetail = (user: User) => {
    setSelectedUser(user)
    const params = new URLSearchParams(searchParams.toString())
    params.set("user", user.id)
    router.push(`/admin/users?${params.toString()}`)
  }

  const closeUserDetail = () => {
    setIsClosingDialog(true)
    setSelectedUser(null)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("user")
    router.push(`/admin/users${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleBulkAction = (action: "suspend" | "restore") => {
    if (selectedUsers.length === 0) return

    const actionText = action === "suspend" ? "suspend" : "restore"
    const confirmed = window.confirm(`Are you sure you want to ${actionText} ${selectedUsers.length} user(s)?`)

    if (confirmed) {
      setUsers((prev) =>
        prev.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, status: action === "suspend" ? "Suspended" : "Active" } : user,
        ),
      )
      setSelectedUsers([])
      toast({
        title: "Success",
        description: `${selectedUsers.length} user(s) ${action === "suspend" ? "suspended" : "restored"} successfully.`,
      })
    }
  }

  const handleAddUser = (userData: { name: string; email: string; role: User["role"] }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: "Active",
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      joinedDate: new Date().toISOString().split("T")[0],
      lastSeen: "Never",
      listingsCount: 0,
      freeListingUsed: 0,
      loginIP: "",
      reportedListings: 0,
      permissions: {
        bypassReview: false,
        canFeatureListings: false,
      },
      listings: [],
      activity: [{ id: Date.now().toString(), action: "Account created", timestamp: new Date().toISOString() }],
    }

    setUsers((prev) => [newUser, ...prev])
    setShowAddUser(false)
    toast({
      title: "Success",
      description: "User created successfully.",
    })
  }

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage accounts and permissions</p>
        </div>
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <AddUserForm onSubmit={handleAddUser} onCancel={() => setShowAddUser(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, or username..." // Updated placeholder
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Renter">Renter</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="email">Email Verified</SelectItem>
                  <SelectItem value="phone">Phone Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 flex-wrap">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                    <XCircle className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {roleFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Role: {roleFilter}
                  <button onClick={() => setRoleFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                    <XCircle className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{selectedUsers.length} user(s) selected</span>

              <Button variant="outline" size="sm" onClick={() => handleBulkAction("restore")}>
                Restore
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUsers([])}>
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers(paginatedUsers.map((u) => u.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead> {/* Added Username column */}
                <TableHead>Email</TableHead>
                <TableHead>Login IP</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead className="w-12">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers((prev) => [...prev, user.id])
                        } else {
                          setSelectedUsers((prev) => prev.filter((id) => id !== user.id))
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {user.name}
                      <div className="flex gap-1">
                        {user.emailVerified && <CheckCircle className="h-3 w-3 text-green-500" />}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell> {/* Display Username */}
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{user.loginIP || "N/A"}</span>
                  </TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell>{user.lastSeen}</TableCell>
                  <TableCell>{user.listingsCount}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Suspended" ? "destructive" : "default"}>
                      {user.status || "Active"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => openUserDetail(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)}{" "}
                of {filteredUsers.length} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && closeUserDetail()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <UserDetailDrawer
              user={selectedUser}
              onUpdate={(updatedUser) => {
                setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
                setSelectedUser(updatedUser)
                toast({ title: "Success", description: "User updated successfully." })
              }}
              onClose={closeUserDetail}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddUserForm({
  onSubmit,
  onCancel,
}: { onSubmit: (data: { name: string; email: string; role: User["role"] }) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", role: "Renter" as User["role"] })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: User["role"]) => setFormData((prev) => ({ ...prev, role: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Renter">Renter</SelectItem>
            <SelectItem value="Owner">Owner</SelectItem>
            <SelectItem value="Agent">Agent</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create User</Button>
      </DialogFooter>
    </form>
  )
}

function UserDetailDrawer({
  user,
  onUpdate,
  onClose,
}: { user: User; onUpdate: (user: User) => void; onClose: () => void }) {
  const [editedUser, setEditedUser] = useState<User>(user)
  const [hasChanges, setHasChanges] = useState(false)
  const [showGrantDialog, setShowGrantDialog] = useState(false)
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false)
  const [showForceLogoutDialog, setShowForceLogoutDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setHasChanges(JSON.stringify(editedUser) !== JSON.stringify(user))
  }, [editedUser, user])

  const handleSave = () => {
    onUpdate(editedUser)
    setHasChanges(false)
  }

  const handleGrantCredit = (note: string) => {
    const updatedUser = { ...editedUser, freeListingUsed: Math.max(0, editedUser.freeListingUsed - 1) }
    updatedUser.activity.unshift({
      id: Date.now().toString(),
      action: "Free listing credit granted",
      timestamp: new Date().toISOString(),
      note,
    })
    setEditedUser(updatedUser)
    setShowGrantDialog(false)
    toast({
      title: "Success",
      description: "Free listing credit granted successfully.",
    })
  }

  const handleRevokeCredit = (note: string) => {
    const updatedUser = { ...editedUser, freeListingUsed: editedUser.freeListingUsed + 1 }
    updatedUser.activity.unshift({
      id: Date.now().toString(),
      action: "Free listing credit revoked",
      timestamp: new Date().toISOString(),
      note,
    })
    setEditedUser(updatedUser)
    setShowRevokeDialog(false)
    toast({
      title: "Success",
      description: "Free listing credit revoked successfully.",
    })
  }

  const handleSuspendUser = (duration: string, reason: string, banIP: boolean, banDevice: boolean) => {
    const updatedUser = { ...editedUser, status: "Suspended" as const }
    updatedUser.activity.unshift({
      id: Date.now().toString(),
      action: `User suspended for ${duration}`,
      timestamp: new Date().toISOString(),
      note: `Reason: ${reason}${banIP ? " | IP banned" : ""}${banDevice ? " | Device banned" : ""}`,
    })
    setEditedUser(updatedUser)
    setShowSuspendDialog(false)
    toast({
      title: "Success",
      description: `User suspended successfully for ${duration}.`,
    })
  }

  const handleResetPassword = (sendEmail: boolean, temporaryPassword: string, note: string) => {
    const updatedUser = { ...editedUser }
    updatedUser.activity.unshift({
      id: Date.now().toString(),
      action: "Password reset by admin",
      timestamp: new Date().toISOString(),
      note: `${sendEmail ? "Email sent to user" : "Temporary password set"}${note ? ` | ${note}` : ""}`,
    })
    setEditedUser(updatedUser)
    setShowResetPasswordDialog(false)
    toast({
      title: "Success",
      description: sendEmail ? "Password reset email sent to user" : "Temporary password has been set",
    })
  }

  const handleForceLogout = (allDevices: boolean, note: string) => {
    const updatedUser = { ...editedUser }
    updatedUser.activity.unshift({
      id: Date.now().toString(),
      action: `Force logout ${allDevices ? "from all devices" : "from current device"}`,
      timestamp: new Date().toISOString(),
      note,
    })
    setEditedUser(updatedUser)
    setShowForceLogoutDialog(false)
    toast({
      title: "Success",
      description: `User has been logged out ${allDevices ? "from all devices" : "from current device"}`,
    })
  }

  return (
    <div className="h-full flex flex-col">
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
        <DialogDescription>Manage user account and permissions</DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto space-y-6 py-6">
        {/* Overview */}
        <div className="space-y-4">
          <h3 className="font-semibold">Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">{editedUser.name || "Not provided"}</div>
            </div>
            <div>
              <Label>Username</Label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                {editedUser.username || "Not provided"}
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">{editedUser.email || "Not provided"}</div>
            </div>
            <div>
              <Label>Phone</Label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">{editedUser.phone || "Not provided"}</div>
            </div>
            <div>
              <Label>Company Name</Label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                {(editedUser as any).companyName || "Not provided"}
              </div>
            </div>
            <div>
              <Label>Registration Date</Label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                {new Date(editedUser.joinedDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <Label>Login IP</Label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm font-mono">
                {editedUser.loginIP || "Not available"}
              </div>
            </div>
            {editedUser.status === "Suspended" && editedUser.suspendedUntil && (
              <div className="col-span-2">
                <Label>Suspended Until</Label>
                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  {new Date(editedUser.suspendedUntil).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 flex-wrap">
            <Badge variant={editedUser.emailVerified ? "default" : "secondary"}>
              <Mail className="h-3 w-3 mr-1" />
              Email {editedUser.emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Reset Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset User Password</DialogTitle>
                  <DialogDescription>Reset password for {editedUser.name}</DialogDescription>
                </DialogHeader>
                <ResetPasswordForm onSubmit={handleResetPassword} onCancel={() => setShowResetPasswordDialog(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={showForceLogoutDialog} onOpenChange={setShowForceLogoutDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Force Logout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Force User Logout</DialogTitle>
                  <DialogDescription>Force logout {editedUser.name} from their account</DialogDescription>
                </DialogHeader>
                <ForceLogoutForm onSubmit={handleForceLogout} onCancel={() => setShowForceLogoutDialog(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Suspend/Ban
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Suspend/Ban User</DialogTitle>
                  <DialogDescription>Suspend user account with optional IP/device restrictions</DialogDescription>
                </DialogHeader>
                <SuspendBanForm onSubmit={handleSuspendUser} onCancel={() => setShowSuspendDialog(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Reported Content */}
        <div className="space-y-4">
          <h3 className="font-semibold">Reported Content</h3>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real Estate Listings Reports</p>
                <p className="text-sm text-gray-600">Number of reports against this user's listings</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{editedUser.reportedListings}</div>
                <div className="text-sm text-gray-500">Active Reports</div>
              </div>
            </div>
            {editedUser.reportedListings > 0 && (
              <div className="mt-3">
                <Button variant="outline" size="sm">
                  View Reports
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Permissions */}

        {/* Free Listing Credit */}
        <div className="space-y-4">
          <h3 className="font-semibold">Free Listing Credit</h3>
          <div className="flex items-center justify-between">
            <span>Used this year: {editedUser.freeListingUsed}/1</span>
            <div className="flex gap-2">
              <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Grant
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Grant Free Listing Credit</DialogTitle>
                  </DialogHeader>
                  <CreditActionForm onSubmit={handleGrantCredit} onCancel={() => setShowGrantDialog(false)} />
                </DialogContent>
              </Dialog>

              <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Revoke
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Revoke Free Listing Credit</DialogTitle>
                  </DialogHeader>
                  <CreditActionForm onSubmit={handleRevokeCredit} onCancel={() => setShowRevokeDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Listings Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold">Listings ({editedUser.listings.length})</h3>
          <div className="space-y-2">
            {editedUser.listings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div
                    className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => router.push(`/realestate?listing=${listing.id}`)}
                  >
                    {listing.address}
                  </div>
                  <div className="text-sm text-gray-600">
                    {listing.type} • {listing.plan} • Expires {listing.expires}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={listing.status === "Active" ? "default" : "secondary"}>{listing.status}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/realestate?listing=${listing.id}`)}>
                    Open
                  </Button>
                </div>
              </div>
            ))}
            {editedUser.listings.length === 0 && <p className="text-sm text-gray-500">No listings found</p>}
          </div>
        </div>

        {/* Activity */}
        <div className="space-y-4">
          <h3 className="font-semibold">Activity</h3>
          <div className="space-y-2">
            {editedUser.activity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{new Date(activity.timestamp).toLocaleString()}</p>
                  {activity.note && <p className="text-sm text-gray-600">{activity.note}</p>}
                </div>
              </div>
            ))}
            {editedUser.activity.length === 0 && <p className="text-sm text-gray-500">No activity found</p>}
          </div>
        </div>
      </div>

      {/* Footer */}
      {hasChanges && (
        <div className="border-t pt-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditedUser(user)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      )}
    </div>
  )
}

function CreditActionForm({ onSubmit, onCancel }: { onSubmit: (note: string) => void; onCancel: () => void }) {
  const [note, setNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(note)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reason for this action..."
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Confirm</Button>
      </DialogFooter>
    </form>
  )
}

function SuspendBanForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (duration: string, reason: string, banIP: boolean, banDevice: boolean) => void
  onCancel: () => void
}) {
  const [duration, setDuration] = useState("7 days")
  const [reason, setReason] = useState("")
  const [banIP, setBanIP] = useState(false)
  const [banDevice, setBanDevice] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      toast({ title: "Error", description: "Reason is required", variant: "destructive" })
      return
    }
    onSubmit(duration, reason, banIP, banDevice)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="duration">Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1 day">1 Day</SelectItem>
            <SelectItem value="3 days">3 Days</SelectItem>
            <SelectItem value="7 days">7 Days</SelectItem>
            <SelectItem value="30 days">30 Days</SelectItem>
            <SelectItem value="90 days">90 Days</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reason">Reason *</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain the reason for suspension..."
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="banIP" checked={banIP} onCheckedChange={setBanIP} />
          <Label htmlFor="banIP">Ban IP Address</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="banDevice" checked={banDevice} onCheckedChange={setBanDevice} />
          <Label htmlFor="banDevice">Ban Device</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="destructive">
          Suspend User
        </Button>
      </DialogFooter>
    </form>
  )
}

function ResetPasswordForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (sendEmail: boolean, temporaryPassword: string, note: string) => void
  onCancel: () => void
}) {
  const [method, setMethod] = useState<"email" | "temporary">("email")
  const [temporaryPassword, setTemporaryPassword] = useState("")
  const [note, setNote] = useState("")

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setTemporaryPassword(password)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (method === "temporary" && !temporaryPassword.trim()) {
      toast({ title: "Error", description: "Temporary password is required", variant: "destructive" })
      return
    }
    onSubmit(method === "email", temporaryPassword, note)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Reset Method</Label>
        <Select value={method} onValueChange={(value: "email" | "temporary") => setMethod(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Send Reset Email</SelectItem>
            <SelectItem value="temporary">Set Temporary Password</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {method === "temporary" && (
        <div>
          <Label htmlFor="tempPassword">Temporary Password</Label>
          <div className="flex gap-2">
            <Input
              id="tempPassword"
              type="text"
              value={temporaryPassword}
              onChange={(e) => setTemporaryPassword(e.target.value)}
              placeholder="Enter temporary password"
            />
            <Button type="button" variant="outline" onClick={generatePassword}>
              Generate
            </Button>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="resetNote">Admin Note (optional)</Label>
        <Textarea
          id="resetNote"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reason for password reset..."
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{method === "email" ? "Send Reset Email" : "Set Password"}</Button>
      </DialogFooter>
    </form>
  )
}

function ForceLogoutForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (allDevices: boolean, note: string) => void
  onCancel: () => void
}) {
  const [allDevices, setAllDevices] = useState(false)
  const [note, setNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(allDevices, note)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="allDevices" checked={allDevices} onCheckedChange={setAllDevices} />
          <Label htmlFor="allDevices">Logout from all devices</Label>
        </div>
        <p className="text-sm text-gray-600">
          {allDevices
            ? "User will be logged out from all devices and sessions"
            : "User will be logged out from their current session only"}
        </p>
      </div>

      <div>
        <Label htmlFor="logoutNote">Admin Note (optional)</Label>
        <Textarea
          id="logoutNote"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reason for forced logout..."
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="destructive">
          Force Logout
        </Button>
      </DialogFooter>
    </form>
  )
}
