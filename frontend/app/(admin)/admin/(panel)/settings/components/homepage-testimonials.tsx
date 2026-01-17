"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { Input } from "../../../../../../components/ui/input";
import { Textarea } from "../../../../../../components/ui/textarea";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../lib/fetcher";
import { cn } from "../../../../../../lib/utils";
import {
  HomepageTestimonialsForm,
  homepageTestimonialsSchema,
} from "../../../../../../lib/schemas/homepage-testimonials-schema";

const emptySix: HomepageTestimonialsForm = {
  testimonials: Array.from({ length: 6 }, () => ({
    name: "",
    date: "",
    location: "",
    comment: "",
  })),
};

export function HomepageTestimonials() {
  const { data, isValidating, mutate } = useSWR<HomepageTestimonialsForm["testimonials"]>(
    "/setting/homepage-testimonials"
  );

  const [statusSave, setStatusSave] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<HomepageTestimonialsForm>({
    resolver: zodResolver(homepageTestimonialsSchema),
    values: data ? {testimonials: data} : emptySix,
    mode: "onBlur",
  });

  const save = async () => {
    setFormError(null);

    const isValid = await form.trigger();

    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    setStatusSave("loading");
    try {
      const values = form.getValues();

      await fetcherAdmin(`/admin/setting/homepage-testimonials`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      await mutate();
      setStatusSave("success");
      form.reset();
    } catch (err: any) {
      setStatusSave("error");
      setFormError(err?.message ?? "Update failed");
    }
  };

  useEffect(() => {
    if (statusSave === "success" || statusSave === "error") {
      const timer = setTimeout(() => setStatusSave("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusSave]);

  const loading = isValidating || statusSave === "loading";

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={loading || !data}>
        <Card>
          <CardHeader>
            <CardTitle>Homepage Testimonials</CardTitle>
            <CardDescription>
              Edit the 6 testimonial cards displayed on the main page
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {formError ? <ErrorAlert message={formError} /> : null}

            {Array.from({ length: 6 }).map((_, i) => {
              const err = form.formState.errors.testimonials?.[i];

              return (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Testimonial {i + 1}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Name"
                        placeholder="Enter name"
                        {...form.register(`testimonials.${i}.name`)}
                        error={!!err?.name}
                        errorMessage={err?.name?.message}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {form.watch(`testimonials.${i}.name`)?.length ?? 0}/100
                        characters
                      </p>
                    </div>

                    <div>
                      <Input
                        label="Date"
                        placeholder="Aug 2025"
                        {...form.register(`testimonials.${i}.date`)}
                        error={!!err?.date}
                        errorMessage={err?.date?.message}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {form.watch(`testimonials.${i}.date`)?.length ?? 0}/50
                        characters
                      </p>
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Location"
                      placeholder="Quantico, VA"
                      {...form.register(`testimonials.${i}.location`)}
                      error={!!err?.location}
                      errorMessage={err?.location?.message}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {form.watch(`testimonials.${i}.location`)?.length ?? 0}
                      /100 characters
                    </p>
                  </div>

                  <div>
                    <Textarea
                      label="Comment"
                      {...form.register(`testimonials.${i}.comment`)}
                      rows={2}
                      className={cn(
                        err?.comment
                          ? "border-destructive"
                          : ""
                      )}
                      error={!!err?.comment}
                      errorMessage={err?.comment?.message}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {form.watch(`testimonials.${i}.comment`)?.length || 0}
                      /1000 characters
                    </p>
                  </div>
                </div>
              );
            })}

            <ButtonSubmit
              type="button"
              onClick={save}
              status={statusSave}
              statusText={{
                loading: "Saving...",
                success: "Saved",
                error: "Try again",
                disabled: "Disabled",
              }}
            >
              Save Changes
            </ButtonSubmit>
          </CardContent>
        </Card>
      </fieldset>
    </form>
  );
}
