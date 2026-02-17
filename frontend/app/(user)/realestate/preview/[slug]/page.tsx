'use client'

import Link from "next/link";
import { IRealestate } from "../../../../../types/Realestate";
import { PropertyActionSidebar } from "../../[slug]/components/property-action-sidebar";
import { PropertyDescription } from "../../[slug]/components/property-description";
import { PropertyExpandableSections } from "../../[slug]/components/property-expandable-sections/property-expandable-sections";
import { PropertyFacts } from "../../[slug]/components/property-facts/property-facts";
import { PropertyHeader } from "../../[slug]/components/property-header";
import { PropertyImage } from "../../[slug]/components/property-image/property-image";
import useSWR from "swr";
import { notFound, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RealestatePreviewPage() {
    const { slug } = useParams()

    const { data: listing, isLoading } = useSWR<IRealestate>(`/listings/preview/${slug}`, {
        revalidateOnMount: true
    })

    if (isLoading) {
        return (
            <div className="flex h-screen justify-center items-center">
                <div className="text-center">
                    <Loader2 className="animate-spin w-12 h-12 mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading realestate details...</p>
                </div>
            </div>
        )
    }

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
                    href={"/realestate"}
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
