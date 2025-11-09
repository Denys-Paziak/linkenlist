import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const baseId = params.id

  // Mock data based on base ID
  const mockDeals = [
    {
      id: `${baseId}-deal-1`,
      title: "Military Discount at Local Gym",
      discount: "20% OFF",
      category: "Fitness",
    },
    {
      id: `${baseId}-deal-2`,
      title: "Base Exchange Special",
      discount: "15% OFF",
      category: "Shopping",
    },
    {
      id: `${baseId}-deal-3`,
      title: "Local Restaurant Military Night",
      discount: "25% OFF",
      category: "Dining",
    },
    {
      id: `${baseId}-deal-4`,
      title: "Car Rental Military Rate",
      discount: "30% OFF",
      category: "Travel",
    },
    {
      id: `${baseId}-deal-5`,
      title: "Moving Company Discount",
      discount: "10% OFF",
      category: "Services",
    },
  ]

  return NextResponse.json(mockDeals)
}
