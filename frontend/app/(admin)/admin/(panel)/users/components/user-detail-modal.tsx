"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "../../../../../../components/ui/badge";
import { CreditCard, LogOut, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../components/ui/dialog";
import { Button } from "../../../../../../components/ui/button";
import { ForceLogoutForm } from "./force-logout-form";
import { ResetPasswordForm } from "./reset-password-form";
import { SuspendBanForm } from "./suspend-ban-form";
import { Label } from "../../../../../../components/ui/label";
import { useQueryStateWithLocalStorage } from "../../../../../../hooks/use-query-state-with-local-storage";
import { parseAsInteger } from "nuqs";
import useSWR from "swr";
import { IUserTable } from "../../../../../../types/User";
import { capitalize, isoToDatetimeLocal } from "../../../../../../lib/utils";
import Link from "next/link";
import FreeListingCredit from "./free-listing-credit";
import { renderAddress } from "../../../../../../components/realestate-card";
import { EListingStatus } from "../../../../../../types/Realestate";

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start justify-between gap-3">
      <div>
        <div className="font-medium">Failed to load user data</div>
        <div className="mt-1 opacity-90">{message}</div>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="space-y-6 py-6">
      <div className="space-y-3">
        <div className="h-5 w-28 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-9 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-36 bg-gray-200 rounded" />
          <div className="h-9 w-36 bg-gray-200 rounded" />
          <div className="h-9 w-28 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-24 w-full bg-gray-200 rounded" />
      </div>

      <div className="space-y-3">
        <div className="h-5 w-44 bg-gray-200 rounded" />
        <div className="h-9 w-full bg-gray-200 rounded" />
      </div>

      <div className="space-y-3">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-20 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function UserDetailModal() {
  const [userId, setUser] = useQueryStateWithLocalStorage("/admin/users?user", {
    defaultValue: null,
    parse: (v) => parseAsInteger.parse(v),
    sync: true,
  });

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const params = useMemo(() => {
    const p = new URLSearchParams({
      page: page ? String(page) : "1",
      limit: limit ? String(limit) : "9",
    });

    if (search && search.length >= 2) p.set("search", search);

    if (status) {
      if (status === "active") p.set("banned", "");
      if (status === "suspended") p.set("banned", "true");
    }
    return p;
  }, [page, limit, status, search]);

  const key = `/admin/users?${params.toString()}`;

  const { data, isValidating, error, mutate } = useSWR<[IUserTable[], number]>(
    key,
    {
      revalidateIfStale: true,
    },
  );

  const isInitialLoading = !data && !error;
  const userData = useMemo(() => {
    return data?.[0].find((item) => item.id === userId);
  }, [userId, data]);
  const userMissing = !!userId && !!data && !userData;

  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showForceLogoutDialog, setShowForceLogoutDialog] = useState(false);

  const actionsDisabled = isInitialLoading || !!error;

  const isBaned =
    userData?.banExpirationDate &&
    new Date(userData?.banExpirationDate).getTime() > new Date().getTime();

  return (
    <Dialog open={!!userId} onOpenChange={() => setUser(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="h-full flex flex-col">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Manage user account and permissions
                </DialogDescription>
              </div>

              {data && isValidating && (
                <div className="text-xs text-gray-500 mt-1">Updating…</div>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-6">
            {/* Error state */}
            {error && (
              <ErrorBanner
                message={
                  error instanceof Error ? error.message : "Unknown error"
                }
                onRetry={() => mutate()}
              />
            )}

            {/* Initial loading */}
            {isInitialLoading && <LoadingBlock />}

            {/* User not found in loaded list */}
            {userMissing && !error && (
              <div className="rounded-md border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                User not found on this page of results. Try adjusting filters or
                opening the correct page.
              </div>
            )}

            {/* Main content */}
            {!isInitialLoading && !error && userData && (
              <>
                {/* Overview */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                        {(
                          (userData?.firstName || "") +
                          " " +
                          (userData?.lastName || "")
                        ).trim() || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <Label>Username</Label>
                      <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                        {userData?.username || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                        {userData?.privateEmail || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                        {userData?.phone || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <Label>Company Name</Label>
                      <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                        {userData?.company || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <Label>Registration Date</Label>
                      <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                        {isoToDatetimeLocal(userData?.createdAt, false)}
                      </div>
                    </div>

                    {isBaned && (
                      <div className="col-span-2">
                        <Label>Suspended Until</Label>
                        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                          {isoToDatetimeLocal(
                            userData.banExpirationDate,
                            false,
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog
                      open={showResetPasswordDialog}
                      onOpenChange={setShowResetPasswordDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionsDisabled}
                        >
                          Reset Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reset User Password</DialogTitle>
                          <DialogDescription>
                            Reset password for {userData?.username}
                          </DialogDescription>
                        </DialogHeader>
                        <ResetPasswordForm
                          user={userData}
                          onCancel={() => setShowResetPasswordDialog(false)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={showForceLogoutDialog}
                      onOpenChange={setShowForceLogoutDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionsDisabled}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Force Logout
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Force User Logout</DialogTitle>
                          <DialogDescription>
                            Force logout {userData?.username} from their account
                          </DialogDescription>
                        </DialogHeader>
                        <ForceLogoutForm
                          user={userData}
                          onCancel={() => setShowForceLogoutDialog(false)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={showSuspendDialog}
                      onOpenChange={setShowSuspendDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant={isBaned ? "secondary" : "destructive"}
                          size="sm"
                          disabled={actionsDisabled}
                        >
                          {isBaned ? "Unblock" : "Suspend/Ban"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {isBaned ? (
                          <DialogHeader>
                            <DialogTitle>Unblock User</DialogTitle>
                            <DialogDescription>
                              Unblock user account
                            </DialogDescription>
                          </DialogHeader>
                        ) : (
                          <DialogHeader>
                            <DialogTitle>Suspend/Ban User</DialogTitle>
                            <DialogDescription>
                              Suspend user account
                            </DialogDescription>
                          </DialogHeader>
                        )}

                        <SuspendBanForm
                          user={userData}
                          mutate={mutate}
                          onCancel={() => setShowSuspendDialog(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Reported Content */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Reported Content</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Real Estate Listings Reports
                        </p>
                        <p className="text-sm text-gray-600">
                          Number of reports against this user's listings
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {0}
                        </div>
                        <div className="text-sm text-gray-500">
                          Active Reports
                        </div>
                      </div>
                    </div>
                    {0 > 0 && (
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          View Reports
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <FreeListingCredit
                  user={userData}
                  disabled={actionsDisabled}
                  mutate={mutate}
                />

                {/* Listings Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Listings ({userData?.listings.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {userData?.listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <Link
                            href={`/realestate/${listing.slug}`}
                            className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                          >
                            {renderAddress(listing)}
                          </Link>
                          <div className="text-sm text-gray-600">
                            {listing.forRent ? "Rent" : "Sale"} •{" "}
                            {capitalize(listing.package)} 
                            {listing.expiresAt
                              ? " • Expires " +
                                new Date(listing.expiresAt).toLocaleDateString()
                              : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              listing.status === EListingStatus.ACTIVE
                                ? "default"
                                : "secondary"
                            }
                          >
                            {listing.status}
                          </Badge>
                          <Link href={`/realestate/${listing.slug}`}>
                            <Button variant="ghost" size="sm">
                              Open
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {userData?.listings.length === 0 && (
                      <p className="text-sm text-gray-500">No listings found</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
