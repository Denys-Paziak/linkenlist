"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutate } from "swr";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { FilePen, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/fetcher";
import { TagsField } from "./components/tags-field";
import {
  CreateLinkFormData,
  createFormSchema,
  branchesOptions,
  categories,
} from "../../../../../../../lib/schemas/link-form-schema";
import { ImageUploadField } from "./components/image-upload-field";

export function CreateForm() {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [statusMode, setStatusMode] = useState<"publish" | "draft">("publish");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      image: "",
      title: "",
      description: "",
      url: "",
      category: "",
      tags: [],
      branches: [],
    },
    mode: "onBlur",
  });

  const resetForm = () => {
    form.reset();
    setImageFile(null);
    setFormError(null);
  };

  const submitForm = async (mode: "publish" | "draft") => {
    setFormError(null);
    setStatusMode(mode);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors above.");
    }

    const imageUrl = form.getValues("image");
    if (!imageUrl && !imageFile) {
      form.setError("image", {
        message: "Provide either an image URL or upload a file.",
      });
      setFormError("Please fix the errors above.");
      return;
    }

    if (imageUrl && imageFile) {
      form.setError("image", {
        message: "Use either image URL or file, not both.",
      });
      setFormError("Please fix the errors above.");
      return;
    }

    if (!isValid) {
      return;
    }

    setStatus("loading");
    try {
      const formData = new FormData();
      const values = form.getValues();

      formData.append(
        "payload",
        JSON.stringify({
          ...values,
          image: undefined,
          imgUrl: values.image || undefined,
          status: mode === "publish" ? "published" : "draft",
          verified: mode === "publish" ? true : false,
        })
      );

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await fetcher("/admin/links", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      setStatus("success");
      resetForm();
      mutate(
        (key) => typeof key === "string" && key.startsWith("/admin/links")
      );
    } catch (error: any) {
      setStatus("error");
      setFormError(error.message);
    } finally {
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }
  };

  const publishBtnStatus: ButtonSubitStatus =
    statusMode === "publish" ? status : "idle";
  const draftBtnStatus: ButtonSubitStatus =
    statusMode === "draft" ? status : "idle";

  const isLoading = status === "loading";

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Create New Link Card</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          {formError ? <ErrorAlert message={formError} /> : null}

          {/* Image Upload */}
          <ImageUploadField
            form={form as any}
            disabled={isLoading}
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
                disabled={isLoading}
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
              <Select
                value={form.watch("category")}
                onValueChange={(value) =>
                  form.setValue("category", value, { shouldValidate: true })
                }
                disabled={isLoading}
              >
                <SelectTrigger
                  className={cn(
                    form.formState.errors.category
                      ? "border-destructive focus:border-destructive"
                      : ""
                  )}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Branches
              </label>
              <MultiSelect
                options={[...branchesOptions]}
                value={form.watch("branches")}
                onChange={(value) =>
                  form.setValue("branches", value, { shouldValidate: true })
                }
                placeholder="Select branches"
                className={cn(
                  form.formState.errors.branches
                    ? "border-destructive focus:border-destructive"
                    : ""
                )}
                disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
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
            <TagsField form={form as any} />
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
              disabled={isLoading}
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
              disabled={isLoading}
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
