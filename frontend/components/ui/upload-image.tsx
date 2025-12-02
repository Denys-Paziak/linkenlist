"use client";

import { useState } from "react";
import { Button } from "./button";
import { ImageIcon, Upload } from "lucide-react";

export function UploadImage({
  value,
  setFile,
  deleteFile,
  error,
  label,
  recommendedLabel = "Recommended: 1200x630px, PNG/JPG up to 5MB",
  acceptFiles = "image/png,image/jpeg",
}: {
  value: string;
  setFile: (file: File | null) => void;
  deleteFile: () => void;
  error?: string;
  label?: string;
  recommendedLabel?: string;
  acceptFiles?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div>
      {label ? (
        <p className="block text-sm font-medium text-foreground mb-2">
          {label}
        </p>
      ) : null}
      <div className="space-y-4">
        <div
          className={` rounded-lg text-center transition-colors ${
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
          } ${value ? "" : "border-2 p-8 border-dashed "}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files && files[0]) {
              setFile(files[0]);
            }
          }}
        >
          {value ? (
            <div
              className="relative w-full h-[231px] bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
              style={{ backgroundImage: `url(${value})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <p className="text-white font-medium">Image Preview</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={deleteFile}
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                {isDragging ? "Drop image here" : "Upload image"}
              </p>
              <p className="text-xs text-gray-500">{recommendedLabel}</p>
              <label htmlFor="imageUpload">
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept={acceptFiles}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFile(file);
                }}
              />
            </>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
