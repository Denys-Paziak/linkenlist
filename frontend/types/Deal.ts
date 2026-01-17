import { IResourceListExtended } from "./Resource";
import { EOgImageMode } from "./shared";

export enum EDealStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  EXPIRED = "expired",
  ARCHIVED = "archived",
}

export enum EDealCategory {
  SOFTWARE = "software",
  FINANCE = "finance",
  MILITARY = "military",
  HOUSING = "housing",
  TRAVEL = "travel",
  EDUCATION = "education",
  HEALTH = "health",
  RETAIL = "retail",
}

export enum EDealType {
  PERCENTAGE = "Percentage Off",
  FIXED = "Fixed Amount Off",
  FREE = "Free Item/Service",
  SPECIAL = "Special Price",
  BOGO = "Buy One Get One",
}

export enum EDealCadencePrice {
  ONE_TIME = "one-time",
  MONTH = "month",
  YEAR = "year",
  WEEK = "week",
  DAY = "day",
}

export interface IDealSectionAttachment {
  id: number;
  url: string;
  originalKey?: string | null;
  processedKey?: string | null;
  name: string;
  ext: string;
  sizeBytes: number;
}

export interface IDealImage {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface IDealSection {
  id: number;
  position: number;
  title: string;
  enabled: boolean;
  bodyMd: string | null;

  attachments: IDealSectionAttachment[];
}

export interface IDealTag {
  id: number;
  name: string;
}

export interface IDealRelated {
  id: number;
  target: IDealListExtended;
}

export interface IDealSimple {
  id: number;
  title: string | null;
  slug: string | null;
  status: EDealStatus;
}

export interface IDealList {
  id: number;
  title: string | null;
  image: IDealImage | null;
  categories: EDealCategory[];
  slug: string;
  status: EDealStatus;
  updatedAt: string;
}

export interface IDealListExtended {
  id: number;
  title: string;
  slug: string;
  teaser: string | null;
  image: IDealImage;
  categories: EDealCategory[];
  tags: IDealTag[];
  outboundUrl: string;
  status: EDealStatus;
  totalHelpful: number;
  popularScore: number;
  updatedAt: string;
  isFeatured: boolean;
  commentsCount: number;
}

export interface IDeal {
  id: number;

  title: string;
  slug: string;
  teaser: string | null;

  image: IDealImage;

  categories: EDealCategory[];
  tags: IDealTag[];

  isFeatured: boolean;

  outboundUrl: string;
  outboundUrlButtonLabel: string;

  offerEnabled: boolean;
  dealType: EDealType | null;
  originalPrice: number | null;
  yourPrice: number | null;
  cadencePrice: EDealCadencePrice;

  promoCode: string | null;
  whereToEnterCode: string;

  ongoingOffer: boolean;
  validFrom: string | null;
  validUntil: string | null;

  providerDisplayName: string | null;

  sections: IDealSection[];

  relatedAutoMode: boolean;
  relatedManual: IDealRelated[];

  seoMetaTitle: string;
  seoMetaDescription: string;
  ogImageMode: EOgImageMode;
  ogImage: IDealImage;
  canonicalUrl: string | null;
  allowIndexing: boolean;

  status: EDealStatus;
  publishAt: string | null;
  expireAt: string | null;
  lastPublishedAt: string | null;

  commentsEnabled: boolean;

  featuredResource: IResourceListExtended | null;

  helpful30d: number;
  totalViews: number;
  views30d: number;
  popularScore: number;

  createdAt: string;
  updatedAt: string;
}
