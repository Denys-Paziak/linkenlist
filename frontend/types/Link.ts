export interface ILinkImage {
  id: number;
  url: string;
  width: number;
  height: number;
  status: 'ready' | 'processing' | 'error' | 'queued';
  createdAt: string;
  updatedAt: string;
}

export interface ILinksTag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
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
  tags: ILinksTag[]
  status: 'draft' | 'published' | 'archived';
  verified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  createdAt: string;
  updatedAt: string;
}
