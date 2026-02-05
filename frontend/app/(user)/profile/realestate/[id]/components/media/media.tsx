"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { PhotoUpload } from "./components/photo-upload";
import {
  EPackageType,
  IListingPhoto,
} from "../../../../../../../types/Realestate";
import { ButtonSubmitStatus } from "../../../../../../../components/ui/button-submit";
import { PhotoPreview } from "./components/photo-preview";
import { FormHandle } from "../../page";
import { ErrorAlert } from "../../../../../../../components/ui/error-alert";

export const Media = forwardRef<
  FormHandle,
  {
    data?: IListingPhoto[];
    selectedPackage: EPackageType;
  }
>(function Media({ data, selectedPackage }, ref) {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [photos, setPhotos] = useState<IListingPhoto[]>([]);
  const [plugs, setPlugs] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setPhotos(data);
    }
  }, [data]);

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        if (!isDirty) {
          return { ok: true, changed: false as const, data: undefined };
        }

        return {
          ok: true as const,
          changed: true as const,
          data: {
            photos: photos.map((item, index) => ({
              id: item.id,
              caption: item.caption,
              position: index + 1,
            })),
          },
        };
      },
      resetDirty: () => {
        setIsDirty(false);
      },
    }),
    [photos, isDirty]
  );

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
        {error ? <ErrorAlert message={error} /> : null}
        <PhotoUpload
          status={status}
          setStatus={setStatus}
          photos={photos}
          setPhotos={setPhotos}
          selectedPackage={selectedPackage}
          setPlugs={setPlugs}
          setIsDirty={() => {
            setError(null);
            if (!isDirty) {
              setIsDirty(true);
            }
          }}
        />
        <PhotoPreview
          status={status}
          photos={photos}
          setPhotos={setPhotos}
          plugs={plugs}
          setPlugs={setPlugs}
          setIsDirty={() => {
            if (!isDirty) {
              setIsDirty(true);
            }
          }}
        />
      </div>
    </div>
  );
});
