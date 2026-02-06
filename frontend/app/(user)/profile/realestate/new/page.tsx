"use client";

import { useEffect, useRef, useState } from "react";
import { Seller } from "./components/seller";
import { Location } from "./components/location";
import { ListingDetails } from "./components/listing-details";
import { Amenities } from "./components/amenities";
import Link from "next/link";
import useSWR from "swr";

import { useRouter, useSearchParams } from "next/navigation";
import { fetcherUser } from "../../../../../lib/fetcher";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../components/ui/error-alert";
import { capitalize } from "../../../../../lib/utils";
import { Pricing } from "./components/pricing/pricing";
import { Property } from "./components/property/property";
import { IUser } from "../../../../../types/User";
import { IOwnerRealestate } from "../../../../../types/Realestate";

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
  const searchParams = useSearchParams()

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

  const [saveStatus, setSaveStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const sellerRef = useRef<FormHandle>(null);
  const locationRef = useRef<FormHandle>(null);
  const pricingRef = useRef<FormHandle>(null);
  const propertyRef = useRef<FormHandle>(null);
  const listingDetailsRef = useRef<FormHandle>(null);
  const amenitiesRef = useRef<FormHandle>(null);

  const getFormsDataContinue = async () => {
    const formsResults = await Promise.all([
      sellerRef.current?.submit(),
      locationRef.current?.submit(),
      pricingRef.current?.submit(),
      propertyRef.current?.submit(),
      listingDetailsRef.current?.submit(),
      amenitiesRef.current?.submit(),
    ]);

    let formsData = {};

    for (const res of formsResults) {
      if (!res) continue

      if (!res.ok) {
        setSaveStatus("error");
        setFormError("Please fix the errors below.");
        break;
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

  const handleContinue = async () => {
    setFormError(null);
    setSaveStatus("loading");

    const selectedPackage = searchParams.get("package")

    if (!["basic", "premium"].includes(selectedPackage || "")) {
      setFormError("Selected package not available.");
      setSaveStatus("error");
      return
    }

    const formsData = await getFormsDataContinue();
    if (Object.keys(formsData).length === 0) return;

    try {
      let listingId: undefined | number = undefined

      if (adminStatus.data) {
        const data = await fetcherUser("/admin/listings/init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formsData,
            username: searchParams.get("username"),
            package: selectedPackage,
          }),
        });

        listingId = data.listingId as number
      } else {
        const data = await fetcherUser("/listings/init", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formsData,
            package: selectedPackage
          }),
        });

        listingId = data.listingId as number
      }
      setSaveStatus("success");

      sellerRef.current?.resetDirty()
      locationRef.current?.resetDirty()
      pricingRef.current?.resetDirty()
      propertyRef.current?.resetDirty()
      listingDetailsRef.current?.resetDirty()
      amenitiesRef.current?.resetDirty()

      router.push(`/profile/realestate/${listingId}?step=2&create=success`)
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
          {formError ? <ErrorAlert message={formError} /> : null}

          <fieldset className="mb-1">
            <div className="grid grid-cols-1 gap-8 w-full">
              <div className="max-w-6xl mx-auto p-6 space-y-8 px-0 py-0 pt-8 w-full">
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Seller ref={sellerRef} data={{
                      firstName: userStatus.data?.firstName,
                      lastName: userStatus.data?.lastName,
                      company: userStatus.data?.company,
                      primaryPhone: userStatus.data?.phone,
                      email: userStatus.data?.publicEmail
                    } as IOwnerRealestate} />
                    <Location ref={locationRef} data={{
                      zip: searchParams.get("zip"),
                      city: searchParams.get("city"),
                      state: searchParams.get("state"),
                    } as IOwnerRealestate} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Pricing ref={pricingRef} />
                    <Property ref={propertyRef} />
                  </div>
                  <ListingDetails ref={listingDetailsRef} data={{
                    package: searchParams.get("package")
                  } as IOwnerRealestate} />
                  <Amenities ref={amenitiesRef} />
                </>
                <div className="space-y-4">
                  <div className="flex gap-2 sm:gap-4 ml-auto">
                    <ButtonSubmit
                      type="button"
                      onClick={handleContinue}
                      status={saveStatus}
                      className="w-full"
                      statusText={{
                        loading: "Saving...",
                        success: "Saved",
                        error: "Try again",
                        disabled: "Disabled",
                      }}
                    >
                      Continue
                    </ButtonSubmit>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <div className="text-sm text-gray-600 leading-relaxed">
            Once you click "Continue," we'll save your listing draft. On the next page you can upload photos, add property details and publish. You can return anytime via "My Dashboard" to keep editing or complete payment to activate your listing. By clicking "Continue," you agree to LinkEnlist's {" "}
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
