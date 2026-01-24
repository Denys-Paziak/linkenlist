import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EContactInboxStatus } from '../../../interfaces/EContactInboxStatus'
import { EContactInboxType } from '../../../interfaces/EContactInboxType'
import { Listing } from '../../listing/entities/Listing.entity'

import { ContactInboxMessage } from './ContactInboxMessage.entity'
import { User } from '../../user/entities/User.entity'

@Entity('contact_inbox')
export class ContactInbox {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'enum', enum: EContactInboxType })
	type: EContactInboxType

	@Column({ type: 'text', nullable: true })
	name: string | null
	@Column({ type: 'text', nullable: true })
	email: string | null
	@Column({ type: 'text' })
	subject: string
	@Column({ name: 'first_message', type: 'text' })
	firstMessage: string

	@Column({ name: 'report_reason', type: 'text', nullable: true })
	reportReason: string | null

	@ManyToOne(() => Listing, { onDelete: 'SET NULL', nullable: true })
	reportListing: Listing | null

	@ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
	user: User | null

	@OneToMany(() => ContactInboxMessage, message => message.contactInbox, { cascade: true })
	messages: ContactInboxMessage[]

	@Column({ type: 'enum', enum: EContactInboxStatus, default: EContactInboxStatus.NEW })
	status: EContactInboxStatus

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
