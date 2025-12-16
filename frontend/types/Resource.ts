import { IDeal } from "./Deal";
import { EOgImageMode } from "./shared";

export enum EResourceCategory {
  SOFTWARE = "software",
  FINANCE = "finance",
  MILITARY = "military",
  HOUSING = "housing",
  TRAVEL = "travel",
  EDUCATION = "education",
  HEALTH = "health",
  RETAIL = "retail",
}

export enum EResourceFormat {
  GUIDE = "guide",
  CHECKLIST = "checklist",
  TOOL = "tool",
  PDF = "pdf",
}

export enum EResourceStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  EXPIRED = "expired",
  ARCHIVED = "archived",
}

export interface IResourceSimple {
  id: number;
  title: string | null;
  slug: string | null;
  status: EResourceStatus;
}

export interface IResourceListExtended {
  id: number;
  title: string;
  slug: string;
  teaser: string | null;
  image: IResourceImage;
  categories: EResourceCategory[];
  tags: IResourceTag[];
  status: EResourceStatus;
  totalHelpful: number;
  popularScore: number;
  updatedAt: string;
  isFeatured: boolean;
}

export interface IResourceTag {
  id: number;
  name: string;
}

export interface IResourceSectionAttachment {
  id: number;
  url: string;
  originalKey?: string | null;
  processedKey?: string | null;
  name: string;
  ext: string;
  sizeBytes: number;
}

export interface IResourceImage {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface IResourceSection {
  id: number;
  position: number;
  title: string;
  enabled: boolean;
  bodyMd: string | null;

  attachments: IResourceSectionAttachment[];
}

export interface IResourceRelated {
  id: number;
  target: IResource;
}

export interface IResourceList {
  id: number;
  title: string;
  image: IResourceImage;
  categories: EResourceCategory[];
  status: EResourceStatus;
  slug: string;
  updatedAt: string;
}

export interface IResource {
  id: number;

  title: string;
  slug: string;
  teaser: string | null;

  image: IResourceImage;

  format: EResourceFormat;
  categories: EResourceCategory[];
  tags: IResourceTag[];

  isFeatured: boolean;

  sections: IResourceSection[];

  relatedAutoMode: boolean;
  relatedManual: IResourceRelated[];

  seoMetaTitle: string;
  seoMetaDescription: string;
  ogImageMode: EOgImageMode;
  ogImage: IResourceImage;
  canonicalUrl: string | null;
  allowIndexing: boolean;

  status: EResourceStatus;
  publishAt: string | null;
  expireAt: string | null;
  lastPublishedAt: string | null;

  commentsEnabled: boolean;

  featuredDeal: IDeal | null;

  helpful30d: number;
  totalViews: number;
  views30d: number;
  popularScore: number;

  createdAt: string;
  updatedAt: string;
}
