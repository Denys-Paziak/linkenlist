"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ECommentStatus, IComment } from "../../../../../../../types/Comment";
import { cn, getInitials, timeAgo } from "../../../../../../../lib/utils";
import { ThumbsDown, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { fetcherUser } from "../../../../../../../lib/fetcher";
import useSWRInfinite, { SWRInfiniteKeyedMutator } from "swr/infinite";
import { ReplyForm } from "./reply-form";
import { EditForm } from "./edit-form";
import { Button } from "../../../../../../../components/ui/button";
import { StatusChip } from "../../../../../../../components/ui/status-chip";
import { IResource } from "../../../../../../../types/Resource";

export function Comment({
  depth,
  resource,
  comment,
  commentParentMutate,
  mutate,
  ownerId,
  replyingId,
  editingId,
  setReplyingComment,
  setEditingComment,
  setDeleteComment,
}: {
  depth: number;
  resource: IResource;
  comment: IComment;
  commentParentMutate: SWRInfiniteKeyedMutator<[IComment[], number][]> | null;
  mutate: SWRInfiniteKeyedMutator<[IComment[], number][]>;
  ownerId?: number;
  replyingId: number | null;
  editingId: number | null;
  setReplyingComment: (id: number | null) => void;
  setEditingComment: (id: number | null) => void;
  setDeleteComment: (
    data: {
      deleteId: number;
      replyMutate: SWRInfiniteKeyedMutator<[IComment[], number][]> | null;
    } | null,
  ) => void;
}) {
  const limit = 5;

  const [repliesOpen, setRepliesOpen] = useState(false);

  const getKey = (
    pageIndex: number,
    previousPageData?: [IComment[], number],
  ) => {
    if (!repliesOpen) return null;
    if (previousPageData && previousPageData[0]?.length === 0) return null;

    const page = pageIndex + 1;
    return `/comments/${comment.id}/replies?page=${page}&limit=${limit}`;
  };

  const {
    data: repliesPages,
    size,
    setSize,
    isValidating: isRepliesValidating,
    mutate: mutateReplies,
  } = useSWRInfinite<[IComment[], number]>(getKey, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const totalReplies = repliesPages?.[0]?.[1] ?? 0;

  const replies = useMemo(
    () => (repliesPages ? repliesPages.flatMap((p) => p[0]) : []),
    [repliesPages],
  );

  const isInitialRepliesLoading =
    repliesOpen && !repliesPages && isRepliesValidating;
  const canLoadMore = replies.length < totalReplies;

  const isLoadingMore =
    repliesOpen && isRepliesValidating && size > 0 && !!repliesPages;

  useEffect(() => {
    if (replyingId === comment.id && !repliesOpen) {
      setRepliesOpen(true);
    }
  }, [replyingId]);

  return (
    <div className={"space-y-4"}>
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-semibold">
          {comment.user?.avatar ? (
            <Image
              src={comment.user.avatar.url}
              alt={comment.user.username}
              width={comment.user.avatar.width}
              height={comment.user.avatar.height}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            getInitials(
              `${comment?.user?.firstName || ""} ${comment?.user?.lastName || ""}`,
            )
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm">
              @{comment.user.username}
            </span>
            <span className="text-gray-500 text-xs">
              {timeAgo(comment.createdAt)}
            </span>
            {ownerId === comment.user.id &&
              comment.status === ECommentStatus.APPROVED && (
                <StatusChip status={"published"} text="Approved" />
              )}
            {ownerId === comment.user.id &&
              comment.status === ECommentStatus.HIDDEN && (
                <StatusChip status={"expired"} text="Rejected" />
              )}
            {ownerId === comment.user.id &&
              comment.status === ECommentStatus.PENDING && (
                <StatusChip status={"draft"} text="Pending" />
              )}
          </div>

          {editingId === comment.id ? (
            <EditForm
              comment={comment}
              setEditingComment={setEditingComment}
              mutate={mutate}
            />
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              {comment.body}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {ownerId && (
              <>
                <LikeButton comment={comment} mutate={mutate} />
                <DislikedButton comment={comment} mutate={mutate} />

                <button
                  onClick={() => setReplyingComment(comment.id)}
                  className="text-gray-500 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 px-2 py-1 rounded-md"
                >
                  Reply
                </button>
              </>
            )}

            {ownerId === comment.user.id && (
              <button
                onClick={() => setEditingComment(comment.id)}
                className="text-gray-500 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 px-2 py-1 rounded-md"
              >
                Edit
              </button>
            )}

            {ownerId === comment.user.id && (
              <DeleteButton
                handleDelete={() => {
                  setDeleteComment({
                    deleteId: comment.id,
                    replyMutate: commentParentMutate,
                  });
                }}
              />
            )}

            {comment.repliesCount > 0 && (
              <button
                onClick={() => setRepliesOpen((v) => !v)}
                className="text-gray-500 hover:text-gray-900 text-xs transition-all duration-200 px-2 py-1 rounded-md border border-gray-200 hover:border-gray-300 bg-transparent inline-flex items-center gap-1"
              >
                {repliesOpen ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Hide replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Show replies ({comment.repliesCount})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      {repliesOpen && (
        <div
          className={cn(
            "mt-4  space-y-4 border-l-2 border-gray-200",
            depth <= 2 ? "ml-10" : "",
            depth <= 1 ? "pl-4" : "pl-1",
          )}
        >
          {replyingId === comment.id && (
            <ReplyForm
              resourceId={resource.id}
              comment={comment}
              setReplyingComment={setReplyingComment}
              mutate={mutateReplies}
            />
          )}

          {isInitialRepliesLoading ? (
            <div className="text-xs text-gray-500">Loading replies…</div>
          ) : (
            <div className="space-y-6">
              {replies.map((reply) => (
                <Comment
                  depth={depth + 1}
                  key={reply.id}
                  resource={resource}
                  comment={reply}
                  commentParentMutate={mutateReplies}
                  mutate={mutateReplies}
                  ownerId={ownerId}
                  editingId={editingId}
                  replyingId={replyingId}
                  setEditingComment={setEditingComment}
                  setReplyingComment={setReplyingComment}
                  setDeleteComment={setDeleteComment}
                />
              ))}

              {totalReplies > 0 && canLoadMore && (
                <Button
                  variant="outline"
                  disabled={isLoadingMore}
                  onClick={() => setSize(size + 1)}
                  className="h-8 px-3 text-xs bg-transparent"
                >
                  {isLoadingMore
                    ? "Loading…"
                    : `Load more replies (${replies.length}/${totalReplies})`}
                </Button>
              )}

              {totalReplies > 0 && !canLoadMore && replies.length > 0 && (
                <div className="text-xs text-gray-400">All replies loaded.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DeleteButton({ handleDelete }: { handleDelete: () => void }) {
  return (
    <button
      onClick={handleDelete}
      className="text-gray-500 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 px-2 py-1 rounded-md"
    >
      Delete
    </button>
  );
}

export function LikeButton({
  comment,
  mutate,
}: {
  comment: IComment;
  mutate: SWRInfiniteKeyedMutator<[IComment[], number][]>;
}) {
  const handleLike = async () => {
    try {
      mutate(
        (draft) => {
          if (!draft) return draft;

          return draft.map(([items, total]) => {
            const updatedItems = items.map((c) => {
              if (c.id !== comment.id) return c;

              return {
                ...c,
                liked: !c.liked,
                likesCount: c.liked ? c.likesCount - 1 : c.likesCount + 1,
                disliked: false,
                dislikesCount: c.disliked
                  ? c.dislikesCount - 1
                  : c.dislikesCount,
              };
            });

            return [updatedItems, total];
          });
        },
        { revalidate: false },
      );

      await fetcherUser(`/comments/${comment.id}/like`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {
      // опційно: повернути консистентність якщо запит впав
      mutate();
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 text-xs transition-all duration-200 px-2 py-1 rounded-md ${
        comment.liked
          ? "text-blue-600 bg-blue-50"
          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      <ThumbsUp className={`h-3 w-3 ${comment.liked ? "fill-current" : ""}`} />
      <span>{comment.likesCount}</span>
    </button>
  );
}

export function DislikedButton({
  comment,
  mutate,
}: {
  comment: IComment;
  mutate: SWRInfiniteKeyedMutator<[IComment[], number][]>;
}) {
  const handleDislike = async () => {
    try {
      mutate(
        (draft) => {
          if (!draft) return draft;

          return draft.map(([items, total]) => {
            const updatedItems = items.map((c) => {
              if (c.id !== comment.id) return c;

              return {
                ...c,
                liked: false,
                likesCount: c.liked ? c.likesCount - 1 : c.likesCount,
                disliked: !c.disliked,
                dislikesCount: c.disliked
                  ? c.dislikesCount - 1
                  : c.dislikesCount + 1,
              };
            });

            return [updatedItems, total];
          });
        },
        { revalidate: false },
      );

      await fetcherUser(`/comments/${comment.id}/dislike`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {
      mutate();
    }
  };

  return (
    <button
      onClick={handleDislike}
      className={`flex items-center gap-1 text-xs transition-all duration-200 px-2 py-1 rounded-md ${
        comment.disliked
          ? "text-red-600 bg-red-50"
          : "text-gray-500 hover:text-red-600 hover:bg-red-50"
      }`}
    >
      <ThumbsDown
        className={`h-3 w-3 ${comment.disliked ? "fill-current" : ""}`}
      />
      <span>{comment.dislikesCount}</span>
    </button>
  );
}
