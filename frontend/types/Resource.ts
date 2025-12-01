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
  title: string | null;
  image: IResourceImage | null;
  categories: EResourceCategory[];
  status: EResourceStatus;
  updatedAt: string;
}

export interface IResource {
  id: number;

  title: string | null;
  slug: string | null;
  teaser: string | null;

  image: IResourceImage | null;

  format: EResourceFormat;
  categories: EResourceCategory[];
  tags: IResourceTag[];

  // Статуси/бейджі
  isVerified: boolean;
  isFeatured: boolean;

  // Content (Markdown секції)
  sections: IResourceSection[];

  // Surfacing & related
  relatedAutoMode: boolean;
  relatedManual: IResourceRelated[];

  // SEO & indexation
  seoMetaTitle: string | null;
  seoMetaDescription: string | null;
  ogImageMode: EOgImageMode;
  ogImage: IResourceImage | null;
  canonicalUrl: string | null;
  allowIndexing: boolean;

  // Publishing workflow
  status: EResourceStatus;
  publishAt: string | null; // ISO string
  expireAt: string | null; // ISO string
  lastPublishedAt: string | null; // ISO string

  commentsEnabled: boolean;

  featuredDeal: IDeal;

  createdAt: string;
  updatedAt: string;
}
