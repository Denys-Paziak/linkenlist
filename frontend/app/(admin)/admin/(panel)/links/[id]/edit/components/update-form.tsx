"use client";

import { useEffect, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  type ButtonSubmitStatus,
  ButtonSubmit,
} from "@/components/ui/button-submit";
import { ErrorAlert } from "@/components/ui/error-alert";
import { FilePen, CheckCircle, Globe } from "lucide-react";
import { cn, pickDirty } from "@/lib/utils";
import { fetcherAdmin } from "@/lib/fetcher";
import {
  UpdateLinkFormData,
  updateFormSchema,
  branchesOptions,
  categories,
} from "../../../../../../../../lib/schemas/link-form-schema";
import { ILink } from "../../../../../../../../types/Link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UploadImage } from "../../../../../../../../components/ui/upload-image";
import { TagsField } from "../../../../../components/tags-field";
import { Input } from "../../../../../../../../components/ui/input";

export function EditForm({ linkId }: { linkId: string }) {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [statusMode, setStatusMode] = useState<"publish" | "draft">("publish");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, error, isValidating, mutate } = useSWR<ILink>(
    linkId ? `/admin/links/${linkId}` : null
  );

  const form = useForm<UpdateLinkFormData>({
    resolver: zodResolver(updateFormSchema),
    values: data
      ? {
          image: data.image?.url ?? "",
          title: data.title ?? "",
          description: data.description ?? "",
          url: data.url ?? "",
          category: data.category ?? "",
          tags: data.tags.map((item) => item.name) ?? [],
          branches: data.branches ?? [],
          verified: data.verified ?? false,
        }
      : {
          image: "",
          title: "",
          description: "",
          url: "",
          category: "",
          tags: [],
          branches: [],
          verified: false,
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

  const submitForm = async (mode: "publish" | "draft") => {
    setFormError(null);
    setStatusMode(mode);

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

      const hasImageFile = !!imageFile;

      const formData = new FormData();

      formData.append(
        "payload",
        JSON.stringify({
          ...dirty,
          status: mode === "publish" ? "published" : "draft",
        })
      );
      if (hasImageFile) {
        formData.append("imageFile", imageFile as File);
      }

      await fetcherAdmin(`/admin/links/${linkId}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      globalMutate(`/admin/links/tags`);
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

  const publishBtnStatus: ButtonSubmitStatus =
    statusMode === "publish" ? status : "idle";
  const draftBtnStatus: ButtonSubmitStatus =
    statusMode === "draft" ? status : "idle";

  const loading = isValidating || status === "loading";
  const loadError = error ? (error as any)?.message ?? "Failed to load" : null;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate>
      <fieldset disabled={loading || !data}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Link Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {loadError ? <ErrorAlert message={loadError} /> : null}
            {formError ? <ErrorAlert message={formError} /> : null}

            {/* Image Upload */}
            <div className="w-[400px] h-[300px]">
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
                label="Image *"
                recommendedLabel="Recommended: 400x300px, PNG/JPG/WEBP up to 5MB"
                acceptFiles="image/png,image/jpeg,image/webp"
              />
            </div>

            {/* Title / Category / Branches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Title */}
              <Input
                label="Title *"
                placeholder="Enter card title"
                {...form.register("title")}
                error={!!form.formState.errors.title}
                errorMessage={form.formState.errors.title?.message}
              />

              {/* Category */}
              <div>
                <Label>Category *</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) =>
                    form.setValue("category", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger
                    className={cn(
                      form.formState.errors.category && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                ) : null}
              </div>

              {/* Branches */}
              <div>
                <Label>Branches *</Label>
                <MultiSelect
                  options={[...branchesOptions]}
                  value={form.watch("branches")}
                  onChange={(value) =>
                    form.setValue("branches", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  placeholder="Select branches"
                  className={cn(
                    form.formState.errors.branches
                      ? "border-destructive focus:border-destructive"
                      : ""
                  )}
                  disabled={loading || !data}
                />
                {form.formState.errors.branches ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.branches.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Description */}
            <Textarea
              label="Short Description"
              placeholder="Enter a brief description"
              {...form.register("description")}
              rows={3}
              error={!!form.formState.errors.description}
              errorMessage={form.formState.errors.description?.message}
            />

            {/* URL / Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* URL */}
              <Input
                label="URL *"
                placeholder="https://example.com"
                {...form.register("url")}
                error={!!form.formState.errors.url}
                errorMessage={form.formState.errors.url?.message}
              />

              {/* Tags */}
              <TagsField
                form={form as any}
                disabled={loading || !data}
                url="/admin/links/tags"
                label="Tags *"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                control={form.control}
                name="verified"
                render={({ field }) => (
                  <>
                    <Switch
                      id="verified"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      disabled={loading || !data}
                    />
                    <Label htmlFor="verified">Verified Link</Label>
                  </>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-center">
              <ButtonSubmit
                type="button"
                onClick={() => submitForm("publish")}
                status={publishBtnStatus}
                statusText={{
                  loading: "Publishing...",
                  success: "Published",
                  error: "Try again",
                  disabled: "Disabled",
                }}
                className="font-semibold"
                disabled={loading || !data}
              >
                <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                Save and publish
              </ButtonSubmit>

              <ButtonSubmit
                type="button"
                variant="secondary"
                onClick={() => submitForm("draft")}
                status={draftBtnStatus}
                statusText={{
                  loading: "Saving...",
                  success: "Saved",
                  error: "Try again",
                  disabled: "Disabled",
                }}
                className="font-semibold"
                disabled={loading || !data}
              >
                <FilePen className="h-4 w-4 mr-2" aria-hidden="true" />
                Save as draft
              </ButtonSubmit>
            </div>
          </CardContent>
        </Card>
      </fieldset>
    </form>
  );
}
