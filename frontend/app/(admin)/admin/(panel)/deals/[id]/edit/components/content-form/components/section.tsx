"use client";

import { CheckCircle, Paperclip, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";
import { Switch } from "../../../../../../../../../../components/ui/switch";
import { Button } from "../../../../../../../../../../components/ui/button";
import { Textarea } from "../../../../../../../../../../components/ui/textarea";
import { IDeal, IDealSection } from "../../../../../../../../../../types/Deal";
import {
  ButtonSubmitStatus,
  ButtonSubmit,
} from "../../../../../../../../../../components/ui/button-submit";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sectionFormSchema,
  SectionFormSchemaType,
} from "../../../../../../../../../../lib/schemas/deal/section-form-schema";
import {
  cn,
  formatSmartSize,
  pickDirty,
} from "../../../../../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../../../../../components/ui/error-alert";
import { fetcherAdmin } from "../../../../../../../../../../lib/fetcher";
import { useParams } from "next/navigation";
import { mutate } from "swr";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { MarkdownSection } from "../../../../../../../../../../components/markdown-section/markdown-section";
import { insertIconCommand } from "../../../../../../../../../../components/markdown-section/insert-icon-command";
import { Input } from "../../../../../../../../../../components/ui/input";

interface IFileData {
  id?: number;
  name: string;
  size: string;
}

export function Section({
  section,
  allSections,
  index,
}: {
  section: IDealSection;
  allSections: IDealSection[];
  index: number;
}) {
  const { id: dealId } = useParams();

  const [statusSave, setStatusSave] = useState<ButtonSubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [bodyMd, setBodyMd] = useState<string | undefined>(undefined);

  const [attached, setAttached] = useState<IFileData[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<SectionFormSchemaType>({
    resolver: zodResolver(sectionFormSchema),
    values: section
      ? {
          title: section?.title || "",
          enabled: section?.enabled ?? true,
        }
      : {
          title: "",
          enabled: true,
        },
    mode: "onBlur",
  });

  const handleFileAttachment = (file: File) => {
    const fileData = {
      name: file.name,
      size: formatSmartSize(file.size),
    };
    setAttached((state) => [...state, fileData]);
    setFiles((state) => [...state, file]);
  };

  const removeAttachedFile = (fileIndex: number) => {
    setAttached((state) => state?.filter((_, index) => index !== fileIndex));

    const realFileIndex = fileIndex - (attached.length - files.length);

    setFiles((state) => state?.filter((_, index) => index !== realFileIndex));
  };

  useEffect(() => {
    setAttached(
      section.attachments
        .map((item) => ({
          id: item.id,
          name: item.name,
          size: formatSmartSize(item.sizeBytes),
        }))
        .reverse()
    );
    setBodyMd(section?.bodyMd || undefined);
  }, [section]);

  const submitForm = async () => {
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) {
      setFormError("Please fix the errors below.");
      return;
    }

    setStatusSave("loading");
    try {
      const values = form.getValues();
      const dirty = pickDirty(values, form.formState.dirtyFields);

      const formData = new FormData();

      formData.append(
        "payload",
        JSON.stringify({
          ...dirty,
          bodyMd,
          remainedAttachments: attached
            .map((item) => item.id)
            .filter((id) => id),
        })
      );

      files.forEach((item) => {
        formData.append("attached", item);
      });

      await fetcherAdmin(
        `/admin/deals/${dealId}/content-section/${section.id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );

      mutate(`/admin/deals/${dealId}`).then(() => {
        setStatusSave("success");
        form.reset();
        setFiles([]);
      });
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

  const loading = statusSave === "loading";

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={loading || !section}>
        <div className="border rounded-lg p-4 space-y-3">
          {formError ? <ErrorAlert message={formError} /> : null}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Title */}
              <div className="w-[216px]">
                <Input
                  placeholder="Custom Section"
                  {...form.register("title")}
                  error={!!form.formState.errors.title}
                  errorMessage={form.formState.errors.title?.message}
                />
              </div>

              <Controller
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <Switch
                    id="enabled"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
            </div>
            <Actions
              section={section}
              allSections={allSections}
              index={index}
            />
          </div>

          <div data-color-mode="light" className="markdown">
            <MDEditor
              height={200}
              value={bodyMd}
              onChange={setBodyMd}
              textareaProps={{
                maxLength: 10_000,
              }}
              commands={[
                commands.bold,
                commands.italic,
                commands.strikethrough,
                commands.hr,
                commands.group(
                  [
                    commands.heading1,
                    commands.heading2,
                    commands.heading3,
                    commands.heading4,
                    commands.heading5,
                    commands.heading6,
                  ],
                  {
                    name: "title",
                    groupName: "title",
                    buttonProps: { "aria-label": "Insert title" },
                  }
                ),
                commands.divider,
                commands.link,
                commands.quote,
                insertIconCommand,
                commands.table,
                commands.divider,
                commands.orderedListCommand,
                commands.unorderedListCommand,
                commands.divider,
                commands.help,
              ]}
              extraCommands={[
                commands.codeEdit,
                commands.codeLive,
                commands.codePreview,
                commands.divider,
                commands.fullscreen,
              ]}
              components={{
                preview: (source) => <MarkdownSection content={source} />,
              }}
            />
            <div></div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id={`file-upload-${section.id}`}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileAttachment(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById(`file-upload-${section.id}`)?.click()
                }
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Attach File
              </Button>
              <span className="text-xs text-gray-500">
                PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (max 50MB)
              </span>
            </div>

            {attached && attached.length > 0 && (
              <div className="space-y-2">
                {attached.map((file, fileIndex) => (
                  <div
                    key={fileIndex}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">{file.size}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachedFile(fileIndex)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ButtonSubmit
            type="button"
            onClick={submitForm}
            status={statusSave}
            statusText={{
              loading: "Saving...",
              success: "Saved",
              error: "Try again",
              disabled: "Disabled",
            }}
            className="font-semibold"
            disabled={loading || !section}
          >
            <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            Save
          </ButtonSubmit>
        </div>
      </fieldset>
    </form>
  );
}

function Actions({
  section,
  allSections,
  index,
}: {
  section: IDealSection;
  allSections: IDealSection[];
  index: number;
}) {
  const { id: dealId } = useParams();

  const [statusRemove, setStatusRemove] = useState<ButtonSubmitStatus>("idle");
  const [statusMoveUp, setStatusMoveUp] = useState<ButtonSubmitStatus>("idle");
  const [statusMoveDown, setStatusMoveDown] =
    useState<ButtonSubmitStatus>("idle");

  const removeSection = async () => {
    setStatusRemove("loading");
    try {
      await fetcherAdmin(
        `/admin/deals/${dealId}/content-section/${section.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      setStatusRemove("success");
      mutate<IDeal>(
        `/admin/deals/${dealId}`,
        (draft) =>
          draft
            ? {
                ...draft,
                sections: draft.sections.filter(
                  (item) => item.id !== section.id
                ),
              }
            : undefined,
        { revalidate: true }
      );
    } catch (err: any) {
      setStatusRemove("error");
    }
  };

  const moveSectionUp = async () => {
    setStatusMoveUp("loading");
    try {
      await fetcherAdmin(`/admin/deals/${dealId}/content-section/positions`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: allSections.map((item, position) => {
            if (index === position) {
              return {
                sectionId: item.id,
                position: position - 1,
              };
            }

            if (index - 1 === position) {
              return {
                sectionId: item.id,
                position: position + 1,
              };
            }

            return {
              sectionId: item.id,
              position,
            };
          }),
        }),
      });

      setStatusMoveUp("success");
      mutate<IDeal>(
        `/admin/deals/${dealId}`,
        (draft) =>
          draft
            ? {
                ...draft,
                sections: (() => {
                  const newSections = [...draft.sections];

                  [newSections[index - 1], newSections[index]] = [
                    newSections[index],
                    newSections[index - 1],
                  ];

                  return newSections;
                })(),
              }
            : undefined,
        { revalidate: true }
      );
    } catch (err: any) {
      setStatusMoveUp("error");
    }
  };

  const moveSectionDown = async () => {
    setStatusMoveDown("loading");
    try {
      await fetcherAdmin(`/admin/deals/${dealId}/content-section/positions`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: allSections.map((item, position) => {
            if (index === position) {
              return {
                sectionId: item.id,
                position: position + 1,
              };
            }

            if (index + 1 === position) {
              return {
                sectionId: item.id,
                position: position - 1,
              };
            }

            return {
              sectionId: item.id,
              position,
            };
          }),
        }),
      });

      setStatusMoveDown("success");
      mutate<IDeal>(
        `/admin/deals/${dealId}`,
        (draft) =>
          draft
            ? {
                ...draft,
                sections: (() => {
                  const newSections = [...draft.sections];

                  [newSections[index], newSections[index + 1]] = [
                    newSections[index + 1],
                    newSections[index],
                  ];

                  return newSections;
                })(),
              }
            : undefined,
        { revalidate: true }
      );
    } catch (err: any) {
      setStatusMoveDown("error");
    }
  };

  useEffect(() => {
    if (statusRemove === "success" || statusRemove === "error") {
      const timer = setTimeout(() => setStatusRemove("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (statusMoveUp === "success" || statusMoveUp === "error") {
      const timer = setTimeout(() => setStatusMoveUp("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (statusMoveDown === "success" || statusMoveDown === "error") {
      const timer = setTimeout(() => setStatusMoveDown("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusRemove, statusMoveUp, statusMoveDown]);

  return (
    <div className="flex items-center gap-2">
      <ButtonSubmit
        type="button"
        size="sm"
        variant="ghost"
        onClick={moveSectionUp}
        status={statusMoveUp}
        disabled={
          index === 0 ||
          statusMoveUp === "loading" ||
          statusMoveDown === "loading"
        }
        className="w-[36px]"
      >
        ↑
      </ButtonSubmit>
      <ButtonSubmit
        type="button"
        size="sm"
        variant="ghost"
        onClick={moveSectionDown}
        status={statusMoveDown}
        disabled={
          index === allSections.length - 1 ||
          statusMoveUp === "loading" ||
          statusMoveDown === "loading"
        }
        className="w-[36px]"
      >
        ↓
      </ButtonSubmit>
      <ButtonSubmit
        type="button"
        size="icon"
        variant="ghost"
        onClick={removeSection}
        status={statusRemove}
        disabled={statusRemove === "loading"}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </ButtonSubmit>
    </div>
  );
}
