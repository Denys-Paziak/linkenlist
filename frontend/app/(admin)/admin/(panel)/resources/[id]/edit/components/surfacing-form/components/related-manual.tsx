"use client";

import { useEffect, useState } from "react";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../../../../components/ui/button-submit";
import { StatusChip } from "../../../../../../../../../../components/ui/status-chip";
import { fetcherAdmin } from "../../../../../../../../../../lib/fetcher";
import { useParams } from "next/navigation";
import { mutate } from "swr";
import { IResourceListExtended } from "../../../../../../../../../../types/Resource";

export function RelatedManual({ data }: { data: IResourceListExtended }) {
  const { id: resourceId } = useParams();

  const [statusRemoved, setStatusRemoved] = useState<ButtonSubmitStatus>("idle");

  const deleteSelected = async () => {
    setStatusRemoved("loading");
    try {
      await fetcherAdmin(`/admin/resources/${resourceId}/related-resources`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resourceIds: [data.id],
        }),
      });

      mutate(`/admin/resources/${resourceId}`).then(() => {
        setStatusRemoved("success");
      });
    } catch (err: any) {
      setStatusRemoved("error");
    }
  };

  useEffect(() => {
    if (statusRemoved === "success" || statusRemoved === "error") {
      const timer = setTimeout(() => setStatusRemoved("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusRemoved]);

  return (
    <div
      key={data.id}
      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
    >
      <div className="flex items-center space-x-3">
        <div>
          <p className="font-medium text-gray-900">
            {data.title || "[Not specified]"}
          </p>
          <p className="text-sm text-gray-500">
            {"https://linkenlist.com/resources/" + (data.slug || "[Not specified]")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusChip text={data.status} status={data.status} />

        <ButtonSubmit
          size="sm"
          variant="destructive"
          onClick={deleteSelected}
          status={statusRemoved}
          statusText={{
            loading: "Removal...",
            success: "Removed",
            error: "Try again",
            disabled: "Disabled",
          }}
        >
          Remove selection
        </ButtonSubmit>
      </div>
    </div>
  );
}
