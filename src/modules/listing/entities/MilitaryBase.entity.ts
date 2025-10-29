import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

@Entity('military_bases')
@Unique(['name', 'state'])
export class MilitaryBase {
	@PrimaryGeneratedColumn()
	id: number

	@Index() @Column({ type: 'text' }) name: string
	@Index() @Column({ type: 'text' }) state: string
	@Index() @Column({ type: 'text' }) city: string

	@Index({ spatial: true })
	@Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
	location: any

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
