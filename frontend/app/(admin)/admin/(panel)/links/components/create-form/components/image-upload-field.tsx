"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useFormState } from "react-hook-form";

type AnyWithImage = FieldValues & { image?: string };

interface ImageUploadFieldProps {
  form: UseFormReturn<AnyWithImage>;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  imageFile: File | null;
}

export function ImageUploadField({
  form,
  disabled,
  onFileChange,
  imageFile,
}: ImageUploadFieldProps) {
  const { errors } = useFormState({ control: form.control, name: "image" });
  const imageError = errors.image;
  const hasError = !!imageError;

  const imageReg = form.register("image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      e.target.value = "";
      return;
    }

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      form.setError("image", {
        type: "manual",
        message: "Only PNG, JPG, or WEBP files are allowed.",
      });
      e.target.value = "";
      return;
    }

    form.setValue("image", "", { shouldValidate: true, shouldDirty: true });
    form.clearErrors("image");
    onFileChange(file);

    e.target.value = "";
  };

  const clearImageFile = () => {
    onFileChange(null);
  };

  const handleUrlBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    imageReg.onBlur(e);

    await form.trigger("image");

    const url = form.getValues("image");

    if (url && imageFile) {
      form.setError("image", {
        type: "manual",
        message: "Use either image URL or file, not both.",
      });
      return;
    }

    if (!url && !imageFile) {
      form.setError("image", {
        type: "manual",
        message: "Provide either an image URL or upload a file.",
      });
      return;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Image
      </label>

      <div className="space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <input
              placeholder="Image URL (https://...)"
              name={imageReg.name}
              ref={imageReg.ref}
              onChange={imageReg.onChange}
              onBlur={handleUrlBlur} // ← комбінований, очікує resolver, тоді ставить manual error
              disabled={!!imageFile || disabled}
              className={cn(
                "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
                hasError ? "border-destructive focus:border-destructive" : "border-input"
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="fileImage">
              <input
                id="fileImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                disabled={disabled}
                className="hidden"
              />
              {!imageFile ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className={cn("cursor-pointer bg-transparent", disabled && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-inherit hover:border-inherit active:bg-transparent")}
                >
                  <div>Select file</div>
                </Button>
              ) : null}
            </label>

            {imageFile ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearImageFile}
                disabled={disabled}
                className="cursor-pointer bg-transparent"
              >
                Remove file
              </Button>
            ) : null}
          </div>
        </div>

        {imageFile ? (
          <p className="text-sm text-muted-foreground">
            Selected file: <span className="font-medium">{imageFile.name}</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Allowed: PNG, JPG, WEBP. Provide URL or upload a file.
          </p>
        )}

        {hasError ? (
          <p className="text-sm text-destructive">{imageError?.message}</p>
        ) : null}
      </div>
    </div>
  );
}

