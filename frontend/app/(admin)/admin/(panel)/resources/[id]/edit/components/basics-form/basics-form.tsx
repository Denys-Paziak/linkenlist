"use client";

import { CheckCircle, FileText } from "lucide-react";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { cn, pickDirty } from "../../../../../../../../../lib/utils";
import { MultiSelect } from "../../../../../../../../../components/ui/multi-select";
import useSWR from "swr";
import { fetcherAdmin } from "../../../../../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../../../../../components/ui/error-alert";
import { DealsBrowser } from "./components/deals-browser";
import { useParams } from "next/navigation";
import {
  basicFormSchema,
  BasicFormSchemaType,
  resourceCategories,
  resourceFormats,
} from "../../../../../../../../../lib/schemas/resources/basic-form-schema";
import { IResource } from "../../../../../../../../../types/Resource";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../../../components/ui/select";
import { IDealSimple } from "../../../../../../../../../types/Deal";
import { StatusChip } from "../../../../../../../../../components/ui/status-chip";
import { UploadImage } from "../../../../../../../../../components/ui/upload-image";
import { TagsField } from "../../../../../../components/tags-field";
import { Input } from "../../../../../../../../../components/ui/input";

export function BasicsForm() {
  const { id: resourceId } = useParams();

  const { data, error, isValidating, mutate } = useSWR<IResource>(
    resourceId ? `/admin/resources/${resourceId}` : null
  );

  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [featuredDeal, setFeaturedDeal] = useState<IDealSimple | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [showResourcesBrowser, setShowResourcesBrowser] = useState(false);

  const form = useForm<BasicFormSchemaType>({
    resolver: zodResolver(basicFormSchema),
    values: data
      ? {
          featuredDealId: data.featuredDeal?.id || null,
          image: data.image?.url || "",
          title: data?.title || "",
          slug: data?.slug || "",
          teaser: data?.teaser || "",
          categories: data?.categories || [],
          tags: data?.tags.map((item) => item.name) || [],
          format: data?.format || "",
        }
      : {
          featuredDealId: null,
          image: "",
          title: "",
          slug: "",
          teaser: "",
          categories: [],
          tags: [],
          format: "",
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
    if (data?.featuredDeal) {
      setFeaturedDeal({
        id: data.featuredDeal.id,
        slug: data.featuredDeal.slug,
        status: data.featuredDeal.status,
        title: data.featuredDeal.title,
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
      console.log(dirty);
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

      await fetcherAdmin(`/admin/resources/${resourceId}/basic-information`, {
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
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadError ? <ErrorAlert message={loadError} /> : null}
            {formError ? <ErrorAlert message={formError} /> : null}

            {/* Hero Image Upload */}
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
              label="Hero Image *"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <Input
                  label="Title *"
                  placeholder="Enter resource title"
                  {...form.register("title")}
                  error={!!form.formState.errors.title}
                  errorMessage={form.formState.errors.title?.message}
                />
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
                      linkenlist.com/resources/
                    </span>
                    <Input
                      placeholder="url-slug"
                      {...form.register("slug")}
                      error={!!form.formState.errors.slug}
                      errorMessage={form.formState.errors.slug?.message}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {form.watch("slug")?.length || 0}/140 characters
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <Textarea
                label="Teaser / Subtitle"
                placeholder="1-2 lines under title (used for resource card generation)"
                {...form.register("teaser")}
                rows={2}
                className={cn(
                  form.formState.errors.teaser ? "border-destructive" : ""
                )}
                error={!!form.formState.errors.teaser}
                errorMessage={form.formState.errors.teaser?.message}
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.watch("teaser")?.length || 0}/200 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <Label>Categories *</Label>
                <MultiSelect
                  options={[...resourceCategories]}
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
              {/* Resource Type */}
              <div>
                <Label>Resource Type *</Label>
                <Select
                  value={form.watch("format")}
                  onValueChange={(value) =>
                    form.setValue("format", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger
                    className={cn(
                      form.formState.errors.format
                        ? "border-destructive bg-background focus:border-destructive"
                        : "bg-background border border-input"
                    )}
                  >
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceFormats.map((formats) => (
                      <SelectItem key={formats} value={formats}>
                        {formats}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.format ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.format.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TagsField form={form as any} url="/admin/resources/tags" />
            </div>

            {/* Featured Deal */}
            <div className="space-y-2">
              <p className="block text-sm font-medium text-foreground">
                Featured Deal
              </p>
              {featuredDeal ? (
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {featuredDeal?.title || "[Not specified]"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {"https://linkenlist.com/deals/" +
                          (featuredDeal?.slug || "[Not specified]")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusChip
                      text={featuredDeal.status}
                      status={featuredDeal.status}
                    />

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        form.setValue("featuredDealId", null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setFeaturedDeal(null);
                      }}
                    >
                      Remove selection
                    </Button>
                  </div>
                </div>
              ) : null}

              {showResourcesBrowser ? (
                <DealsBrowser
                  closeBrowser={() => {
                    setShowResourcesBrowser(false);
                  }}
                  selected={form.watch("featuredDealId") || null}
                  setSelected={(newValue: IDealSimple) => {
                    form.setValue("featuredDealId", newValue.id, {
                      shouldDirty: true,
                    });
                    setFeaturedDeal(newValue);
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
