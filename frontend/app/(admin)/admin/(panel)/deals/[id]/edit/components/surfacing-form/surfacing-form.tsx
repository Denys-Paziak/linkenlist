"use client";

import { Search, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../../../components/ui/card";
import { Label } from "../../../../../../../../../components/ui/label";
import { Switch } from "../../../../../../../../../components/ui/switch";
import { Button } from "../../../../../../../../../components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { IDeal } from "../../../../../../../../../types/Deal";
import {
  ButtonSubitStatus,
  renderStatusIcon,
} from "../../../../../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../../../../lib/fetcher";
import { DealsBrowser } from "./components/deals-browser";
import { RelatedManual } from "./components/related-manual";

export function SurfacingForm() {
  const { id: dealId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IDeal>(
    dealId ? `/admin/deals/${dealId}` : null
  );

  const [statusSwitchMode, setStatusSwitchMode] =
    useState<ButtonSubitStatus>("idle");

  const [showBrowser, setShowBrowser] = useState(false);
  const [selected, setSelected] = useState<number[]>(
    []
  );

  useEffect(() => {
    if (data) {
      setSelected(data.relatedManual.map((item) => item.target.id));
    }
  }, [data]);

  const switchMode = async () => {
    setStatusSwitchMode("loading");
    try {
      await fetcherAdmin(`/admin/deals/${dealId}/surfacing/related-mode`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          relatedAutoMode: !data?.relatedAutoMode,
        }),
      });

      setStatusSwitchMode("success");
      mutate(
        (draft) =>
          draft
            ? {
                ...draft,
                relatedAutoMode: !draft.relatedAutoMode,
              }
            : undefined,
        { revalidate: false }
      );
    } catch (err: any) {
      setStatusSwitchMode("error");
    }
  };

  useEffect(() => {
    if (statusSwitchMode === "success" || statusSwitchMode === "error") {
      const timer = setTimeout(() => setStatusSwitchMode("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusSwitchMode]);

  const loading = isValidating || statusSwitchMode === "loading";
  const loadError = error ? (error as any)?.message ?? "Failed to load" : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Surfacing & Layout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loadError ? <ErrorAlert message={loadError} /> : null}
        <fieldset disabled={loading || !data}>
          <div className="space-y-4">
            <Label>Related Deals</Label>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoRelated"
                  checked={data?.relatedAutoMode}
                  onCheckedChange={switchMode}
                />
                <Label htmlFor="autoRelated" className="text-sm">
                  Auto-select
                </Label>
                {renderStatusIcon(statusSwitchMode)}
              </div>
            </div>
            {!data?.relatedAutoMode && (
              <>
                <div className="space-y-4">
                  {data?.relatedManual.map((item) => (
                    <RelatedManual key={item.target.id} data={item.target} />
                  ))}
                </div>
                <div className="space-y-4">
                  {!showBrowser ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Search className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Search and select related deals
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() => setShowBrowser(true)}
                      >
                        Browse Deals
                      </Button>
                    </div>
                  ) : (
                    <DealsBrowser
                      closeBrowser={() => {
                        setShowBrowser(false);
                      }}
                      selected={selected}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}
