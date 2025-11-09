"use client"

import { ResourceEditor } from "@/components/admin/resource-editor"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams()
  const [existingResource, setExistingResource] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch the actual resource data by ID
    // For now, using mock data
    const mockResource = {
      id: params.id,
      title: "Complete PCS Checklist: Your 90-Day Moving Guide",
      category: "PCS",
      status: "published",
      views: 15420,
      lastUpdated: "2024-01-15",
      isVerified: true,
      isFeatured: true,
      content: "Sample resource content...",
      description: "A comprehensive guide for military families preparing for PCS moves.",
      tags: ["PCS", "Moving", "Military", "Guide"],
    }

    setExistingResource(mockResource)
    setLoading(false)
  }, [params.id])

  const handleSave = (data: any) => {
    console.log("[v0] Updating resource:", data)
    // TODO: Implement actual save logic
    router.push("/admin/resources")
  }

  const handleCancel = () => {
    router.push("/admin/resources")
  }

  if (loading) {
    return <div>Loading resource...</div>
  }

  return <ResourceEditor existingContent={existingResource} onSave={handleSave} onCancel={handleCancel} />
}
