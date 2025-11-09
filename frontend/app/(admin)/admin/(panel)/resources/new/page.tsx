"use client"

import { ResourceEditor } from "@/components/admin/resource-editor"
import { useRouter } from "next/navigation"

export default function NewResourcePage() {
  const router = useRouter()

  const handleSave = (data: any) => {
    console.log("[v0] Creating new resource:", data)
    // TODO: Implement actual save logic
    router.push("/admin/resources")
  }

  const handleCancel = () => {
    router.push("/admin/resources")
  }

  return <ResourceEditor onSave={handleSave} onCancel={handleCancel} />
}
