export interface LinkImage {
  id: number;
  url: string;
  width: number;
  height: number;
  status: 'ready' | 'processing' | 'error' | 'queued';
  createdAt: string;
  updatedAt: string;
}

export interface LinksTag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: number;
  title: string;
  slug: string;
  description: string;
  url: string;
  image: LinkImage | null;
  category: string;
  branches: string[];
  tags: LinksTag[]
  status: 'draft' | 'published' | 'archived';
  verified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  createdAt: string;
  updatedAt: string;
}
