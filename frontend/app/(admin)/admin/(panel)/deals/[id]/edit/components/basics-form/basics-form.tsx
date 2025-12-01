"use client";

import { CheckCircle, FileText, ImageIcon, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "../../../../../../../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../../../../../../components/ui/card";
import { Textarea } from "../../../../../../../../../components/ui/textarea";
import { useEffect, useState } from "react";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../../../../components/ui/button-submit";
import { useForm } from "react-hook-form";
import {
  basicFormSchema,
  BasicFormSchemaType,
  dealCategories,
} from "../../../../../../../../../lib/schemas/deal/basic-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, pickDirty } from "../../../../../../../../../lib/utils";
import { MultiSelect } from "../../../../../../../../../components/ui/multi-select";
import { TagsField } from "../../../../../../../../../components/admin/tags-field";
import useSWR from "swr";
import { IDeal } from "../../../../../../../../../types/Deal";
import { fetcherAdmin } from "../../../../../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../../../../../components/ui/error-alert";
import { ResourcesBrowser } from "./components/resources-browser";
import { useParams } from "next/navigation";
import { StatusChip } from "../../../../../../../../../components/ui/status-chip";
import { IResourceSimple } from "../../../../../../../../../types/Resource";

export function BasicsForm() {
  const { id: dealId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IDeal>(
    dealId ? `/admin/deals/${dealId}` : null
  );

  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [featuredResource, setFeaturedResource] =
    useState<IResourceSimple | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [showResourcesBrowser, setShowResourcesBrowser] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<BasicFormSchemaType>({
    resolver: zodResolver(basicFormSchema),
    values: data
      ? {
          featuredResource: data.featuredResource?.id || null,
          image: data.image?.url || "",
          title: data?.title || "",
          slug: data?.slug || "",
          teaser: data?.teaser || "",
          categories: data?.categories || [],
          tags: data?.tags.map((item) => item.name) || [],
          outboundUrl: data?.outboundUrl || "",
          outboundUrlButtonLabel: data?.outboundUrlButtonLabel || "",
        }
      : {
          featuredResource: null,
          image: "",
          title: "",
          slug: "",
          teaser: "",
          categories: [],
          tags: [],
          outboundUrl: "",
          outboundUrlButtonLabel: "",
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

  useEffect(() => {
    if (data?.featuredResource) {
      setFeaturedResource({
        id: data.featuredResource.id,
        slug: data.featuredResource.slug,
        status: data.featuredResource.status,
        title: data.featuredResource.title,
      });
    }
  }, [data]);

  const submitForm = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    const imageUrl = form.getValues("image")?.trim();

    if (!imageUrl && !imageFile) {
      form.setError("image", {
        message: "Image is required.",
      });
      setFormError("Please fix the errors below.");
      return;
    }

    setStatus("loading");
    try {
      const values = form.getValues();
      const dirty = pickDirty(values, form.formState.dirtyFields);

      const formData = new FormData();

      formData.append(
        "payload",
        JSON.stringify({
          ...dirty,
          slug: dirty.slug === "" ? null : dirty.slug,
        })
      );
      if (!!imageFile) {
        formData.append("imageFile", imageFile as File);
      }

      await fetcherAdmin(`/admin/deals/${dealId}/basic-information`, {
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
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadError ? <ErrorAlert message={loadError} /> : null}
            {formError ? <ErrorAlert message={formError} /> : null}

            {/* Hero Image Upload */}
            <div>
              <Label>Hero Image *</Label>
              <div className="space-y-4">
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
                      style={{ backgroundImage: `url(${form.watch("image")})` }}
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
                        {isDragging ? "Drop image here" : "Upload hero image"}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <input
                    placeholder="Enter deal title"
                    {...form.register("title")}
                    className={cn(
                      "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                      form.formState.errors.title
                        ? "border-destructive focus:border-destructive"
                        : "border-input"
                    )}
                  />
                  {form.formState.errors.title ? (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {form.watch("title")?.length || 0}/140 characters
                </p>
              </div>
              {/* Slug */}
              <div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      linkenlist.com/deals/
                    </span>
                    <input
                      placeholder="url-slug"
                      {...form.register("slug")}
                      className={cn(
                        "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                        form.formState.errors.slug
                          ? "border-destructive focus:border-destructive"
                          : "border-input"
                      )}
                    />
                    {form.formState.errors.slug ? (
                      <p className="mt-1 text-sm text-destructive">
                        {form.formState.errors.slug.message}
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {form.watch("slug")?.length || 0}/140 characters
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Teaser / Subtitle
                </label>
                <Textarea
                  placeholder="1-2 lines under title (used for deal card generation)"
                  {...form.register("teaser")}
                  rows={2}
                  className={cn(
                    form.formState.errors.teaser ? "border-destructive" : ""
                  )}
                />
                {form.formState.errors.teaser ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.teaser.message}
                  </p>
                ) : null}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {form.watch("teaser")?.length || 0}/200 characters
              </p>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Categories *
                </label>
                <MultiSelect
                  options={[...dealCategories]}
                  value={form.watch("categories")}
                  onChange={(value) =>
                    form.setValue("categories", value as any, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  placeholder="Select categories"
                  className={cn(
                    form.formState.errors.categories
                      ? "border-destructive focus:border-destructive"
                      : ""
                  )}
                />
                {form.formState.errors.categories ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.categories.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TagsField form={form as any} url="/admin/deals/tags" />
            </div>

            {/* Primary CTA */}
            <div>
              <Label>Primary Call-to-Action</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Button Label
                  </label>
                  <input
                    placeholder="Go to Deal"
                    {...form.register("outboundUrlButtonLabel")}
                    className={cn(
                      "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                      form.formState.errors.outboundUrlButtonLabel
                        ? "border-destructive focus:border-destructive"
                        : "border-input"
                    )}
                  />
                  {form.formState.errors.outboundUrlButtonLabel ? (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.outboundUrlButtonLabel.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Outbound URL *
                  </label>
                  <input
                    placeholder="https://example.com/deal"
                    {...form.register("outboundUrl")}
                    className={cn(
                      "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                      form.formState.errors.outboundUrl
                        ? "border-destructive focus:border-destructive"
                        : "border-input"
                    )}
                  />
                  {form.formState.errors.outboundUrl ? (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.outboundUrl.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Featured Resource */}
            <div className="space-y-2">
              <p className="block text-sm font-medium text-foreground">
                Featured Resource
              </p>
              {featuredResource ? (
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {featuredResource?.title || "[Not specified]"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {"https://linkenlist.com/deals/" +
                          (featuredResource?.slug || "[Not specified]")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusChip
                      text={featuredResource.status}
                      status={featuredResource.status}
                    />

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        form.setValue("featuredResource", null);
                        setFeaturedResource(null);
                      }}
                    >
                      Remove selection
                    </Button>
                  </div>
                </div>
              ) : null}

              {showResourcesBrowser ? (
                <ResourcesBrowser
                  closeBrowser={() => {
                    setShowResourcesBrowser(false);
                  }}
                  selected={form.watch("featuredResource") || null}
                  setSelected={(newValue: IResourceSimple) => {
                    form.setValue("featuredResource", newValue.id);
                    setFeaturedResource(newValue);
                  }}
                />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResourcesBrowser(true)}
                >
                  Browse
                </Button>
              )}
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
