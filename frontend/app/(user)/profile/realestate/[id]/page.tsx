"use client";

import { useEffect, useRef, useState } from "react";
import { Seller } from "./components/seller";
import { Location } from "./components/location";
import { ListingDetails } from "./components/listing-details";
import { Amenities } from "./components/amenities";
import Link from "next/link";
import { OutdoorFeatures } from "./components/outdoor-features/outdoor-features";
import { IndoorFeatures } from "./components/indoor-features/indoor-features";
import { ConstructionAndLegalRecords } from "./components/construction-and-legal-records/construction-and-legal-records";
import { UtilitiesEnergyConnectivity } from "./components/utilities-energy-connectivity/utilities-energy-connectivity";
import useSWR from "swr";
import {
  EListingStatus,
  EPackageType,
  IOwnerRealestate,
} from "../../../../../types/Realestate";
import { useParams, useRouter } from "next/navigation";
import { fetcherUser } from "../../../../../lib/fetcher";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../components/ui/error-alert";
import { capitalize } from "../../../../../lib/utils";
import { Media } from "./components/media/media";
import { Pricing } from "./components/pricing/pricing";
import { Property } from "./components/property/property";
import { IUser } from "../../../../../types/User";

export interface FormHandle {
  submit: () => Promise<
    | { ok: true; changed: true; data: any }
    | { ok: true; changed: false }
    | { ok: false }
  >;
  setError?: (fields: string[]) => void;
  resetDirty: () => void;
}

export default function EditRealestatePage() {
  const userStatus = useSWR<IUser>("/users/self");  
  const adminStatus = useSWR("/admin/users/self");

  const router = useRouter();

  useEffect(() => {
    if (
      userStatus.error ||
      (!userStatus.data && !(userStatus.isLoading || userStatus.isValidating))
    ) {
      if (!adminStatus.data) {
        router.push("/auth/signin?tab=login");
        return;
      }
    }
  }, [userStatus.data, userStatus.error]);

  const { id } = useParams();

  const {
    data: realestate,
    isLoading,
    error: loadError,
  } = useSWR<IOwnerRealestate>("/listings/my/" + id);

  const [saveStatus, setSaveStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const sellerRef = useRef<FormHandle>(null);
  const locationRef = useRef<FormHandle>(null);
  const pricingRef = useRef<FormHandle>(null);
  const propertyRef = useRef<FormHandle>(null);
  const listingDetailsRef = useRef<FormHandle>(null);
  const amenitiesRef = useRef<FormHandle>(null);
  const outdoorFeaturesRef = useRef<FormHandle>(null);
  const indoorFeaturesRef = useRef<FormHandle>(null);
  const constructionAndLegalRecordsRef = useRef<FormHandle>(null);
  const utilitiesEnergyConnectivityRef = useRef<FormHandle>(null);
  const mediaRef = useRef<FormHandle>(null);

  const getFormsData = async () => {
    const formsResults = await Promise.all([
      sellerRef.current?.submit(),
      locationRef.current?.submit(),
      pricingRef.current?.submit(),
      propertyRef.current?.submit(),
      listingDetailsRef.current?.submit(),
      amenitiesRef.current?.submit(),
      outdoorFeaturesRef.current?.submit(),
      indoorFeaturesRef.current?.submit(),
      constructionAndLegalRecordsRef.current?.submit(),
      utilitiesEnergyConnectivityRef.current?.submit(),
      mediaRef.current?.submit(),
    ]);

    let formsData = {};

    for (const res of formsResults) {
      if (!res) {
        throw new Error("One of forms is not mounted");
      }

      if (!res.ok) {
        setSaveStatus("error");
        setFormError("Please fix the errors below.");
        return;
      }

      if (res.changed) {
        formsData = {
          ...formsData,
          ...res.data,
        };
      }
    }

    return formsData;
  };

  const handleSaveDraft = async () => {
    setFormError(null);
    setSaveStatus("loading");

    const formsData = await getFormsData();
    if (!formsData) return;

    try {
      await fetcherUser(`/listings/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formsData),
      });

      setSaveStatus("success");

      sellerRef.current?.resetDirty()
      locationRef.current?.resetDirty()
      pricingRef.current?.resetDirty()
      propertyRef.current?.resetDirty()
      listingDetailsRef.current?.resetDirty()
      amenitiesRef.current?.resetDirty()
      outdoorFeaturesRef.current?.resetDirty()
      indoorFeaturesRef.current?.resetDirty()
      constructionAndLegalRecordsRef.current?.resetDirty()
      utilitiesEnergyConnectivityRef.current?.resetDirty()
      mediaRef.current?.resetDirty()
    } catch (err: any) {
      setFormError(err?.message ?? "Unable to save the listing.");
      setSaveStatus("error");
      if (err?.message && err.message.includes("Missing fields:")) {
        const fields = (err.message as string)
          .replace("Missing fields:", "")
          .split(",");

        sellerRef.current?.setError?.(fields);
        locationRef.current?.setError?.(fields);
        pricingRef.current?.setError?.(fields);
        propertyRef.current?.setError?.(fields);
        listingDetailsRef.current?.setError?.(fields);
        amenitiesRef.current?.setError?.(fields);
        outdoorFeaturesRef.current?.setError?.(fields);
        indoorFeaturesRef.current?.setError?.(fields);
        constructionAndLegalRecordsRef.current?.setError?.(fields);
        utilitiesEnergyConnectivityRef.current?.setError?.(fields);
        mediaRef.current?.setError?.(fields);
      }
    }
  };

  useEffect(() => {
    if (saveStatus === "success" || saveStatus === "error") {
      const timer = setTimeout(() => setSaveStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Real Estate Listing
            </h1>
            <p className="text-gray-600">
              Fill out your seller information and property details
            </p>
          </div>
          {loadError ? (
            <ErrorAlert message={"Failed to retrieve data"} />
          ) : null}
          {formError ? <ErrorAlert message={formError} /> : null}

          <fieldset disabled={isLoading || loadError} className="mb-1">
            <div className="grid grid-cols-1 gap-8 w-full">
              <div className="max-w-6xl mx-auto p-6 space-y-8 px-0 py-0 pt-8 w-full">
                {realestate?.status === EListingStatus.ACTIVE &&
                  realestate?.package === EPackageType.BASIC && (
                    <p className="text-gray-600 font-bold">
                      To be able to edit any information, set the listing to
                      inactive status.
                    </p>
                  )}
                {realestate?.status === EListingStatus.ACTIVE &&
                realestate?.package === EPackageType.BASIC ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                      <Seller ref={sellerRef} data={realestate} />
                      <Pricing ref={pricingRef} data={realestate} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Seller ref={sellerRef} data={realestate} />
                      <Location ref={locationRef} data={realestate} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Pricing ref={pricingRef} data={realestate} />
                      <Property ref={propertyRef} data={realestate} />
                    </div>
                    <ListingDetails ref={listingDetailsRef} data={realestate} />
                    <Amenities ref={amenitiesRef} data={realestate} />
                    <OutdoorFeatures
                      ref={outdoorFeaturesRef}
                      data={realestate}
                    />
                    <IndoorFeatures ref={indoorFeaturesRef} data={realestate} />
                    <ConstructionAndLegalRecords
                      ref={constructionAndLegalRecordsRef}
                      data={realestate}
                    />
                    <UtilitiesEnergyConnectivity
                      ref={utilitiesEnergyConnectivityRef}
                      data={realestate}
                    />
                    <Media
                      ref={mediaRef}
                      data={realestate?.photos}
                      selectedPackage={
                        realestate?.package || EPackageType.BASIC
                      }
                    />
                  </>
                )}
                <div className="space-y-4">
                  <div className="flex gap-2 sm:gap-4 ml-auto">
                    <ButtonSubmit
                      type="button"
                      onClick={handleSaveDraft}
                      status={saveStatus}
                      statusText={{
                        loading: "Saving...",
                        success: "Saved",
                        error: "Try again",
                        disabled: "Disabled",
                      }}
                    >
                      Save
                    </ButtonSubmit>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <div className="text-sm text-gray-600 leading-relaxed">
            By clicking "Publish Listing" you agree to LinkEnlist's{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </main>
    </div>
  );
}

export function otherFieldSplit<const F extends string>(
  fieldName: F,
  values?: string[]
) {
  const main = values?.filter((item) => !item.startsWith("OTHER:::")) || [];
  const other =
    values
      ?.findLast((item) => item.startsWith("OTHER:::"))
      ?.replace("OTHER:::", "") || "";

  return {
    [fieldName]: main,
    [`other${capitalize(fieldName)}`]: other,
  } as Record<F, string[]> & Record<`other${Capitalize<F>}`, string>;
}
