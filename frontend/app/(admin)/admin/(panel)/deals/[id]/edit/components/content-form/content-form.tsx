"use client";

import { FileText, Loader2, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../../../components/ui/card";
import { Section } from "./components/section";
import useSWR from "swr";
import { IDeal, IDealSection } from "../../../../../../../../../types/Deal";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../../../../components/ui/button-submit";
import { useEffect, useState } from "react";
import { fetcherAdmin } from "../../../../../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../../../../../components/ui/error-alert";
import { useParams } from "next/navigation";

export function ContentForm() {
  const { id: dealId } = useParams();

  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const { data, error, isLoading, isValidating, mutate } = useSWR<IDeal>(
    dealId ? `/admin/deals/${dealId}` : null
  );

  const addSection = async () => {
    setFormError(null);

    setStatus("loading");
    try {
      const newSection: IDealSection = await fetcherAdmin(
        `/admin/deals/${dealId}/content-section`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      setStatus("success");
      mutate<IDeal>(
        (draft) =>
          draft
            ? {
                ...draft,
                sections: [...draft.sections, newSection],
              }
            : undefined,
        { revalidate: true }
      );
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const loading = isValidating || status === "loading";
  const loadError = error ? (error as any)?.message ?? "Failed to load" : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Content Blocks
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {loadError ? <ErrorAlert message={loadError} /> : null}
        {formError ? <ErrorAlert message={formError} /> : null}
        {isLoading ? (
          <Loader2
            className="animate-spin mx-auto  w-12 h-12"
            aria-hidden="true"
          />
        ) : null}
        {data?.sections.map((section: IDealSection, index: number) => (
          <Section
            key={section.id}
            section={section}
            allSections={data.sections}
            index={index}
          />
        ))}

        <div className="flex gap-2">
          <ButtonSubmit
            type="button"
            variant="outline"
            onClick={addSection}
            status={status}
            statusText={{
              loading: "Adding...",
              success: "Added",
              error: "Try again",
              disabled: "Disabled",
            }}
            className="font-semibold"
            disabled={loading || !data}
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add Custom Section
          </ButtonSubmit>
        </div>
      </CardContent>
    </Card>
  );
}
