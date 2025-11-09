import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const baseId = params.id

  // Mock data based on base ID
  const mockResources = [
    {
      id: `${baseId}-resource-1`,
      title: "PCS Moving Guide",
      category: "Moving",
      description: "Complete checklist for your upcoming PCS move",
    },
    {
      id: `${baseId}-resource-2`,
      title: "Base Housing Office",
      category: "Housing",
      description: "Contact information and office hours",
    },
    {
      id: `${baseId}-resource-3`,
      title: "School District Information",
      category: "Education",
      description: "Local schools and enrollment procedures",
    },
    {
      id: `${baseId}-resource-4`,
      title: "Base Services Directory",
      category: "Services",
      description: "Complete list of on-base services and facilities",
    },
    {
      id: `${baseId}-resource-5`,
      title: "Local Area Guide",
      category: "Community",
      description: "Restaurants, shopping, and entertainment nearby",
    },
  ]

  return NextResponse.json(mockResources)
}
