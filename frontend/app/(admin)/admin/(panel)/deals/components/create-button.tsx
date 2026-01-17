"use client";

import { useEffect, useState } from "react";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateButton() {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const router = useRouter();

  const createDeal = async () => {
    setStatus("loading");
    try {
      const data = await fetcherAdmin(`/admin/deals/init`, {
        method: "POST",
        credentials: "include",
      });

      router.push(`/admin/deals/${data.id}/edit`);
    } catch (err: any) {
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
      type="button"
      onClick={createDeal}
      status={status}
      statusText={{
        loading: "Creation...",
        success: "Created",
        error: "Try again",
        disabled: "Disabled",
      }}
      disabled={status === "loading"}
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Deal
    </ButtonSubmit>
  );
}
