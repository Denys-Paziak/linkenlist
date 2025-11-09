import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const baseId = params.id

  // Mock data based on base ID
  const mockHomes = [
    {
      id: `${baseId}-home-1`,
      title: "Modern 3BR Near Base Gate",
      price: "$2,400/month",
      beds: 3,
      baths: 2,
    },
    {
      id: `${baseId}-home-2`,
      title: "Family Home with Yard",
      price: "$2,800/month",
      beds: 4,
      baths: 3,
    },
    {
      id: `${baseId}-home-3`,
      title: "Cozy 2BR Apartment",
      price: "$1,900/month",
      beds: 2,
      baths: 1,
    },
    {
      id: `${baseId}-home-4`,
      title: "Luxury Townhouse",
      price: "$3,200/month",
      beds: 3,
      baths: 2.5,
    },
    {
      id: `${baseId}-home-5`,
      title: "Base Housing Alternative",
      price: "$2,100/month",
      beds: 2,
      baths: 2,
    },
  ]

  return NextResponse.json(mockHomes)
}
