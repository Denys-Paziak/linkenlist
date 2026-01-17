"use client";

import { Upload } from "lucide-react";
import { Button } from "../../../../../../../../components/ui/button";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import {
  EPackageType,
  IListingPhoto,
} from "../../../../../../../../types/Realestate";
import { ErrorAlert } from "../../../../../../../../components/ui/error-alert";
import { fetcherUser } from "../../../../../../../../lib/fetcher";
import { useParams } from "next/navigation";
import { ButtonSubmitStatus } from "../../../../../../../../components/ui/button-submit";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function PhotoUpload({
  status,
  setStatus,
  photos,
  setPhotos,
  selectedPackage,
  setPlugs,
  setIsDirty,
}: {
  status: ButtonSubmitStatus;
  setStatus: Dispatch<SetStateAction<ButtonSubmitStatus>>;
  photos: IListingPhoto[];
  setPhotos: Dispatch<SetStateAction<IListingPhoto[]>>;
  selectedPackage: EPackageType;
  setPlugs: Dispatch<SetStateAction<string[]>>;
  setIsDirty: () => void;
}) {
  const { id } = useParams();
  const photosLimit = getPhotoLimit(selectedPackage || "basic");

  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDirty();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (photos.length + validFiles.length <= photosLimit) {
      setError("");
      setPlugs(validFiles.map((item) => URL.createObjectURL(item)));
      const newPhotos = await uploadPhotos(validFiles);
      if (newPhotos) {
        setPlugs([]);
        setPhotos((state) => [...state, ...newPhotos]);
      }
    } else {
      setError(
        `You can upload no more than ${photosLimit} photos in the ${selectedPackage} package.`
      );
    }
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsDirty();
    const files = Array.from(e.target.files as FileList) as File[];

    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (photos.length + validFiles.length <= photosLimit) {
      setError("");
      setPlugs(validFiles.map((item) => URL.createObjectURL(item)));
      const newPhotos = await uploadPhotos(validFiles);
      if (newPhotos) {
        setPlugs([]);
        setPhotos((state) => [...state, ...newPhotos]);
      }
    } else {
      setError(
        `You can upload no more than ${photosLimit} photos in the ${selectedPackage} package.`
      );
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadPhotos = async (photos: File[]) => {
    setStatus("loading");

    try {
      const formData = new FormData();

      formData.append("payload", JSON.stringify({}));

      photos.forEach((item) => {
        formData.append("photos", item);
      });

      const data: IListingPhoto[] = await fetcherUser(
        `/listings/${id}/upload-images`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      setStatus("success");
      return data;
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Update failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Photos</h4>
        <span className="text-sm text-gray-500">
          {photos.length}/{photosLimit}
          photos
        </span>
      </div>
      {error ? <ErrorAlert message={error} /> : null}
      <fieldset disabled={photos.length > photosLimit || status === "loading"}>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            {isDragging
              ? "Drop photos here"
              : "Drag and drop photos here, or click to select"}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            {selectedPackage === "premium"
              ? "Up to 40 photos"
              : "Up to 5 photos"}
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            id="photo-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Select Photos
          </Button>
        </div>
      </fieldset>
    </div>
  );
}

const getPhotoLimit = (packageType: string): number => {
  switch (packageType) {
    case "basic":
      return 5;
    case "premium":
      return 40;
    default:
      return 40;
  }
};
