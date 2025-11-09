import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { message } = await request.json()
    const leadId = params.id

    // Mock API response - in real app, this would save to database
    console.log(`Sending reply to lead ${leadId}:`, message)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 })
  }
}
