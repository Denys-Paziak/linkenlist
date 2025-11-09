"use client"

import { DealEditor } from "@/components/admin/deal-editor"
import { useRouter } from "next/navigation"

export default function NewDealPage() {
  const router = useRouter()

  const handleSave = (data: any) => {
    console.log("[v0] Creating new deal:", data)
    // TODO: Implement actual save logic
    router.push("/admin/deals")
  }

  const handleCancel = () => {
    router.push("/admin/deals")
  }

  return <DealEditor onSave={handleSave} onCancel={handleCancel} />
}
