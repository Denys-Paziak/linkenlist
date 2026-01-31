import { IContactInbox } from "./ContactInbox";
import { IUser } from "./User";

export interface IOwnerRealestate {
  id: number;
  package: EPackageType;

  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  primaryPhone?: string | null;
  alternativePhone?: string | null;
  email?: string | null;

  // Адреса/гео та приватність
  street?: string | null;
  hideStreet: boolean;
  unit?: string | null;
  zip?: string | null;
  state?: string | null;
  city?: string | null;
  location?: any | null;

  // Тип угоди та ціни
  forSale: boolean;
  forRent: boolean;
  listPrice?: number | null;
  monthlyRent?: number | null;
  securityDeposit?: number | null;
  applicationFee?: number | null;
  dateAvailable?: string | null;
  leaseTerm?: string | null;
  petPolicy?: string[] | null;

  // Характеристики нерухомості
  propertyType?: string | null;
  bedrooms?: number | null;
  bathroomsFull?: number | null;
  bathroomsHalf?: number | null;
  interiorSize?: number | null;
  yearBuilt?: number | null;
  stories?: number | null;
  architecturalStyle?: string | null;
  // HOA
  hoaPresent: boolean;
  hoaFee?: number | null;
  hoaFrequency?: string | null;
  servicesIncluded?: string[] | null;

  // Загальна інформація
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  virtualTourUrl?: string | null;

  // Amenities
  subdivisionName?: string | null;
  communityFeatures?: string[] | null;

  // Outdoor Features
  outdoorSpaces?: string[] | null;
  fencing?: string[] | null;
  view?: string[] | null;
  parkingType?: string[] | null;
  lotFeatures?: string[] | null;
  poolType?: string | null;
  garageSpaces?: string | null;
  drivewaySpaces?: string | null;
  lotSize?: string | null;

  // Indoor Features
  flooring: string[];
  heating: string[];
  cooling: string[];
  appliances: string[];
  laundryFeatures: string[];
  premiumFeatures: string;
  specialFeatures: string[];

  // Construction & Legal Records
  construction?: string[] | null;
  newConstruction: boolean;
  builder?: string | null;
  zoning?: string | null;
  parcelApn?: string | null;
  ownershipType?: string | null;
  listingAgreement?: string | null;
  dateOnMarket?: string | null;

  // Utilities, Energy & Connectivity
  water?: string | null;
  sewer?: string | null;
  utilitiesAvailable?: string[] | null;
  energyFeatures?: string[] | null;
  downloadSpeed?: string | null;
  cellularNotes?: string | null;
  internetOptions?: string[] | null;
  smartDevices?: string[] | null;

  // Найближчі бази
  // nearestBase?: MilitaryBase | null;

  // Медіа
  photos: IListingPhoto[];

  // Статуси/дати
  status: EListingStatus;

  totalViews: number;

  publishedAt?: string | null;

  expiresAt?: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface IRealestate extends IOwnerRealestate {
  owner: Pick<IUser, "id" | "avatar" | "createdAt" | "professionalTitle"> & {
    listings: {
      forRent: number;
      forSale: number;
    };
  };
  firstName: string;
  lastName: string;
  email: string;
  street: string | null;
  unit: string | null;
  zip: string;
  state: string;
  city: string;
  propertyType: string;
  bedrooms: number;
  bathroomsFull: number;
  bathroomsHalf: number;
  interiorSize: number;
  title: string;
  description: string;
  publishedAt: string;
  lat: number | null;
  lng: number | null;
}

export interface IRealestateOwnerList {
  id: number;
  status: EListingStatus;
  listPrice: number | null;
  monthlyRent: number | null;
  premiumFeatures: string | null;
  bedrooms: number | null;
  bathroomsFull: number | null;
  bathroomsHalf: number | null;
  interiorSize: number | null;
  street: string | null;
  unit: string | null;
  zip: string | null;
  state: string | null;
  city: string | null;
  slug: string;
  package: EPackageType;
  title: string | null;
  expiresAt: string | null;
  isExpired: boolean;
  photos: IListingPhoto[];
}

export interface IRealestateMarkersList {
  id: number;
  slug: string;
  title: string;
  listPrice: number | null;
  monthlyRent: number | null;
  forRent: boolean;
  forSale: boolean;
  lat: number;
  lng: number;
}

export interface IRealestateAdminList {
  id: number;
  status: EListingStatus;
  listPrice: number | null;
  monthlyRent: number | null;
  premiumFeatures: string | null;
  bedrooms: number | null;
  bathroomsFull: number | null;
  bathroomsHalf: number | null;
  interiorSize: number | null;
  street: string | null;
  unit: string | null;
  zip: string | null;
  state: string | null;
  city: string | null;
  slug: string;
  package: EPackageType;
  title: string | null;
  expiresAt: string | null;
  createdAt: string;
  isExpired: boolean;
  totalViews: number;
  photos: IListingPhoto[];
  owner: Pick<IUser, "id" | "firstName" | "lastName">;
  reports: Pick<IContactInbox, "id" | "reportReason">[];
}

export interface IRealestateList {
  id: number;
  status: EListingStatus;
  listPrice: number | null;
  monthlyRent: number | null;
  premiumFeatures: string | null;
  bedrooms: number;
  bathroomsFull: number;
  bathroomsHalf: number | null;
  interiorSize: number;
  street: string | null;
  unit: string | null;
  zip: string;
  state: string;
  city: string;
  slug: string;
  package: EPackageType;
  title: string;
  photos: IListingPhoto[];
}

export interface IListingPhoto {
  id: number;
  url: string;
  width: number;
  height: number;
  caption: string | null;
  position: number;
}

export enum EListingStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
  INACTIVE = "inactive",
}

export enum EPackageType {
  BASIC = "basic",
  PREMIUM = "premium",
}
