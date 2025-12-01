"use client";

import { CheckCircle, Globe, ImageIcon, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../../components/ui/card";
import { Label } from "../../../../../../../../components/ui/label";
import { Textarea } from "../../../../../../../../components/ui/textarea";
import { Button } from "../../../../../../../../components/ui/button";
import { Switch } from "../../../../../../../../components/ui/switch";
import { useEffect, useState } from "react";
import { cn, pickDirty } from "../../../../../../../../lib/utils";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { IDeal } from "../../../../../../../../types/Deal";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { seoFormSchema } from "../../../../../../../../lib/schemas/deal/seo-form-schema";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../../../components/ui/button-submit";
import { EOgImageMode } from "../../../../../../../../types/shared";
import { ErrorAlert } from "../../../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../../../lib/fetcher";

export function SeoForm() {
  const { id: dealId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IDeal>(
    dealId ? `/admin/deals/${dealId}` : null
  );

  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const form = useForm({
    resolver: zodResolver(seoFormSchema),
    values: data
      ? {
          image: data.ogImageMode === EOgImageMode.CUSTOM ? data.ogImage?.url || "" : "",
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

    if (imageMode === EOgImageMode.CUSTOM && data?.ogImageMode === EOgImageMode.USE_HERO) {
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

      await fetcherAdmin(`/admin/deals/${dealId}/seo`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      mutate().then(() => {
        setStatus("success");
        setImageFile(null)
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Title
                </label>
                <input
                  placeholder="SEO title (auto-filled from deal title)"
                  {...form.register("seoMetaTitle")}
                  className={cn(
                    "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                    form.formState.errors.seoMetaTitle
                      ? "border-destructive focus:border-destructive"
                      : "border-input"
                  )}
                />
                {form.formState.errors.seoMetaTitle ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.seoMetaTitle.message}
                  </p>
                ) : null}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {form.watch("seoMetaTitle")?.length || 0}/140 characters
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Description
                </label>
                <Textarea
                  placeholder="SEO description (auto-filled from teaser)"
                  {...form.register("seoMetaDescription")}
                  rows={2}
                  className={cn(
                    form.formState.errors.seoMetaDescription
                      ? "border-destructive"
                      : ""
                  )}
                />
                {form.formState.errors.seoMetaDescription ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.seoMetaDescription.message}
                  </p>
                ) : null}
              </div>
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
                        <Label htmlFor="ogDefault" className="text-sm">
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
                        <Label htmlFor="ogCustom" className="text-sm">
                          Upload custom image
                        </Label>
                      </>
                    )}
                  />
                </div>
                {form.watch("ogImageMode") === EOgImageMode.CUSTOM && (
                  <div className="ml-6 space-y-3">
                    <div
                      className={` rounded-lg text-center transition-colors ${
                        isDragging
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300"
                      } ${
                        form.watch("image") ? "" : "border-2 p-8 border-dashed "
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);

                        const files = e.dataTransfer.files;
                        if (files && files[0]) {
                          setImageFile(files[0]);
                        }
                      }}
                    >
                      {form.watch("image") ? (
                        <div
                          className="relative w-full h-[231px] bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
                          style={{
                            backgroundImage: `url(${form.watch("image")})`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <div className="text-center space-y-3">
                              <p className="text-white font-medium">
                                Hero Image Preview
                              </p>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setImageFile(null);
                                  form.setValue("image", "", {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }}
                                className="bg-white text-gray-900 hover:bg-gray-100"
                              >
                                Remove Image
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-sm text-gray-600 mb-2">
                            {isDragging
                              ? "Drop image here"
                              : "Upload hero image"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Recommended: 1200x630px, PNG/JPG up to 5MB
                          </p>
                          <label htmlFor="heroImageUpload">
                            <Button
                              variant="outline"
                              className="mt-4 bg-transparent cursor-pointer"
                              asChild
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                              </span>
                            </Button>
                          </label>
                          <input
                            id="heroImageUpload"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setImageFile(file);
                            }}
                          />
                        </>
                      )}
                    </div>
                    {form.formState.errors.image ? (
                      <p className="mt-1 text-sm text-destructive">
                        {form.formState.errors.image.message}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Canonical URL (optional)
              </label>
              <input
                placeholder="https://example.com/canonical-url"
                {...form.register("canonicalUrl")}
                className={cn(
                  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                  form.formState.errors.canonicalUrl
                    ? "border-destructive focus:border-destructive"
                    : "border-input"
                )}
              />
              {form.formState.errors.canonicalUrl ? (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.canonicalUrl.message}
                </p>
              ) : null}
            </div>

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
                    <label htmlFor="allowIndexing" className="text-sm text-gray-600">
                      Allow search engine indexing
                    </label>
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
