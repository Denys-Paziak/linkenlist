import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const leadId = params.id

    // Mock API response - in real app, this would update database
    console.log(`Updating lead ${leadId} status to:`, status)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return NextResponse.json({
      success: true,
      status: status,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
