import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('settings_email_templates')
export class EmailTemplate {
	@PrimaryGeneratedColumn()
	id: number

    @Column({type: "text"})
    key: string

    @Column({type: "text", name: "email_text", nullable: true})
    emailText: string | null

    @Column({type: "text", name: "default_email_text"})
    defaultEmailText: string

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
