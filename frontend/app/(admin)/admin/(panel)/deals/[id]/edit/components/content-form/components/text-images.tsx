"use client";

import { Paperclip, X, Copy } from "lucide-react";
import { Button } from "../../../../../../../../../../components/ui/button";
import {
  IDealImage,
  IDealSection,
} from "../../../../../../../../../../types/Deal";
import { useCallback, useEffect, useState } from "react";
import {
  ButtonSubmit,
  ButtonSubmitStatus,
} from "../../../../../../../../../../components/ui/button-submit";
import { fetcherAdmin } from "../../../../../../../../../../lib/fetcher";
import { useParams } from "next/navigation";
import { ErrorAlert } from "../../../../../../../../../../components/ui/error-alert";
import Image from "next/image";

export function TextImages({ section }: { section: IDealSection }) {
  const { id: dealId } = useParams();

  const [images, setImages] = useState<IDealImage[]>(section.images || []);

  const [statusSave, setStatusSave] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    setFormError(null);

    setStatusSave("loading");
    try {
      const formData = new FormData();

      formData.append("image", file);

      const image = await fetcherAdmin(
        `/admin/deals/${dealId}/content-section/${section.id}/text-image`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      setStatusSave("success");
      setImages((state) => [...state, image]);
    } catch (err: any) {
      setStatusSave("error");
      setFormError(err?.message ?? "Upload failed");
    }
  };

  const removeImage = useCallback(async (id: number) => {
    setImages((state) => state.filter((img) => img.id !== id));
  }, []);
  const setFormErrorCallback = useCallback((msg: string | null) => {
    setFormError(msg);
  }, []);

  useEffect(() => {
    if (statusSave === "success" || statusSave === "error") {
      const timer = setTimeout(() => setStatusSave("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusSave]);

  return (
    <fieldset disabled={statusSave === "loading" || !section}>
      <div className="space-y-3">
        {formError ? <ErrorAlert message={formError} /> : null}

        <div className="flex items-center gap-2">
          <input
            type="file"
            id={`image-upload-${section.id}`}
            className="hidden"
            accept="image/png,image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />
          <ButtonSubmit
            type="button"
            variant="outline"
            size="sm"
            status={statusSave}
            statusText={{
              loading: "Saving...",
              success: "Saved",
              error: "Try again",
              disabled: "Disabled",
            }}
            onClick={() =>
              document.getElementById(`image-upload-${section.id}`)?.click()
            }
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Upload Image
          </ButtonSubmit>
          <span className="text-xs text-gray-500">PNG, JPG (max 5MB)</span>
        </div>

        {images && images.length > 0 && (
          <div className="space-y-2">
            {images.map((file, fileIndex) => (
              <TextImage
                key={fileIndex}
                data={file}
                dealId={String(dealId)}
                sectionId={section.id}
                removeImage={removeImage}
                setFormError={setFormErrorCallback}
              />
            ))}
          </div>
        )}
      </div>
    </fieldset>
  );
}

function TextImage({
  data,
  dealId,
  sectionId,
  removeImage,
  setFormError,
}: {
  data: IDealImage;
  dealId: string;
  sectionId: number;
  removeImage: (id: number) => void;
  setFormError: (msg: string | null) => void;
}) {
  const [statusDelete, setStatusDelete] = useState<ButtonSubmitStatus>("idle");

  const removeImageHandle = async (id: number) => {
    setFormError(null);

    setStatusDelete("loading");
    try {
      await fetcherAdmin(
        `/admin/deals/${dealId}/content-section/${sectionId}/text-image/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      setStatusDelete("success");
      removeImage(id);
    } catch (err: any) {
      setStatusDelete("error");
      setFormError(err?.message ?? "Delete failed");
    }
  };

  useEffect(() => {
    if (statusDelete === "success" || statusDelete === "error") {
      const timer = setTimeout(() => setStatusDelete("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusDelete]);

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="h-10">
          <Image
            src={data.url}
            alt=""
            width={data.width}
            height={data.height}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-sm font-medium">{data.url}</p>
        <Copy
          className="w-4 cursor-pointer active:w-3 transition-all"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(data.url);
            } catch {}
          }}
        />
      </div>
      {statusDelete === "loading" ? (
        <span className="text-sm text-gray-500">Deleting...</span>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removeImageHandle(data.id)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
