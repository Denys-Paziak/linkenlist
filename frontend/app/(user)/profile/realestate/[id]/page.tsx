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
  IRealestateOwnerList,
} from "../../../../../types/Realestate";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetcherUser } from "../../../../../lib/fetcher";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../components/ui/error-alert";
import { capitalize, cn } from "../../../../../lib/utils";
import { Media } from "./components/media/media";
import { Pricing } from "./components/pricing/pricing";
import { Property } from "./components/property/property";
import { IUser } from "../../../../../types/User";
import { Button } from "../../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PublishDialog } from "./components/publish-dialog";
import { SaveStatusDialog } from "./components/save-status-dialog";

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
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

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
    isValidating,
    error: loadError,
  } = useSWR<IOwnerRealestate>("/listings/my/" + id, {
    revalidateIfStale: true,
  });

  const [saveStatus, setSaveStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const [showSaveStatusDialog, setShowSaveStatusDialog] = useState<boolean>(false);
  const [textSaveStatusDialog, setTextSaveStatusDialog] = useState<string>("");

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
      if (!res) continue;

      if (!res.ok) {
        setSaveStatus("error");
        setFormError("Please fix the errors below.");
        return "error"
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

    const formsData = await getFormsData() as any;

    if (Object.keys(formsData).length === 0) {
      setSaveStatus("success");
      if (!(realestate?.status !== EListingStatus.ACTIVE &&
        realestate?.status !== EListingStatus.PENDING &&
        !realestate?.isExpired)) {
        setShowSaveStatusDialog(true)
        setTextSaveStatusDialog("Changes were successfully applied to your listing.")
      }
      return true;
    }

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

      if (!(realestate?.status !== EListingStatus.ACTIVE &&
        realestate?.status !== EListingStatus.PENDING &&
        !realestate?.isExpired)) {
        setShowSaveStatusDialog(true)
        const toPending = Boolean(
          formsData.location ||
          formsData.property ||
          formsData.listingDetails ||
          formsData.amenities ||
          formsData.outdoorFeatures ||
          formsData.indoorFeatures ||
          formsData.constructionAndLegalRecords ||
          formsData.utilitiesEnergyConnectivity ||
          formsData.photos
        )
        setTextSaveStatusDialog(toPending ? "Your edits will take effect upon review by a moderator (within 24 hrs). No other action is required at this time." : "Changes were successfully applied to your listing.")
      }

      sellerRef.current?.resetDirty();
      locationRef.current?.resetDirty();
      pricingRef.current?.resetDirty();
      propertyRef.current?.resetDirty();
      listingDetailsRef.current?.resetDirty();
      amenitiesRef.current?.resetDirty();
      outdoorFeaturesRef.current?.resetDirty();
      indoorFeaturesRef.current?.resetDirty();
      constructionAndLegalRecordsRef.current?.resetDirty();
      utilitiesEnergyConnectivityRef.current?.resetDirty();
      mediaRef.current?.resetDirty();

      return true;
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

      return false
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
          {
            searchParams.get("create") === "success"
              ? <>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Complete Your Listing
                  </h1>
                  <p className="text-gray-600">
                    Add photos, features, and publish your listing
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center flex-shrink-0 justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-800">
                        Great! Your listing is linked to your account.
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        Continue editing, and you can always manage it in Profile → My
                        Real Estate.
                      </p>
                    </div>
                  </div>
                </div>
              </>
              : <>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Edit Real Estate Listing
                  </h1>
                  <p className="text-gray-600">
                    Fill out your seller information and property details
                  </p>
                </div>
              </>
          }

          {loadError ? (
            <div className="mb-6"> <ErrorAlert message={"Failed to retrieve data"} />  </div>
          ) : null}
          {formError ? <div className="mb-6"><ErrorAlert message={formError} /> </div> : null}

          <fieldset
            disabled={isLoading || isValidating || loadError}
            className="mb-1"
          >
            <div className="grid grid-cols-1 gap-8 w-full">
              <div className="max-w-6xl mx-auto p-6 space-y-8 px-0 py-0 w-full">
                <div
                  className={cn(
                    "hidden space-y-8 w-full",
                    !step && "block",
                  )}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Seller ref={sellerRef} data={realestate} />
                    <Location ref={locationRef} data={realestate} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Pricing ref={pricingRef} data={realestate} />
                    <Property ref={propertyRef} data={realestate} />
                  </div>
                  <ListingDetails
                    ref={listingDetailsRef}
                    data={realestate}
                  />
                  <Amenities ref={amenitiesRef} data={realestate} />
                </div>
                <div
                  className={cn(
                    "hidden space-y-8 w-full",
                    step === "2" && "block",
                  )}
                >
                  <OutdoorFeatures
                    ref={outdoorFeaturesRef}
                    data={realestate}
                  />
                  <IndoorFeatures
                    ref={indoorFeaturesRef}
                    data={realestate}
                  />
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
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2 sm:gap-4 ml-auto">
                    {!step ? (
                      <Button
                        type="button"
                        onClick={async () => {
                          const res = await getFormsData();
                          if (res === "error") {
                            return
                          };
                          setSaveStatus("idle");
                          setFormError(null);
                          router.push(`/profile/realestate/${id}?step=2`);
                        }}
                        className="w-full"
                      >
                        Continue
                      </Button>
                    ) : step === "2" ? (
                      <div className="flex justify-between w-full">
                        <Button
                          variant="outline"
                          onClick={async () => {

                            router.push(`/profile/realestate/${id}`);
                          }}
                        >
                          <ArrowLeft />
                          Back
                        </Button>
                        <div className="flex gap-3">

                          {realestate?.status !== EListingStatus.ACTIVE &&
                            realestate?.status !== EListingStatus.PENDING &&
                            !realestate?.isExpired ? (
                            <PublishButton
                              listing={realestate}
                              onClick={handleSaveDraft}
                              saveStatusLoading={saveStatus === "loading"}
                              setErrors={setFormError}
                            />
                          ) : (
                            <>
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
                              <SaveStatusDialog showDialog={showSaveStatusDialog} handleCancel={() => {
                                setShowSaveStatusDialog(false)
                              }} text={textSaveStatusDialog} />
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </main>
    </div>
  );
}

export function otherFieldSplit<const F extends string>(
  fieldName: F,
  values?: string[],
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

function PublishButton({
  listing,
  onClick,
  saveStatusLoading,
  setErrors
}: {
  listing?: Pick<
    IRealestateOwnerList,
    "id" | "package" | "expiresAt" | "isExpired"
  >;
  onClick: () => Promise<boolean>;
  saveStatusLoading: boolean;
  setErrors: (errors: string | null) => void;
}) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");

  const router = useRouter();

  const handleSubmit = async () => {
    if (!listing) {
      return
    }

    setErrors(null);
    setStatus("loading");

    try {
      const data = await fetcherUser(`/listings/${listing.id}/publish`, {
        method: "PATCH",
        credentials: "include",
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push('/profile/realestate/success')
      }

      setStatus("success");
    } catch (err: any) {
      setErrors(err?.message ?? "Failed to publish the listing.");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <ButtonSubmit
      onClick={async () => {
        const res = await onClick();
        if (res) {
          await handleSubmit();
        }
      }}
      type="button"
      status={saveStatusLoading ? "loading" : status}
      statusText={{
        loading: "Submitting...",
        success: "Submitted",
        error: "Try again",
        disabled: "Disabled",
      }}
    >
      Submit Listing
    </ButtonSubmit>
  );
}
