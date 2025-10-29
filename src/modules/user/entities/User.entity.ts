import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ERoleNames } from '@/interfaces/ERoleNames'
import { EUserStatus } from '@/interfaces/EUserStatus'

import { Token } from '../../../modules/token/entities/Token.entity'
import { AuditLog } from '@/modules/audit/entities/AuditLog.entity'
import { Listing } from '@/modules/listing/entities/Listing.entity'

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'first_name', type: 'varchar', length: 150 })
	firstName: string

	@Column({ name: 'last_name', type: 'varchar', length: 150 })
	lastName: string

	@Column({ name: 'username', type: 'varchar', length: 255, unique: true })
	username: string

	@Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
	avatar?: string | null

	@Column({ name: 'professional_title', type: 'varchar', length: 255, nullable: true })
	professionalTitle?: string | null

	@Column({ name: 'company', type: 'varchar', length: 255, nullable: true })
	company?: string | null

	@Column({ name: 'private_email', type: 'varchar', length: 255, unique: true })
	privateEmail: string

	@Column({ name: 'public_email', type: 'varchar', length: 255, unique: true, nullable: true })
	publicEmail?: string | null

	@Column({ name: 'phone', type: 'varchar', length: 20, unique: true, nullable: true })
	phone?: string | null

	@Column({ type: 'varchar', length: 255, select: false, nullable: true })
	password?: string | null

	@Column({ name: 'footer_disclaimer', type: 'boolean', default: true })
	footerDisclaimer: boolean

	@Column({ name: 'email_verified', type: 'boolean', default: false })
	emailVerified: boolean

	@Column({ name: 'last_login_ip', type: 'inet', nullable: true })
	lastLoginIp?: string | null

	@Column({ name: 'last_activity', type: 'timestamptz', default: 'NOW()' })
	lastActivity: Date

	@Column({ type: 'enum', enum: EUserStatus, default: EUserStatus.ACTIVE })
	status: EUserStatus

	@Column({ name: 'free_listing_credit', type: 'int', default: 1 })
	freeListingCredit: number

	@Column({ type: 'enum', enum: ERoleNames, default: ERoleNames.USER })
	role: ERoleNames

	@Column({ name: 'ban_expiration_date', type: 'timestamptz', nullable: true })
	banExpirationDate: Date | null

	@Column({ name: 'ban_reason', type: 'text', nullable: true })
	banReason: string | null

	// Relations
	@OneToMany(() => Listing, l => l.owner) 
	listings: Listing[];

	@OneToMany(() => Token, token => token.user)
	tokens: Token[]

	@OneToMany(() => AuditLog, a => a.user)
	auditLogs: AuditLog[]

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
