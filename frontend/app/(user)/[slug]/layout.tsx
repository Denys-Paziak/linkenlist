import type React from "react"
import type { Metadata } from "next"
import { mockResources } from "@/data/mock-resources"

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// Find resource by slug
const getResourceBySlug = (slug: string) => {
  return mockResources.find((resource) => generateSlug(resource.title) === slug)
}

interface ResourceLayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resource = getResourceBySlug(params.slug)

  if (!resource) {
    return {
      title: "Resource Not Found - LinkEnlist.com",
      description: "The requested military resource could not be found.",
    }
  }

  const title = `${resource.title} - LinkEnlist.com`
  const description =
    resource.description.length > 160 ? `${resource.description.substring(0, 157)}...` : resource.description

  return {
    title,
    description,
    keywords: resource.tags.join(", "),
    openGraph: {
      title,
      description,
      url: `https://linkenlist.com/${params.slug}`,
      siteName: "LinkEnlist.com",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://linkenlist.com/${params.slug}`,
    },
    other: {
      "schema:name": resource.title,
      "schema:description": resource.description,
      "schema:url": resource.url,
      "schema:applicationCategory": "Military Resource",
    },
  }
}

export default function ResourceLayout({ children, params }: ResourceLayoutProps) {
  const resource = getResourceBySlug(params.slug)

  return (
    <>
      {resource && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: resource.title,
              description: resource.description,
              url: `https://linkenlist.com/${params.slug}`,
              mainEntity: {
                "@type": "SoftwareApplication",
                name: resource.title,
                description: resource.description,
                url: resource.url,
                applicationCategory: "Military Resource",
                operatingSystem: "Web Browser",
                keywords: resource.tags.join(", "),
                provider: {
                  "@type": "Organization",
                  name: "LinkEnlist.com",
                  url: "https://linkenlist.com",
                },
              },
            }),
          }}
        />
      )}
      {children}
    </>
  )
}
