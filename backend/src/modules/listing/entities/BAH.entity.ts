import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

import { EBahPaygrade } from '../../../interfaces/EBahPaygrade'

@Entity('bah_rates')
@Unique('uq_bah_rates_year_mha_paygrade_deps', ['year', 'mhaCode', 'paygrade', 'withDependents'])
@Index('idx_bah_rates_lookup', ['year', 'paygrade', 'mhaCode', 'withDependents'])
@Index('idx_bah_rates_mha_year', ['mhaCode', 'year'])
@Index('gin_bah_rates_location_name_trgm', { synchronize: false })
export class BahRate {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'smallint' })
	year: number

	@Column({ name: 'mha_code', type: 'text' })
	mhaCode: string

	@Column({ name: 'location_name', type: 'text' })
	locationName: string

	@Column({
		type: 'enum',
		enum: EBahPaygrade
	})
	paygrade: EBahPaygrade

	@Column({ name: 'with_dependents', type: 'boolean' })
	withDependents: boolean

	@Column({
		name: 'monthly_amount',
		type: 'decimal',
		precision: 10,
		scale: 2
	})
	monthlyAmount: string

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date
}
