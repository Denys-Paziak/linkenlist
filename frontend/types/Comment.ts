export enum ECommentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  HIDDEN = "hidden",
}

export enum ECommentPageType {
  DEAL = "deal",
  RESOURCE = "resource",
}

export interface IComment {
  id: number;
  body: string;
  status: ECommentStatus;
  pageType: ECommentPageType;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    aratar: {
      id: number;
      url: string;
      width: number;
      height: number;
    } | null;
  };
  likesCount: number;
  dislikesCount: number;
  liked: boolean;
  disliked: boolean;
  repliesCount: number;
}

export interface ICommentAdmin {
  id: number;
  body: string;
  status: ECommentStatus;
  pageType: ECommentPageType;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    privateEmail: string;
    firstName: string | null;
    lastName: string | null;
    username: string;
    createdAt: string;
  };
  pageDeal: {
    id: true;
    title: true;
    slug: true;
  };
  pageResource: {
    id: true;
    title: true;
    slug: true;
  };
}
