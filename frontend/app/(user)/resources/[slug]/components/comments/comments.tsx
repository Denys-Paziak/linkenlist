"use client";

import { useMemo, useState } from "react";
import { Button } from "../../../../../../components/ui/button";
import useSWR from "swr";
import useSWRInfinite, { SWRInfiniteKeyedMutator } from "swr/infinite";
import { IComment } from "../../../../../../types/Comment";
import { IUser } from "../../../../../../types/User";
import { PostForm } from "./components/post-form";
import { Comment } from "./components/comment";
import { useUser } from "../../../../../../contexts/user-context";
import { DeleteDialog } from "./components/delete-dialog";
import { IResource } from "../../../../../../types/Resource";

function CommentsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 items-start animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-3 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-full bg-gray-200 rounded mb-2" />
            <div className="h-3 w-3/4 bg-gray-200 rounded" />
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Comments({ data: resource }: { data: IResource }) {
  const limit = 20;

  const { data: authUser } = useSWR<IUser>("/users/self");
  const { setShowLoginModal } = useUser();

  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [replyingComment, setReplyingComment] = useState<number | null>(null);
  const [deleteComment, setDeleteComment] = useState<{
    deleteId: number;
    replyMutate: SWRInfiniteKeyedMutator<[IComment[], number][]> | null;
  } | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const getKey = (
    pageIndex: number,
    previousPageData?: [IComment[], number]
  ) => {
    if (previousPageData && previousPageData[0]?.length === 0) return null;
    return `/comments/resource/${resource.id}?page=${pageIndex + 1}&limit=${limit}`;
  };

  const {
    data: pages,
    isValidating,
    size,
    setSize,
    mutate,
  } = useSWRInfinite<[IComment[], number]>(getKey, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const totalCount = pages?.[0]?.[1] ?? 0;

  const allComments = useMemo(
    () => (pages ? pages.flatMap((p) => p[0]) : []),
    [pages]
  );

  const isInitialLoading = !pages && isValidating;
  const isRefreshing = !!pages && isValidating;

  const visibleComments = showAllComments
    ? allComments
    : allComments.slice(0, 3);

  const canLoadMore = allComments.length < totalCount;
  const isLoadingMore = isValidating && !!pages && size > 0;

  return (
    <section className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-foreground text-lg flex items-center gap-3">
          Comments ({totalCount})
          {isRefreshing && (
            <span className="text-xs font-medium text-gray-500">Updating…</span>
          )}
        </h3>
      </div>

      {authUser ? (
        <PostForm resourceId={resource.id} mutate={mutate} />
      ) : (
        <div>
          <p className="mb-4 text-gray-600">Please log in to post a comment.</p>
          <Button onClick={() => setShowLoginModal(true)}>Log In</Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6 relative mt-6">
        {isInitialLoading ? (
          <CommentsSkeleton />
        ) : (
          <>
            {visibleComments.map((comment) => (
              <Comment
                key={comment.id}
                depth={0}
                resource={resource}
                comment={comment}
                commentParentMutate={null}
                mutate={mutate}
                ownerId={authUser?.id}
                editingId={editingComment}
                replyingId={replyingComment}
                setEditingComment={setEditingComment}
                setReplyingComment={setReplyingComment}
                setDeleteComment={setDeleteComment}
              />
            ))}

            {/* Fading Effect */}
            {!showAllComments && allComments.length > 3 && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </>
        )}
      </div>

      {/* Show more/less for preview mode */}
      {!isInitialLoading && !showAllComments && allComments.length > 3 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllComments(true)}
            className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
          >
            Show more comments
          </Button>
        </div>
      )}

      {!isInitialLoading && showAllComments && allComments.length > 3 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllComments(false)}
            className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
          >
            Show less
          </Button>
        </div>
      )}

      {/* Load more (append) */}
      {!isInitialLoading && showAllComments && totalCount > 0 && (
        <div className="text-center mt-6">
          {canLoadMore ? (
            <Button
              variant="outline"
              disabled={isLoadingMore}
              onClick={() => setSize(size + 1)}
              className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
            >
              {isLoadingMore
                ? "Loading…"
                : `Load more (${allComments.length}/${totalCount})`}
            </Button>
          ) : (
            allComments.length > 0 && (
              <div className="text-xs text-gray-400">All comments loaded.</div>
            )
          )}
        </div>
      )}

      <DeleteDialog
        commentId={deleteComment?.deleteId || null}
        handleCancelDelete={() => setDeleteComment(null)}
        handleSuccessDelete={() => {
          if (!deleteComment?.replyMutate) {
            mutate();
          } else {
            deleteComment.replyMutate();
          }

          setTimeout(() => {
            setDeleteComment(null);
          }, 2000);
        }}
      />
    </section>
  );
}
