import { IRealestate } from "./Realestate";

export enum EContactInboxStatus {
  NEW = "new",
  OPEN = "open",
  RESOLVED = "resolved",
}

export enum EContactInboxType {
  GENERAL_QUESTION = "General Question",
  TECHNICAL_ISSUE = "Technical Issue",
  RESOURCE_SUBMISSION = "Resource Submission/Update",
  DEAL_SUBMISSION = "Deal Submission",
  PARTNERSHIP_INQUIRY = "Partnership Inquiry",
  FEEDBACK_SUGGESTION = "Feedback/Suggestion",
  OTHER = "Other",
  REPORT = "Report",
}

export interface IContactInbox {
  id: number;
  type: EContactInboxType;
  name: string | null;
  email: string | null;
  subject: string;
  firstMessage: string;

  reportReason: string | null;

  reportListing: Pick<
    IRealestate,
    "id" | "slug" | "street" | "unit" | "zip" | "state" | "city"
  > | null;

  messages: IContactInboxMessage[];

  status: EContactInboxStatus;

  createdAt: string;

  updatedAt: string;
}

export interface IContactInboxMessage {
  id: number;

  name: string | null;

  message: string;

  emailSent: boolean;

  createdAt: string;

  updatedAt: string;
}
