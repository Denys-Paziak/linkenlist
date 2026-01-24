"use client";

import type React from "react";

import {  useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  Plus,
  Bookmark,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import useSWR from "swr";
import { IUser } from "../../../../types/User";
import { useRouter } from "next/navigation";
import { MyListings } from "./components/my-listings";
import { SavedListings } from "./components/saved-listings";

export default function MyRealEstatePage() {
  const {
    data: user,
    isLoading,
    isValidating,
    error,
  } = useSWR<IUser>("/users/self");

  const router = useRouter();

  useEffect(() => {
    if (error || (!user && !(isLoading || isValidating))) {
      router.push("/auth/signin?tab=login");
      return;
    }
  }, [user, error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 py-8">
        {/* Header Section */}
        <div className="px-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Real Estate
              </h1>
              <p className="text-gray-600">
                Manage your property listings and saved properties
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/realestate/packages">
                <Button className="flex items-center gap-2 bg-[#002244] hover:bg-[#001122]">
                  <Plus className="h-4 w-4 md:h-8 md:w-8" />
                  Post New Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs for My Listings and Saved Listings */}
        <div className="px-4">
          <Tabs defaultValue="my-listings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="my-listings"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                My Listings
              </TabsTrigger>
              <TabsTrigger
                value="saved-listings"
                className="flex items-center gap-2"
              >
                <Bookmark className="h-4 w-4 md:h-8 md:w-8 text-[#002244]" />
                Saved Listings
              </TabsTrigger>
            </TabsList>

            {/* My Listings Tab */}
            <TabsContent value="my-listings" className="space-y-8">
              <MyListings />
            </TabsContent>

            {/* Saved Listings Tab */}
            <TabsContent value="saved-listings" className="space-y-8">
              <SavedListings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
