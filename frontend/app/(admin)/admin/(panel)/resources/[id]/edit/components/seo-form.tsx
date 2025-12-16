"use client";

import { CheckCircle, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../../components/ui/card";
import { Label } from "../../../../../../../../components/ui/label";
import { Textarea } from "../../../../../../../../components/ui/textarea";
import { Switch } from "../../../../../../../../components/ui/switch";
import { useEffect, useState } from "react";
import { cn, pickDirty } from "../../../../../../../../lib/utils";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../../../components/ui/button-submit";
import { EOgImageMode } from "../../../../../../../../types/shared";
import { ErrorAlert } from "../../../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../../../lib/fetcher";
import { seoFormSchema } from "../../../../../../../../lib/schemas/resources/seo-form-schema";
import { IResource } from "../../../../../../../../types/Resource";
import { UploadImage } from "../../../../../../../../components/ui/upload-image";
import { Input } from "../../../../../../../../components/ui/input";

export function SeoForm() {
  const { id: resourceId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IResource>(
    resourceId ? `/admin/resources/${resourceId}` : null
  );

  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(seoFormSchema),
    values: data
      ? {
          image:
            data.ogImageMode === EOgImageMode.CUSTOM
              ? data.ogImage?.url || ""
              : "",
          seoMetaTitle: data.seoMetaTitle || "",
          seoMetaDescription: data.seoMetaDescription || "",
          canonicalUrl: data.canonicalUrl || "",
          ogImageMode: data.ogImageMode || "",
          allowIndexing: data.allowIndexing || true,
        }
      : {
          image: "",
          seoMetaTitle: "",
          seoMetaDescription: "",
          canonicalUrl: "",
          ogImageMode: "",
          allowIndexing: true,
        },
    mode: "onBlur",
  });

  useEffect(() => {
    if (imageFile && imageFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(imageFile);

      form.setValue("image", objectUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const submitForm = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    const imageMode = form.getValues("ogImageMode");

    if (
      imageMode === EOgImageMode.CUSTOM &&
      data?.ogImageMode === EOgImageMode.USE_HERO
    ) {
      if (!imageFile) {
        form.setError("image", {
          message: "Image is required.",
        });
        setFormError("Please fix the errors below.");
        return;
      }
    }

    setStatus("loading");
    try {
      const values = form.getValues();
      const dirty = pickDirty(values, form.formState.dirtyFields);

      const formData = new FormData();

      formData.append("payload", JSON.stringify(dirty));
      if (!!imageFile) {
        formData.append("imageFile", imageFile as File);
      }

      await fetcherAdmin(`/admin/resources/${resourceId}/seo`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      mutate().then(() => {
        setStatus("success");
        setImageFile(null);
        form.reset();
      });
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
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={loading || !data}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              SEO & Social
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadError ? <ErrorAlert message={loadError} /> : null}
            {formError ? <ErrorAlert message={formError} /> : null}

            {/* Meta Title */}
            <div>
              <Input
                label="Meta Title"
                placeholder="SEO title (auto-filled from resource title)"
                {...form.register("seoMetaTitle")}
                error={!!form.formState.errors.seoMetaTitle}
                errorMessage={form.formState.errors.seoMetaTitle?.message}
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.watch("seoMetaTitle")?.length || 0}/140 characters
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <Textarea
                label="Meta Description"
                placeholder="SEO description (auto-filled from teaser)"
                {...form.register("seoMetaDescription")}
                rows={2}
                className={cn(
                  form.formState.errors.seoMetaDescription
                    ? "border-destructive"
                    : ""
                )}
                error={!!form.formState.errors.seoMetaDescription}
                errorMessage={form.formState.errors.seoMetaDescription?.message}
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.watch("seoMetaDescription")?.length || 0}/200 characters
              </p>
            </div>

            {/* Open Graph Image */}
            <div>
              <Label>Open Graph Image</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Controller
                    control={form.control}
                    name="ogImageMode"
                    render={({ field }) => (
                      <>
                        <input
                          type="radio"
                          id="ogDefault"
                          name="ogImage"
                          checked={field.value === EOgImageMode.USE_HERO}
                          onChange={() => field.onChange(EOgImageMode.USE_HERO)}
                        />
                        <Label htmlFor="ogDefault" className="text-sm mb-0">
                          Use hero image
                        </Label>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={form.control}
                    name="ogImageMode"
                    render={({ field }) => (
                      <>
                        <input
                          type="radio"
                          id="ogCustom"
                          name="ogImage"
                          checked={field.value === EOgImageMode.CUSTOM}
                          onChange={() => field.onChange(EOgImageMode.CUSTOM)}
                        />
                        <Label htmlFor="ogCustom" className="text-sm mb-0">
                          Upload custom image
                        </Label>
                      </>
                    )}
                  />
                </div>
                {form.watch("ogImageMode") === EOgImageMode.CUSTOM && (
                  <div className="ml-6 space-y-3">
                    <UploadImage
                      value={form.watch("image")}
                      setFile={(value) => {
                        setImageFile(value);
                      }}
                      deleteFile={() => {
                        setImageFile(null);
                        form.setValue("image", "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      error={
                        form.formState.errors.image
                          ? form.formState.errors.image.message
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Canonical URL */}
            <Input
              label="Canonical URL (optional)"
              placeholder="https://example.com/canonical-url"
              {...form.register("canonicalUrl")}
              error={!!form.formState.errors.canonicalUrl}
              errorMessage={form.formState.errors.canonicalUrl?.message}
            />

            {/* Allow search engine indexing */}
            <div className="flex items-center space-x-2">
              <Controller
                control={form.control}
                name="allowIndexing"
                render={({ field }) => (
                  <>
                    <Switch
                      id="allowIndexing"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                    <Label
                      htmlFor="allowIndexing"
                      className="text-sm text-gray-600 mb-0"
                    >
                      Allow search engine indexing
                    </Label>
                  </>
                )}
              />
            </div>

            <ButtonSubmit
              type="button"
              onClick={() => submitForm()}
              status={status}
              statusText={{
                loading: "Saving...",
                success: "Saved",
                error: "Try again",
                disabled: "Disabled",
              }}
              className="font-semibold"
              disabled={loading || !data}
            >
              <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              Save
            </ButtonSubmit>
          </CardContent>
        </Card>
      </fieldset>
    </form>
  );
}
