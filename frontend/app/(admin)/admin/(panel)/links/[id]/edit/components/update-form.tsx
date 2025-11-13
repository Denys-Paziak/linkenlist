"use client";

import { useEffect, useRef, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useForm, FieldValues, Controller } from "react-hook-form";
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
  type ButtonSubitStatus,
  ButtonSubmit,
} from "@/components/ui/button-submit";
import { ErrorAlert } from "@/components/ui/error-alert";
import { FilePen, CheckCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetcherAdmin } from "@/lib/fetcher";
import {
  UpdateLinkFormData,
  updateFormSchema,
  branchesOptions,
  categories,
} from "../../../../../../../../lib/schemas/link-form-schema";
import { ImageUploadField } from "../../../components/create-form/components/image-upload-field";
import { TagsField } from "../../../components/create-form/components/tags-field";
import { ILink } from "../../../../../../../../types/Link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function pickDirty<T extends FieldValues>(
  values: T,
  dirty: Record<string, any>
): Partial<T> {
  const out: Record<string, any> = {};
  Object.keys(dirty).forEach((key) => {
    if (dirty[key] === true) {
      out[key] = values[key];
    } else if (typeof dirty[key] === "object" && dirty[key] != null) {
      const nested = pickDirty(values[key] ?? {}, dirty[key]);
      if (Object.keys(nested).length) out[key] = nested;
    }
  });
  return out as Partial<T>;
}

export function EditForm({ linkId }: { linkId: string }) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [statusMode, setStatusMode] = useState<"publish" | "draft">("publish");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR<ILink>(
    linkId ? `/admin/links/${linkId}` : null
  );

  const originalRef = useRef<ILink | null>(null);

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
    if (data) {
      originalRef.current = data;

      setImageFile(null);
      setFormError(null);
      setStatus("idle");
    }
  }, [data, form]);

  const loading = isLoading || status === "loading";
  const loadError = error ? (error as any)?.message ?? "Failed to load" : null;

  const submitForm = async (mode: "publish" | "draft") => {
    setFormError(null);
    setStatusMode(mode);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors above.");
      return;
    }

    const imageUrl = form.getValues("image")?.trim();

    if (!imageUrl && !imageFile) {
      form.setError("image", {
        message: "Use either image URL or file, not both.",
      });
      setFormError("Please fix the errors above.");
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
          imgUrl: dirty.image || undefined,
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

      setStatus("success");
      globalMutate(`/admin/links/tags`);
      globalMutate(`/admin/links/${linkId}`);
      
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Update failed");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const publishBtnStatus: ButtonSubitStatus =
    statusMode === "publish" ? status : "idle";
  const draftBtnStatus: ButtonSubitStatus =
    statusMode === "draft" ? status : "idle";

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate>
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
          <ImageUploadField
            form={form as any}
            disabled={loading || !!loadError || !data}
            onFileChange={setImageFile}
            imageFile={imageFile}
          />

          {/* Title / Category / Branches */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <input
                placeholder="Enter card title"
                {...form.register("title")}
                disabled={loading || !data}
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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <Controller
                name="category"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={loading || !data}
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
                )}
              />
              {form.formState.errors.category ? (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.category.message}
                </p>
              ) : null}
            </div>

            {/* Branches */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Branches
              </label>
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Short Description
            </label>
            <Textarea
              placeholder="Enter a brief description"
              {...form.register("description")}
              disabled={loading || !data}
              rows={3}
              className={cn(
                form.formState.errors.description ? "border-destructive" : ""
              )}
            />
            {form.formState.errors.description ? (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          {/* URL / Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL
              </label>
              <input
                placeholder="https://example.com"
                {...form.register("url")}
                disabled={loading || !data}
                className={cn(
                  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                  form.formState.errors.url
                    ? "border-destructive focus:border-destructive"
                    : "border-input"
                )}
              />
              {form.formState.errors.url ? (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.url.message}
                </p>
              ) : null}
            </div>

            {/* Tags */}
            <TagsField form={form as any} disabled={loading || !data} />
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
    </form>
  );
}
