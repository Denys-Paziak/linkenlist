import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

@Entity('bah_zip_mappings')
@Unique('uq_bah_zip_mappings_zip_mha', ['zip', 'mhaCode'])
@Index('idx_bah_zip_mappings_zip', ['zip'])
@Index('idx_bah_zip_mappings_mha', ['mhaCode'])
@Index('gin_bah_zip_mappings_city_trgm', { synchronize: false })
@Index('gin_bah_zip_mappings_mha_name_trgm', { synchronize: false })
export class BahZipMapping {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text' })
	zip: string

	@Column({ name: 'mha_code', type: 'text' })
	mhaCode: string

	@Column({ name: 'mha_name', type: 'text' })
	mhaName: string

	@Column({ type: 'text' })
	state: string

	@Column({ type: 'text' })
	city: string

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date
}
