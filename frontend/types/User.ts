import { IOwnerRealestate } from "./Realestate";

export interface IUser {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar: IUserAvatar | null;
  privateEmail: string;
  publicEmail: string | null;
  professionalTitle: string | null;
  company: string | null;
  phone: string | null;
  footerDisclaimer: boolean;
  freeListingCredit: number;
  isPrivate: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface IUserTable {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  privateEmail: string;
  phone: string | null;
  createdAt: string;
  company: string | null;
  lastActivity: string;
  banExpirationDate: string | null;
  freeListingCredit: number;
  listings: Pick<
    IOwnerRealestate,
    | "id"
    | "forSale"
    | "forRent"
    | "street"
    | "unit"
    | "zip"
    | "state"
    | "city"
    | "package"
    | "expiresAt"
    | "status"
    | "slug"
  >[];
}

export interface IUserAvatar {
  id: number;
  url: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}
