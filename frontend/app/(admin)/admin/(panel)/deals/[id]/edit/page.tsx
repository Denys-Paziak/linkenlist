"use client"

import { DealEditor } from "@/components/admin/deal-editor"
import { useRouter } from "next/navigation"

interface DealEditorPageProps {
  params: { id: string }
}

export default function DealEditorPage({ params }: DealEditorPageProps) {
  const router = useRouter()

  const handleSave = (data: any) => {
    console.log("[v0] Saving deal:", data)
    // TODO: Implement actual save logic
    router.push("/admin/deals")
  }

  const handleCancel = () => {
    router.push("/admin/deals")
  }

  // TODO: Load existing deal data based on params.id
  const existingContent =
    params.id !== "new"
      ? {
          title: `Sample Deal ${params.id}`,
          slug: `sample-deal-${params.id}`,
          category: "software",
          // ... other existing data would be loaded here
        }
      : undefined

  return <DealEditor existingContent={existingContent} onSave={handleSave} onCancel={handleCancel} />
}
