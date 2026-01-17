"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../../../../components/ui/button";
import { DialogFooter } from "../../../../../../components/ui/dialog";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { IUserTable } from "../../../../../../types/User";

export function ForceLogoutForm({
  onCancel,
  user,
}: {
  onCancel: () => void;
  user: IUserTable;
}) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const submitForm = async () => {
    setFormError(null);

    setStatus("loading");
    try {
      await fetcherAdmin(`/admin/users/${user.id}/force-logout`, {
        method: "PATCH",
        credentials: "include",
      });

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        setStatus("idle")
        onCancel()
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const loading = status === "loading";

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={loading}>
        {formError ? <ErrorAlert message={formError} /> : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <ButtonSubmit
            type="button"
            onClick={() => submitForm()}
            status={status}
            variant="destructive"
            statusText={{
              loading: "Logout...",
              success: "Successfully",
              error: "Try again",
              disabled: "Disabled",
            }}
            className="font-semibold"
          >
            Force Logout
          </ButtonSubmit>
        </DialogFooter>
      </fieldset>
    </form>
  );
}
