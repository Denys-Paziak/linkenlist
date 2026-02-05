"use client";

import {
  Loader2,
  Camera,
  FileText,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcherUser } from "../lib/fetcher";
import { EPackageType } from "../types/Realestate";
import { IUser } from "../types/User";
import { ButtonSubmitStatus, ButtonSubmit } from "./ui/button-submit";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useUser } from "../contexts/user-context";

interface LocationData {
  city: string;
  state: string;
}

export function ListingPackages() {
  const userData = useSWR<IUser>("/users/self");
  const pricesData = useSWR<{
    id: string;
    price: number;
    currency: string;
    period: number | null;
  }>("/payments/default-price");

  const router = useRouter();
  const { setShowLoginModal } = useUser();

  const [basicStatus, setBasicStatus] = useState<ButtonSubmitStatus>("idle");
  const [premiumStatus, setPremiumStatus] =
    useState<ButtonSubmitStatus>("idle");

  const [basicZip, setbasicZip] = useState("");
  const [premiumZip, setPremiumZip] = useState("");
  const [basicLocation, setbasicLocation] = useState<LocationData>();
  const [premiumLocation, setPremiumLocation] = useState<LocationData>();
  const [basicLoading, setBasicLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  const zipRegex = /^\d{5}(-\d{4})?$/;

  const lookupZip = async (zip: string, packageType: EPackageType) => {
    const zip5 = zip.slice(0, 5);
    const setLoading =
      packageType === EPackageType.BASIC ? setBasicLoading : setPremiumLoading;
    const setLocation =
      packageType === EPackageType.BASIC
        ? setbasicLocation
        : setPremiumLocation;

    setLoading(true);
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip5}`);
      if (response.ok) {
        const data = await response.json();
        setLocation({
          city: data.places[0]["place name"],
          state: data.places[0]["state"],
        });
      } else {
        setLocation(undefined);
      }
    } catch (error) {
      setLocation(undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleZipChange = (value: string, packageType: EPackageType) => {
    const setZip =
      packageType === EPackageType.BASIC ? setbasicZip : setPremiumZip;
    const setLocation =
      packageType === EPackageType.BASIC
        ? setbasicLocation
        : setPremiumLocation;

    setZip(value);
    setLocation(undefined);

    if (zipRegex.test(value)) {
      lookupZip(value, packageType);
    }
  };

  const handleSubmit = async (packageType: EPackageType) => {
    if (!userData.data) {
      setShowLoginModal(true);
      return;
    }

    router.push(`/profile/realestate/new?package=${packageType}&zip=${packageType === EPackageType.BASIC
      ? basicZip
      : premiumZip}&city=${packageType === EPackageType.BASIC
        ? basicLocation?.city
        : premiumLocation?.city}&state=${packageType === EPackageType.BASIC
          ? basicLocation?.state
          : premiumLocation?.state}`);
  };

  useEffect(() => {
    if (basicStatus === "success" || basicStatus === "error") {
      const timer = setTimeout(() => setBasicStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (premiumStatus === "success" || premiumStatus === "error") {
      const timer = setTimeout(() => setPremiumStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [basicStatus, premiumStatus]);

  if (userData.isLoading || pricesData.isLoading) {
    return <ListingPackagesSkeleton />;
  }

  if (pricesData.error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <p className="text-red-600 font-semibold">
          Unable to load listing packages.
        </p>
        <p className="text-sm text-gray-500 max-w-md">
          We couldn’t retrieve the available listing packages at the moment.
          Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => pricesData.mutate()}
          className="mt-2 inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {/* Basic Package Card */}
      <Card className="rounded-2xl border bg-white/70 shadow-sm p-4 md:p-6 h-full flex flex-col relative">
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-700 text-xs"
          >
            90 days
          </Badge>
        </div>

        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Basic
            </CardTitle>
            <span className="text-3xl font-bold text-[#002244]">$0</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1">
          {/* Package Features */}
          <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
            <div className="flex items-center gap-3">
              <Camera className="h-4 w-4 text-[#002244]" />
              <span className="text-sm">Up to 5 photos</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-[#002244]" />
              <span className="text-sm">
                Description up to 4,000 characters (~650–700 words)
              </span>
            </div>
          </div>

          {/* Included Features */}
          <div className="flex-1 mb-4">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Listing page with map + nearest base
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  BAH calculator, Unlimited edits
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Tags: VA eligible, Assumable loan, PCS-Ready, 3D Tour
                </span>
              </li>
            </ul>
          </div>

          {/* ZIP Form */}
          {!userData.data || userData.data.freeListingCredit ? (
            <div className="mt-auto space-y-3">
              <div className="space-y-2">
                <Label htmlFor="basic-zip" className="text-sm font-medium">
                  Enter ZIP to start
                </Label>

                <div className="flex gap-2">
                  <div className="w-full relative">
                    <Input
                      id="basic-zip"
                      type="text"
                      placeholder="12345"
                      value={basicZip}
                      className="pr-5"
                      onChange={(e) =>
                        handleZipChange(e.target.value, EPackageType.BASIC)
                      }
                    />
                    {basicLoading && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Loader2 className="animate-spin w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <ButtonSubmit
                    onClick={() => handleSubmit(EPackageType.BASIC)}
                    className="bg-[#002244] hover:bg-[#001122] text-white focus:ring-2 focus:ring-[#002244] focus:ring-offset-2 md:px-4"
                    status={basicStatus}
                    statusText={{
                      loading: "Creation...",
                      success: "Created",
                      error: "Try again",
                      disabled: "Disabled",
                    }}
                    disabled={
                      basicStatus === "loading" || !basicZip || basicLoading
                    }
                  >
                    <ArrowRight className="h-4 w-4 md:hidden" />
                    <span className="hidden md:inline">Start</span>
                  </ButtonSubmit>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm">
              <b>Your free credits for placing listings have been used up.</b>{" "}
              Once a year, you are granted one free credit.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Premium Package Card */}
      {pricesData.data?.period && (
        <Card className="rounded-2xl border-2 border-[#002244] bg-white/70 shadow-sm p-4 md:p-6 h-full flex flex-col relative">
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 text-xs"
            >
              {pricesData.data.period} days
            </Badge>
          </div>

          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-[#002244] text-white px-4 py-1">
              Most Popular
            </Badge>
          </div>

          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Premium
              </CardTitle>
              <span className="text-3xl font-bold text-[#002244]">
                {pricesData.data
                  ? "$" + pricesData.data?.price.toLocaleString("en-US")
                  : "0"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col flex-1">
            {/* Package Features */}
            <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-3">
                <Camera className="h-4 w-4 text-[#002244]" />
                <span className="text-sm">
                  Everything in Basic plus up to 40 photos
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-red-500" />
                <span className="text-sm">
                  Red "Featured" badge on listing cards
                </span>
                <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 ml-2">
                  Featured
                </Badge>
              </div>
            </div>

            {/* Included Features */}
            <div className="flex-1 mb-4">
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Listing page with map + nearest base
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    BAH calculator, Unlimited edits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Tags: VA eligible, Assumable loan, PCS-Ready, 3D Tour
                  </span>
                </li>
              </ul>
            </div>

            {/* ZIP Form */}
            <div className="mt-auto space-y-3">
              <div className="space-y-2">
                <Label htmlFor="premium-zip" className="text-sm font-medium">
                  Enter ZIP to start
                </Label>

                <div className="flex gap-2">
                  <div className="w-full relative">
                    <Input
                      id="premium-zip"
                      type="text"
                      placeholder="12345"
                      value={premiumZip}
                      onChange={(e) =>
                        handleZipChange(e.target.value, EPackageType.PREMIUM)
                      }
                    />
                    {premiumLoading && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Loader2 className="animate-spin w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <ButtonSubmit
                    onClick={() => handleSubmit(EPackageType.PREMIUM)}
                    className="bg-[#002244] hover:bg-[#001122] text-white focus:ring-2 focus:ring-[#002244] focus:ring-offset-2 md:px-4"
                    status={premiumStatus}
                    statusText={{
                      loading: "Creation...",
                      success: "Created",
                      error: "Try again",
                      disabled: "Disabled",
                    }}
                    disabled={
                      premiumStatus === "loading" ||
                      !premiumZip ||
                      premiumLoading
                    }
                  >
                    <ArrowRight className="h-4 w-4 md:hidden" />
                    <span className="hidden md:inline">Start</span>
                  </ButtonSubmit>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ListingPackagesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-pulse">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border bg-white/70 shadow-sm p-4 md:p-6 h-full flex flex-col relative"
        >
          {/* Badge */}
          <div className="absolute top-3 right-3 h-5 w-16 rounded-full bg-gray-200" />

          {/* Header */}
          <div className="text-center pb-6 pt-2 space-y-3">
            <div className="h-6 w-24 mx-auto rounded bg-gray-300" />
            <div className="h-8 w-20 mx-auto rounded bg-gray-300" />
          </div>

          {/* Features */}
          <div className="space-y-3 pb-4 border-b border-gray-200 mb-4">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>

          {/* Included list */}
          <div className="flex-1 space-y-3 mb-6">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-11/12 rounded bg-gray-200" />
            <div className="h-4 w-10/12 rounded bg-gray-200" />
          </div>

          {/* ZIP + button */}
          <div className="mt-auto space-y-3">
            <div className="h-4 w-32 rounded bg-gray-300" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 rounded-md bg-gray-200" />
              <div className="h-10 w-24 rounded-md bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
