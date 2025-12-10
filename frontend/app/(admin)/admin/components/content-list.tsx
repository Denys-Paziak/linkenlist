"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Upload } from "lucide-react"
import { DealEditor } from "./deal-editor"
import { ResourceEditor } from "./resource-editor"
import { useRouter } from "next/navigation"

interface ContentListProps {
  type: "resource" | "link" | "deal"
}

export function ContentList({ type }: ContentListProps) {
  const router = useRouter()
  const [view, setView] = useState<"list" | "create" | "edit">("list")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  const mockData = {
    resource: [
      {
        id: "1",
        title: "Complete PCS Checklist: Your 90-Day Moving Guide",
        category: "PCS",
        status: "published",
        views: 15420,
        lastUpdated: "2024-01-15",
        isVerified: true,
        isFeatured: true,
      },
    ],
    link: [
      {
        id: "1",
        title: "MyPay Portal",
        category: "Finance",
        status: "published",
        views: 8750,
        lastUpdated: "2024-01-10",
        isVerified: true,
        isFeatured: false,
      },
    ],
    deal: [
      {
        id: "1",
        title: "Adobe Creative Cloud Military Discount",
        category: "Software",
        status: "active",
        views: 2340,
        lastUpdated: "2024-01-12",
        isVerified: true,
        isFeatured: true,
      },
    ],
  }

  const items = mockData[type] || []

  const handleCreateNew = () => {
    if (type === "deal") {
      router.push("/admin/deals/new")
    } else if (type === "resource") {
      router.push("/admin/resources/new")
    } else {
      setView("create")
    }
  }

  const handleEditItem = (item: any) => {
    console.log("[v0] Edit button clicked for item:", item)
    console.log("[v0] Current type:", type)

    try {
      if (type === "deal") {
        console.log("[v0] Navigating to deal edit page:", `/admin/deals/${item.id}/edit`)
        router.push(`/admin/deals/${item.id}/edit`)
      } else if (type === "resource") {
        console.log("[v0] Navigating to resource edit page:", `/admin/resources/${item.id}/edit`)
        router.push(`/admin/resources/${item.id}/edit`)
      } else {
        console.log("[v0] Setting selected item for link edit:", item)
        setSelectedItem(item)
        setView("edit")
      }
    } catch (error) {
      console.error("[v0] Error in handleEditItem:", error)
    }
  }

  const handleCardClick = (item: any) => {
    let url = ""
    switch (type) {
      case "deal":
        url = `/deals/${item.id}`
        break
      case "resource":
        url = `/resources/${item.id}`
        break
      case "link":
        url = item.url || "#" // Use the actual URL for links
        break
      default:
        return
    }
    window.open(url, "_blank")
  }

  const handleDeleteClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setItemToDelete(item)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      console.log("Deleting item:", itemToDelete.id)
      // Here you would make the actual API call to delete the item
      // For now, just log it
      setShowDeleteDialog(false)
      setItemToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
    setItemToDelete(null)
  }

  if (view === "create") {
    if (type === "deal") {
      return (
        <DealEditor
          onSave={(data) => {
            console.log("Creating deal:", data)
            setView("list")
          }}
          onCancel={() => setView("list")}
        />
      )
    } else if (type === "resource") {
      return (
        <ResourceEditor
          onSave={(data) => {
            console.log("Creating resource:", data)
            setView("list")
          }}
          onCancel={() => setView("list")}
        />
      )
    }
  }

  if (view === "edit" && selectedItem) {
    if (type === "deal") {
      return (
        <DealEditor
          existingContent={selectedItem}
          onSave={(data) => {
            console.log("Updating deal:", data)
            setView("list")
          }}
          onCancel={() => setView("list")}
        />
      )
    } else if (type === "resource") {
      return (
        <ResourceEditor
          existingContent={selectedItem}
          onSave={(data) => {
            console.log("Updating resource:", data)
            setView("list")
          }}
          onCancel={() => setView("list")}
        />
      )
    } 
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{type.charAt(0).toUpperCase() + type.slice(1)} Management</h1>
        {type !== "link" && (
          <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search ${type}s...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid-container-links">
            {items.map((item) => (
              <div
                key={item.id}
                className="card group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                {/* Image Container with fixed aspect ratio - matching realestate cards */}
                <div className="card-media-container p-2 pb-1">
                  <div className="card-media w-full bg-secondary rounded-md border border-gray-200 overflow-hidden">
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <span className="text-sm font-medium">{type.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Content Container - matching realestate card structure */}
                <div className="px-2 pb-2">
                  {/* Title - matching realestate card styling */}
                  <h3 className="card-price mb-1 font-bold text-[#002244] text-left text-sm leading-tight line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Description - NOW limited to 2 rows */}
                  <p
                    className="text-xs text-gray-500 font-medium text-left mb-2 leading-relaxed"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.4",
                      maxHeight: "2.8em", // 2 lines * 1.4 line-height
                    }}
                  >
                    {item.category} - {item.status} • {item.views.toLocaleString()} views • Updated {item.lastUpdated}
                  </p>

                  {/* Tags - limited to one line only */}
                  <div className="flex flex-wrap gap-1 overflow-hidden" style={{ maxHeight: "1.5rem" }}>
                    {item.isVerified && (
                      <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Verified
                      </span>
                    )}
                    {item.isFeatured && (
                      <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Featured
                      </span>
                    )}
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Edit Button - top left */}
                <div className="absolute top-2 left-2 flex gap-1 z-20">
                  <button
                    onClick={(e) => {
                      console.log("[v0] Edit button click event triggered")
                      e.preventDefault()
                      e.stopPropagation()
                      handleEditItem(item)
                    }}
                    className="w-6 h-6 p-0 bg-white/90 hover:bg-gray-100 rounded-sm flex items-center justify-center group/tooltip relative"
                    aria-label="Edit item"
                  >
                    <Edit className="w-3.5 h-3.5 text-gray-500" />
                    <div className="absolute top-full left-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                      Edit
                    </div>
                  </button>
                </div>

                {/* Delete Button - top right */}
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                  <button
                    onClick={(e) => handleDeleteClick(item, e)}
                    className="w-6 h-6 p-0 bg-white/90 hover:bg-red-100 rounded-sm flex items-center justify-center group/tooltip relative"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                      Delete
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
