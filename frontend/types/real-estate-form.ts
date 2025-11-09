export interface ImageWithComment {
  id: string
  file: File
  preview: string
  comment: string
}

export interface FormData {
  // Seller Information (Page 1)
  firstName: string
  lastName: string
  email: string
  confirmEmail: string
  hideEmail: boolean
  primaryPhone: string
  hidePrimaryPhone: boolean
  alternativePhone: string
  hideAlternativePhone: boolean
  password: string
  confirmPassword: string

  // Location Information (Page 1)
  streetAddress: string
  hideStreetAddress: boolean
  unitApt: string
  zipCode: string
  county: string
  city: string
  nearestMilitaryBase: string
  militaryBaseDistance: string

  // Property Basics & Pricing (Page 1)
  listingType: string[] // For Sale, For Rent, Both
  listPrice: string
  financingTags: string[] // VA eligible, Assumable loan, etc.
  monthlyRent: string
  securityDeposit: string
  applicationFee: string
  dateAvailable: string
  leaseTerm: string
  petPolicy: string[]

  // Property Details (Page 1)
  propertyType: string
  propertySubType: string
  bedrooms: string
  bathroomsFull: string
  bathroomsHalf: string
  interiorSize: string
  yearBuilt: string
  stories: string
  architecturalStyle: string

  // HOA & Community (Page 1)
  subdivisionName: string
  communityFeatures: string[]
  hoaPresent: boolean
  hoaFee: string
  hoaFrequency: string
  servicesIncluded: string[]

  // Listing Details (Page 1)
  listingDescription: string
  virtualTourUrl: string

  // Indoor & Outdoor Features (Page 2)
  outdoorSpaces: string[]
  pool: string
  fencing: string[]
  view: string[]
  parkingType: string[]
  garageSpaces: string
  drivewaySpaces: string
  rvBoatParking: boolean
  lotSize: string
  lotSizeUnit: string
  lotFeatures: string[]
  flooring: string[]
  heating: string[]
  cooling: string[]
  appliances: string[]
  laundryFeatures: string
  redVisibilityTag: string // Premium only
  specialFeatures: string[] // Up to 4, 20 chars each

  // Construction & Legal Records (Page 2)
  construction: string[]
  newConstruction: boolean
  builder: string
  zoning: string
  parcelApn: string
  ownershipType: string
  listingAgreement: string
  dateOnMarket: string

  // Utilities, Energy & Connectivity (Page 2)
  water: string
  sewer: string
  utilitiesAvailable: string[]
  energyFeatures: string[]
  internetOptions: string[]
  typicalDownloadSpeed: string
  cellularNotes: string
  smartDevices: string[]

  // Media & Publish (Page 2)
  images: ImageWithComment[]
  hasVirtualTour: boolean
  hasVideoTour: boolean
  videoTourUrl: string
  hasFloorPlans: boolean
  confirmed: boolean

  // Legacy fields for compatibility
  price: string
  priceType: string
  tags: string[]
  featuredTag?: string
  schoolDistrict: string
  otherInteriorNotes: string
  roof: string
  foundation: string
  overallCondition: string
  rentToOwnConsidered: boolean
  evCharger: boolean
  evChargerLocation: string
}

export interface MilitaryBase {
  id: string
  name: string
  city: string
  state: string
  zipCode: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface FormErrors {
  [key: string]: string
}

export interface FormPageState {
  currentPage: number
  totalPages: number
  isAccountCreated: boolean
  isDraft: boolean
}
