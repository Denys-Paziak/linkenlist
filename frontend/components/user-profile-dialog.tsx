import Image from "next/image";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { IUser } from "../types/User";
import useSWR from "swr";
import { formatDateDiff, getInitials } from "../lib/utils";

type userInfo = Pick<
  IUser,
  | "id"
  | "avatar"
  | "createdAt"
  | "firstName"
  | "lastName"
  | "publicEmail"
  | "professionalTitle"
  | "company"
> & {
  primaryPhone: string;
  alternativePhone: string;
  listings: {
    forRent: number;
    forSale: number;
  };
};

export function UserProfileDialog({
  onClose,
  userId,
  userInfo,
}: {
  onClose: () => void;
  userId?: number;
  userInfo?: userInfo;
}) {
  const shouldFetch = !userInfo && !!userId;

  const {
    data: user,
    isLoading,
    error,
  } = useSWR<userInfo>(shouldFetch ? `/users/${userId}` : null);

  const data = userInfo || user;

  const showLoading = shouldFetch && isLoading && !data;
  const showError = shouldFetch && !!error && !data;

  return (
    <div
      className="fixed inset-0 z-[10003] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Agent Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {showLoading ? (
          <div className="py-10 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4"/>
            <p className="text-sm text-gray-600">Loading profile...</p>
          </div>
        ) : showError ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              !
            </div>
            <p className="text-base font-semibold text-gray-900">
              User not found
            </p>
            <p className="mt-1 text-sm text-gray-600">
              This user doesn’t exist or the profile is private.
            </p>

            <div className="mt-5">
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        ) : data ? (
          <>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#002244] to-[#003366] flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-3 overflow-hidden">
                {data.avatar ? (
                  <Image
                    src={data.avatar.url}
                    alt={`${data.firstName} ${data.lastName}`}
                    width={data.avatar.width}
                    height={data.avatar.height}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(`${data.firstName} ${data.lastName}`)
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {data.firstName} {data.lastName}
              </h3>
              <p className="text-sm text-gray-600">{data.professionalTitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Contact Information
                </h4>
                {data.primaryPhone && (
                  <p className="text-sm text-gray-600">📞 {data.primaryPhone}</p>
                )}
                {data.alternativePhone && (
                  <p className="text-sm text-gray-600">
                    📞 {data.alternativePhone}
                  </p>
                )}
                {data.publicEmail && (
                  <p className="text-sm text-gray-600">✉️ {data.publicEmail}</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Company Name</h4>
                <p className="text-sm text-gray-600">{data.company}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  LinkEnlist Experience
                </h4>
                <p className="text-sm text-gray-600">
                  Member since:{" "}
                  {new Date(data.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  ({formatDateDiff(data.createdAt)})
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Property Listings
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-[#002244]">
                      {data.listings.forSale}
                    </div>
                    <div className="text-[#002244]">For Sale</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-red-600">
                      {data.listings.forRent}
                    </div>
                    <div className="text-red-600">For Rent</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-600">No user selected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
