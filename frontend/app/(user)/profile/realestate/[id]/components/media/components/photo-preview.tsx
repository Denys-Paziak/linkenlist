"use client";

import { AlertCircle, Loader2, X } from "lucide-react";
import { IListingPhoto } from "../../../../../../../../types/Realestate";
import { Label } from "../../../../../../../../components/ui/label";
import { ButtonSubmitStatus } from "../../../../../../../../components/ui/button-submit";
import Image from "next/image";
import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { Dispatch, SetStateAction } from "react";
import { move } from "@dnd-kit/helpers";
import { Button } from "../../../../../../../../components/ui/button";
import { Input } from "../../../../../../../../components/ui/input-listing-variant";
import { useParams } from "next/navigation";
import { fetcherUser } from "../../../../../../../../lib/fetcher";

export function PhotoPreview({
  status,
  photos,
  setPhotos,
  plugs,
  setPlugs,
  setIsDirty,
}: {
  status: ButtonSubmitStatus;
  photos: IListingPhoto[];
  setPhotos: Dispatch<SetStateAction<IListingPhoto[]>>;
  plugs: string[];
  setPlugs: Dispatch<SetStateAction<string[]>>;
  setIsDirty: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {photos.length > 1 && "Drag photos to reorder them. "}
        Add comments to describe each photo.
      </p>
      <DragDropProvider
        onDragEnd={(event) => {
          setIsDirty();
          setPhotos((photos) => move(photos, event));
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photos.map((photoData, index) => (
            <Photo
              key={photoData.id}
              index={index}
              photoData={photoData}
              setPhotos={setPhotos}
              setIsDirty={setIsDirty}
            />
          ))}
          {plugs.map((plugUrl, index) => {
            return (
              <div key={index} className="relative">
                <div className="relative bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">
                      Photo
                    </span>
                  </div>

                  <Image
                    src={plugUrl}
                    alt={"Photo plug" + (index + 1)}
                    width={250}
                    height={250}
                    className="w-full h-[250px] object-cover rounded-lg  mb-3"
                  />

                  <div className="space-y-2">
                    <Label
                      htmlFor={`photo-comment-${index}`}
                      className="text-xs font-medium text-gray-700"
                    >
                      Photo Description
                    </Label>
                    <div className="relative">
                      <Input
                        id={`photo-comment-${index}`}
                        type="text"
                        placeholder="Add a description for this photo..."
                        onChange={(e) => { }}
                        className="text-sm pr-12"
                        maxLength={200}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        0/200
                      </span>
                    </div>
                  </div>

                  {status === "loading" ? (
                    <div className="absolute z-10 flex items-center justify-center inset-0 bg-black/10">
                      <Loader2 className="animate-spin w-11 h-11 text-white" />
                    </div>
                  ) : null}
                  {status === "error" ? (
                    <div className="absolute z-10 flex items-center justify-center inset-0 bg-black/10">
                      <div className="p-2 flex flex-col gap-1 justify-center items-center bg-white rounded-sm">
                        <AlertCircle className="w-14 h-14 text-red-600" />
                        <p className="text-center">The photo could not be uploaded. <br /> Please delete it and try again.</p>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setPlugs(state => state.filter(item => item !== plugUrl))
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </DragDropProvider>
    </div>
  );
}

function Photo({
  photoData,
  setPhotos,
  index,
  setIsDirty,
}: {
  photoData: IListingPhoto;
  setPhotos: Dispatch<SetStateAction<IListingPhoto[]>>;
  index: number;
  setIsDirty: () => void;
}) {
  const { id } = useParams();

  const { ref, handleRef, sortable } = useSortable({ id: photoData.id, index });

  const onDelete = async (photoId: number) => {
    await fetcherUser(
      `/listings/${id}/delete-image/${photoId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">
            Photo {sortable.index + 1}
          </span>
          <button
            type="button"
            ref={handleRef}
            className="flex items-center gap-1 text-xs text-gray-400 select-none"
          >
            <span>⋮⋮</span>
            <span>Drag to reorder</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDirty();
              setPhotos((state) =>
                state.filter((item) => item.id !== photoData.id)
              );
              onDelete(photoData.id)
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Image
          src={photoData.url}
          alt={photoData.caption || ""}
          width={photoData.width}
          height={photoData.height}
          className="w-full h-[250px] object-cover rounded-lg mb-3"
        />

        <div className="space-y-2">
          <Label
            htmlFor={`photo-comment-${index}`}
            className="text-xs font-medium text-gray-700"
          >
            Photo Description
          </Label>
          <div className="relative">
            <Input
              id={`photo-comment-${index}`}
              type="text"
              placeholder="Add a description for this photo..."
              value={photoData.caption || ""}
              onChange={(e) => {
                setIsDirty();
                setPhotos((state) =>
                  state.map((item) => {
                    if (item.id === photoData.id) {
                      return {
                        ...item,
                        caption: e.target.value,
                      };
                    }

                    return item;
                  })
                );
              }}
              className="text-sm pr-12"
              maxLength={200}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {photoData.caption?.length || 0}/200
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
