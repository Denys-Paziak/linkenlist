export enum ELinkStatus {
  PUBLISHED = "published",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

export interface ILinkImage {
  id: number;
  url: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

export interface ILinksTag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILinkList {
  id: number;
  title: string;
  image: ILinkImage | null;
  category: string;
  status: ELinkStatus;
  url: string;
  verified: boolean;
  totalViews: number;
  lastEdit: string;
}

export interface ILink {
  id: number;
  title: string;
  slug: string;
  description: string;
  url: string;
  image: ILinkImage | null;
  category: string;
  branches: string[];
  tags: ILinksTag[];
  status: ELinkStatus;
  verified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  createdAt: string;
  updatedAt: string;
}
