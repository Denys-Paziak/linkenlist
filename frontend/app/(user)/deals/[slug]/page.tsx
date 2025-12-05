import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ScrollButtons } from "@/components/scroll-buttons";
import { IDeal } from "../../../../types/Deal";
import { BasicInfo } from "./components/basic-info";
import { OfferDetails } from "./components/offer-details";
import { Helpful } from "./components/helpful";
import { Comments } from "./components/comments";
import { Related } from "./components/related";
import { Featured } from "./components/featured";
import { HeroImage } from "./components/hero-image";
import { Navigate } from "./components/navigate";
import { MarkdownSection } from "../../../../components/markdown-section/markdown-section";
import Link from "next/link";
import { ScrollProgress } from "./components/scroll-progress";

export const dynamicParams = true;

function getDeal(slug: string) {
  return fetch(process.env.API_INTERNAL_URL + "/deals/" + slug, {
    next: { revalidate: 5 * 60 },
  }).then((r) => r.json());
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const deal = (await getDeal(params.slug)) as IDeal;

  if (!deal) {
    return {
      title: "Not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = new URL(
    `/deals/${deal.slug}`,
    process.env.NEXT_PUBLIC_SITE_URL
  ).toString();
  const isIndexable = deal.allowIndexing === true;

  return {
    title: deal.title,
    description: deal.teaser,

    alternates: isIndexable
      ? {
          canonical: deal.canonicalUrl || url,
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
      title: deal.seoMetaTitle,
      description: deal.seoMetaDescription,
      type: "article",
      url: deal.canonicalUrl || url,
      images: [
        {
          url: deal.ogImage.url,
          width: deal.ogImage.width,
          height: deal.ogImage.height,
          alt: deal.seoMetaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: deal.seoMetaTitle,
      description: deal.seoMetaDescription,
      images: [deal.ogImage.url],
    },
  };
}

export default async function DealDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const deal = (await getDeal(params.slug)) as IDeal;

  if (!deal) {
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
                  href="/deals"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50 group flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 bg-white border border-border shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Deals
                </Link>
              </div>

              <Navigate data={deal} />

              {deal.featuredResource ? (
                <Featured data={deal.featuredResource} />
              ) : null}
            </div>
          </aside>

          <main className="flex-1 max-w-full lg:max-w-4xl min-w-0">
            <div className="space-y-8">
              <HeroImage data={deal} />

              <BasicInfo data={deal} />

              {deal.sections.map((item) => (
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

              <OfferDetails data={deal} />

              <Helpful data={deal} />

              <Comments />

              {deal.relatedManual.length ? (
                <Related data={deal.relatedManual} />
              ) : null}
            </div>
          </main>
        </div>
      </div>

      <ScrollButtons />
    </div>
  );
}
