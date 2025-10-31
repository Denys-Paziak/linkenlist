import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { User } from '../../user/entities/User.entity'

export enum AuditEntity {
	LINK = 'link',
	DEAL = 'deal',
	RESOURCE = 'resource',
	LISTING = 'listing',
	USER = 'user',
	SETTINGS = 'settings',
	COMMENT = 'comment'
}
export enum AuditAction {
	CREATE = 'create',
	UPDATE = 'update',
	DELETE = 'delete',
	VERIFY = 'verify',
	PUBLISH = 'publish',
	MODERATE = 'moderate'
}

@Entity('audit_logs')
export class AuditLog {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, u => u.auditLogs)
	user: User

	@Column({ type: 'enum', enum: AuditAction })
	action: AuditAction

	@Index()
	@Column({ type: 'enum', enum: AuditEntity })
	entity: AuditEntity

	@Index()
	@Column({ type: 'int', nullable: true })
	entityId?: number | null

	@Column({ type: 'text' })
	description: string

	@Column({ type: 'inet' })
	ip: string

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Index()
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
