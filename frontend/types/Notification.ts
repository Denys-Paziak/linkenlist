import { IUser } from "./User"

export enum ENotificationStatus {
	NEW = 'new',
	READ = 'read'
}

export interface INotification {
	id: number
	title: string
	message: string
	status: ENotificationStatus
	sender: Pick<IUser, "id" | "firstName" | "lastName" | "username"> | null
	createdAt: string
	updatedAt: string
}