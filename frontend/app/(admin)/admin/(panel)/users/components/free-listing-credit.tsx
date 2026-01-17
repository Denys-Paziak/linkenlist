import { CreditCard, Trash2 } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import { IUserTable } from "../../../../../../types/User";
import { useEffect, useState } from "react";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";
import { KeyedMutator } from "swr";

export default function FreeListingCredit({
  user,
  disabled,
  mutate,
}: {
  user: IUserTable;
  disabled: boolean;
  mutate: KeyedMutator<[IUserTable[], number]>;
}) {
  const [statusGrant, setStatusGrant] = useState<ButtonSubmitStatus>("idle");
  const [statusRevoke, setStatusRevoke] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const grant = async () => {
    setFormError(null);

    setStatusGrant("loading");
    try {
      await fetcherAdmin(`/admin/users/${user.id}/grant-free-listing-credit`, {
        method: "PATCH",
        credentials: "include",
      });

      setStatusGrant("success");
      mutate();
    } catch (err: any) {
      setStatusGrant("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  const revoke = async () => {
    setFormError(null);

    setStatusRevoke("loading");
    try {
      await fetcherAdmin(`/admin/users/${user.id}/revoke-free-listing-credit`, {
        method: "PATCH",
        credentials: "include",
      });

      setStatusRevoke("success");
      mutate();
    } catch (err: any) {
      setStatusRevoke("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (statusGrant === "success" || statusGrant === "error") {
      const timer = setTimeout(() => setStatusGrant("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (statusRevoke === "success" || statusRevoke === "error") {
      const timer = setTimeout(() => setStatusRevoke("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusGrant, statusRevoke]);

  const loading = statusGrant === "loading" || statusRevoke === "loading";

  return (
    <fieldset disabled={loading}>
      <div className="space-y-4">
        <h3 className="font-semibold">Free Listing Credit</h3>
        {formError ? <ErrorAlert message={formError} /> : null}
        <div className="flex items-center justify-between">
          <span>Used this year: {user.freeListingCredit}</span>
          <div className="flex gap-2">
            <ButtonSubmit
              type="button"
              variant="outline"
              size="sm"
              onClick={grant}
              disabled={disabled}
              status={statusGrant}
              statusText={{
                loading: "In process...",
                success: "Success",
                error: "Try again",
                disabled: "Disabled",
              }}
              className="font-semibold"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Grant
            </ButtonSubmit>

            <ButtonSubmit
              type="button"
              variant="outline"
              size="sm"
              onClick={revoke}
              disabled={disabled}
              status={statusRevoke}
              statusText={{
                loading: "In process...",
                success: "Success",
                error: "Try again",
                disabled: "Disabled",
              }}
              className="font-semibold"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke
            </ButtonSubmit>
          </div>
        </div>
      </div>
    </fieldset>
  );
}
