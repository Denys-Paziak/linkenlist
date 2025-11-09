export interface Resource {
  id: string
  slug: string
  title: string
  description: string
  excerpt?: string
  author?: string
  publishDate?: string
  readTime?: string
  tags: string[]
  category?: string
  format?: string
  thumbnail?: string
  screenshotImage?: string
  isFeatured?: boolean
  isVerified?: boolean
  views?: number
  likes?: number
  clicks?: number
  lastVerified?: string
  accessType?: string
  url?: string
}

// Simple resource interface for external links
export interface ExternalResource {
  id: string
  title: string
  description: string
  url: string
  tags: string[]
  screenshotImage?: string
  clicks?: number
  lastVerified?: string
  category?: string
  accessType?: string
}

// Content resource interface for internal resources
export interface ContentResource {
  id: string
  slug: string
  title: string
  description: string
  excerpt: string
  author: string
  publishDate: string
  readTime: string
  tags: string[]
  category: string
  format: string
  thumbnail: string
  isFeatured: boolean
  isVerified: boolean
  views: number
}
