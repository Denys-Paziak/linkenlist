import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ContactInbox } from './ContactInbox.entity'

@Entity('contact_inbox_messages')
export class ContactInboxMessage {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text', nullable: true })
	name: string | null

	@Column({ type: 'text' })
	message: string

    @Column({ type: 'boolean', name: 'email_sent', default: false })
    emailSent: boolean

	@ManyToOne(() => ContactInbox, contactInbox => contactInbox.messages, { onDelete: 'CASCADE' })
	contactInbox: ContactInbox

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
