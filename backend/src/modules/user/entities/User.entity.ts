import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { ERoleName } from '../../../interfaces/ERoleName'
import { EUserStatus } from '../../../interfaces/EUserStatus'
import { Listing } from '../../listing/entities/Listing.entity'
import { DailyMetric } from '../../metrics/entities/Metrics.entity'
import { Token } from '../../token/entities/Token.entity'

import { UserAvatar } from './UserAvatar.entity'

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'first_name', type: 'varchar', length: 150, nullable: true })
	firstName?: string | null

	@Column({ name: 'last_name', type: 'varchar', length: 150, nullable: true })
	lastName?: string | null

	@Column({ name: 'username', type: 'varchar', length: 255, unique: true })
	username: string

	@OneToOne(() => UserAvatar, { cascade: true, nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'avatar_id' })
	avatar?: UserAvatar | null

	@Column({ name: 'professional_title', type: 'varchar', length: 255, nullable: true })
	professionalTitle?: string | null

	@Column({ name: 'company', type: 'varchar', length: 255, nullable: true })
	company?: string | null

	@Column({ name: 'private_email', type: 'varchar', length: 255, unique: true })
	privateEmail: string

	@Column({ name: 'public_email', type: 'varchar', length: 255, nullable: true })
	publicEmail?: string | null

	@Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
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

	@Column({ name: 'is_private', type: 'boolean', default: false })
	isPrivate: boolean

	@Column({ type: 'enum', enum: EUserStatus, default: EUserStatus.ACTIVE })
	status: EUserStatus

	@Column({ name: 'free_listing_credit', type: 'int', default: 1 })
	freeListingCredit: number

	@Column({ type: 'enum', enum: ERoleName, default: ERoleName.USER })
	role: ERoleName

	@Column({ name: 'ban_expiration_date', type: 'timestamptz', nullable: true })
	banExpirationDate: Date | null

	@Column({ name: 'ban_reason', type: 'text', nullable: true })
	banReason: string | null

	@OneToMany(() => Listing, l => l.owner)
	listings: Listing[]

	@OneToMany(() => Token, token => token.user)
	tokens: Token[]

	@OneToMany(() => DailyMetric, a => a.user)
	dailyMetric: DailyMetric[]

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
