import { PropertyActionSidebar } from "./components/property-action-sidebar";
import { PropertyDescription } from "./components/property-description";
import { PropertyExpandableSections } from "./components/property-expandable-sections/property-expandable-sections";
import { PropertyFacts } from "./components/property-facts/property-facts";
import { PropertyHeader } from "./components/property-header";
import { PropertyImage } from "./components/property-image/property-image";
import { IRealestate } from "../../../../types/Realestate";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamicParams = true;

async function getRealestate(slug: string) {
  const res = await fetch(`${process.env.API_INTERNAL_URL}/listings/${slug}`, {
    next: { revalidate: 5 * 60 },
  });

  if (res.status === 404) return null;
  if (!res.ok) return null;

  return (await res.json()) as IRealestate;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const realestate = (await getRealestate(slug)) as IRealestate;

  if (!realestate) {
    return {
      title: "Not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = new URL(
    `/realestate/${realestate.slug}`,
    process.env.NEXT_PUBLIC_SITE_URL,
  ).toString();
  const isIndexable = true;

  return {
    title: realestate.title,
    description: realestate.description.slice(0, 100) + "...",

    alternates: isIndexable
      ? {
          canonical: url,
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
      title: realestate.title,
      description: realestate.description.slice(0, 100) + "...",
      type: "article",
      url: url,
      images: [
        {
          url: realestate.photos[0].url,
          width: realestate.photos[0].width,
          height: realestate.photos[0].height,
          alt: realestate.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: realestate.title,
      description: realestate.description.slice(0, 100) + "...",
      images: [realestate.photos[0]],
    },
  };
}

export default async function RealestateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = (await getRealestate(slug)) as IRealestate;

  if (!listing) {
    notFound();
  }

  return (
    <div className="relative">
      <div className="bg-primary text-white p-3">
        <Link
          className="text-white hover:text-white/80 transition-colors cursor-pointer"
          href={"/"}
        >
          Home
        </Link>
        <span className="inline-block px-3">{" > "}</span>
        <Link
          className="text-white hover:text-white/80 transition-colors cursor-pointer"
          href={"./"}
        >
          Real Estate
        </Link>
        <span className="inline-block px-3">{" > "}</span>
        <span className="text-white">{listing.title}</span>
      </div>
      <div className="flex flex-col w-full max-w-6xl mx-auto bg-white rounded-sm ">
        {/* Scrollable Content */}
        <div className="h-full">
          {/* Image Section */}
          <div className="p-4 pb-0">
            <PropertyImage listing={listing} />
          </div>

          {/* Main Info Section */}
          <div className="p-6 pt-0 mt-8 pl-0.5 pr-0.5">
            <PropertyHeader listing={listing} />

            {/* Content Section */}
            <div className="bg-gray-50 p-6 rounded-lg px-0.5 py-0.5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Description and Facts */}
                <div className="lg:col-span-2 space-y-6">
                  <PropertyDescription listing={listing} />

                  <PropertyFacts listing={listing} />
                </div>

                <PropertyActionSidebar listing={listing} />
              </div>
            </div>

            <PropertyExpandableSections listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}
