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
import {
  ButtonSubitStatus,
  renderStatusIcon,
} from "../../../../../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../../../../lib/fetcher";
import { ResourcesBrowser } from "./components/resources-browser";
import { RelatedManual } from "./components/related-manual";
import { IResource } from "../../../../../../../../../types/Resource";

export function SurfacingForm() {
  const { id: resourceId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IResource>(
    resourceId ? `/admin/resources/${resourceId}` : null
  );

  const [statusSwitchMode, setStatusSwitchMode] =
    useState<ButtonSubitStatus>("idle");
  const [statusFeatured, setStatusFeatured] =
    useState<ButtonSubitStatus>("idle");

  const [showBrowser, setShowBrowser] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (data) {
      setSelected(data.relatedManual.map((item) => item.target.id));
    }
  }, [data]);

  const switchMode = async () => {
    setStatusSwitchMode("loading");
    try {
      await fetcherAdmin(
        `/admin/resources/${resourceId}/surfacing/related-mode`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            relatedAutoMode: !data?.relatedAutoMode,
          }),
        }
      );

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

  const switchFeatured = async () => {
    setStatusFeatured("loading");
    try {
      await fetcherAdmin(`/admin/resources/${resourceId}/surfacing/featured`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFeatured: !data?.isFeatured,
        }),
      });

      setStatusFeatured("success");
      mutate(
        (draft) =>
          draft
            ? {
                ...draft,
                isFeatured: !draft.isFeatured,
              }
            : undefined,
        { revalidate: false }
      );
    } catch (err: any) {
      setStatusFeatured("error");
    }
  };

  useEffect(() => {
    if (statusSwitchMode === "success" || statusSwitchMode === "error") {
      const timer = setTimeout(() => setStatusSwitchMode("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (statusFeatured === "success" || statusFeatured === "error") {
      const timer = setTimeout(() => setStatusFeatured("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusSwitchMode, statusFeatured]);

  const loading =
    isValidating ||
    statusSwitchMode === "loading" ||
    statusFeatured === "loading";
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
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Related Resources</Label>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoRelated"
                    checked={data?.relatedAutoMode}
                    onCheckedChange={switchMode}
                  />
                  <Label htmlFor="autoRelated" className="text-sm mb-0">
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
                          Search and select related resources
                        </p>
                        <Button
                          variant="outline"
                          className="mt-2 bg-transparent"
                          onClick={() => setShowBrowser(true)}
                        >
                          Browse Resources
                        </Button>
                      </div>
                    ) : (
                      <ResourcesBrowser
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={data?.isFeatured}
                  onCheckedChange={switchFeatured}
                />
                <Label htmlFor="isFeatured" className="text-sm mb-0">
                  Featured
                </Label>
                {renderStatusIcon(statusFeatured)}
              </div>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}
