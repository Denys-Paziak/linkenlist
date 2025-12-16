"use client";

import { Building, Camera, Trash2 } from "lucide-react";
import { IUser } from "../../../../../types/User";
import { Button } from "../../../../../components/ui/button";
import { useEffect, useState } from "react";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../components/ui/button-submit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicProfileSchema } from "../../../../../lib/schemas/public-profile-schema";
import { pickDirty } from "../../../../../lib/utils";
import { fetcherUser } from "../../../../../lib/fetcher";
import { ErrorAlert } from "../../../../../components/ui/error-alert";
import { mutate } from "swr";
import { Input } from "../../../../../components/ui/input";

export function PublicProfile({ user }: { user?: IUser }) {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(publicProfileSchema),
    values: user
      ? {
          avatar: user.avatar?.url || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          professionalTitle: user.professionalTitle || "",
          company: user.company || "",
          phone: user.phone || "",
          publicEmail: user.publicEmail || "",
        }
      : {
          avatar: "",
          firstName: "",
          lastName: "",
          professionalTitle: "",
          company: "",
          phone: "",
          publicEmail: "",
        },
    mode: "onBlur",
  });

  useEffect(() => {
    if (imageFile && imageFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(imageFile);

      form.setValue("avatar", objectUrl, {
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

    setStatus("loading");
    try {
      const values = form.getValues();
      const dirty = pickDirty(values, form.formState.dirtyFields);

      const formData = new FormData();

      formData.append(
        "payload",
        JSON.stringify({
          ...dirty,
          avatar: dirty.avatar === "" ? null : undefined,
        })
      );

      if (!!imageFile) {
        formData.append("imageFile", imageFile as File);
      }

      await fetcherUser(`/users/self/public-profile`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      mutate("/users/self").then(() => {
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

  const loading = !user || status === "loading";

  return (
    <div className="bg-white rounded-xl border border-primary/30 p-6">
      <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
        <Building className="h-5 w-5 text-primary" />
        Public Profile
      </h2>
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <fieldset disabled={loading} className="space-y-6">
          {formError ? <ErrorAlert message={formError} /> : null}

          {/* Profile Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              {form.watch("avatar") ? (
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat rounded-full"
                  style={{ backgroundImage: `url(${form.watch("avatar")})` }}
                  aria-label="Profile Avatar"
                ></div>
              ) : (
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {`${form.watch("firstName")?.[0] || ""}${
                    form.watch("lastName")?.[0] || ""
                  }`}
                </div>
              )}
              {form.watch("avatar") && (
                <button
                  onClick={() => {
                    setImageFile(null);
                    form.setValue("avatar", "", {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  className="absolute -bottom-1 -left-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors shadow-md"
                  title="Delete avatar"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1 items-start">
              <label htmlFor="avatar" className="w-fit">
                <Button
                  variant="outline"
                  className="flex w-fit items-center cursor-pointer gap-2 bg-transparent"
                  asChild
                >
                  <span>
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </span>
                </Button>
              </label>
              <p className="text-xs">
                Recommended: 100x100px, PNG/JPG up to 2MB
              </p>
            </div>
            <input
              id="avatar"
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
            />
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter your first name"
              {...form.register("firstName")}
              error={!!form.formState.errors.firstName}
              errorMessage={form.formState.errors.firstName?.message}
            />

            <Input
              label="Last Name"
              placeholder="Enter your last name"
              {...form.register("lastName")}
              error={!!form.formState.errors.lastName}
              errorMessage={form.formState.errors.lastName?.message}
            />

            <Input
              label="Professional Title"
              placeholder="e.g., Real Estate Agent"
              {...form.register("professionalTitle")}
              error={!!form.formState.errors.professionalTitle}
              errorMessage={form.formState.errors.professionalTitle?.message}
            />

            <Input
              label="Company Name"
              placeholder="Enter your company name"
              {...form.register("company")}
              error={!!form.formState.errors.company}
              errorMessage={form.formState.errors.company?.message}
            />

            <Input
              label="Phone Number"
              placeholder="(555) 123-456"
              {...form.register("phone")}
              error={!!form.formState.errors.phone}
              errorMessage={form.formState.errors.phone?.message}
            />

            <Input
              label="Public Email"
              placeholder="your.email@example.com"
              {...form.register("publicEmail")}
              error={!!form.formState.errors.publicEmail}
              errorMessage={form.formState.errors.publicEmail?.message}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-primary/20">
            <div className="text-left">
              <span className="text-sm text-[#222222]/70 font-medium">
                Member since:{" "}
              </span>
              <span className="text-sm text-[#222222] font-bold">
                {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
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
              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold"
            >
              Save Public Profile
            </ButtonSubmit>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

const formatDate = (dateString?: Date | string) => {
  if (dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};
