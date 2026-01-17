import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ScrollButtons } from "@/components/scroll-buttons";
import { BasicInfo } from "./components/basic-info";
import { Helpful } from "./components/helpful";
import { Related } from "./components/related";
import { Featured } from "./components/featured";
import { HeroImage } from "./components/hero-image";
import { Navigate } from "./components/navigate";
import { MarkdownSection } from "../../../../components/markdown-section/markdown-section";
import Link from "next/link";
import { ScrollProgress } from "./components/scroll-progress";
import { IResource } from "../../../../types/Resource";
import { Comments } from "./components/comments/comments";

export const dynamicParams = true;

async function getResource(slug: string) {
  const res = await fetch(`${process.env.API_INTERNAL_URL}/resources/${slug}`, {
    next: { revalidate: 5 * 60 },
  });

  if (res.status === 404) return null;
  if (!res.ok) return null;

  return (await res.json()) as IResource;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = (await getResource(slug)) as IResource;

  if (!resource) {
    return {
      title: "Not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = new URL(
    `/resources/${resource.slug}`,
    process.env.NEXT_PUBLIC_SITE_URL
  ).toString();
  const isIndexable = resource.allowIndexing === true;

  return {
    title: resource.seoMetaTitle,
    description: resource.seoMetaDescription,

    alternates: isIndexable
      ? {
          canonical: resource.canonicalUrl || url,
        }
      : undefined,

    robots: isIndexable
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        },

    openGraph: {
      title: resource.seoMetaTitle,
      description: resource.seoMetaDescription,
      type: "article",
      url: resource.canonicalUrl || url,
      images: [
        {
          url: resource.ogImage.url,
          width: resource.ogImage.width,
          height: resource.ogImage.height,
          alt: resource.seoMetaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resource.seoMetaTitle,
      description: resource.seoMetaDescription,
      images: [resource.ogImage.url],
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = (await getResource(slug)) as IResource;

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ScrollProgress />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-0">
        <div className="flex gap-4 lg:gap-8 pb-12">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <div className="mb-4">
                <Link
                  href="/resources"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50 group flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 bg-white border border-border shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Resources
                </Link>
              </div>

              <Navigate data={resource} />

              {resource.featuredDeal ? (
                <Featured data={resource.featuredDeal} />
              ) : null}
            </div>
          </aside>

          <main className="flex-1 max-w-full lg:max-w-4xl min-w-0">
            <div className="space-y-8">
              <HeroImage data={resource} />

              <BasicInfo data={resource} />

              {resource.sections.map((item) => (
                <MarkdownSection
                  key={item.id}
                  id={
                    item.title.replaceAll(" ", "_").toLocaleLowerCase() +
                    "_" +
                    item.id
                  }
                  content={item.bodyMd || ""}
                  attachments={item.attachments}
                />
              ))}

              <Helpful data={resource} />

              <Comments data={resource} />

              <Related
                resourceData={resource}
                autoMode={resource.relatedAutoMode}
                related={resource.relatedManual}
              />
            </div>
          </main>
        </div>
      </div>

      <ScrollButtons />
    </div>
  );
}
