import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

import { Deal } from '../../deal/entities/Deal.entity'
import { Link } from '../../link/entities/Link.entity'
import { Listing } from '../../listing/entities/Listing.entity'
import { Resource } from '../../resource/entities/Resource.entity'
import { User } from '../../user/entities/User.entity'

@Entity('user_favorite_deals')
@Unique(['user', 'deal'])
export class UserFavoriteDeal {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, { onDelete: 'CASCADE' }) user: User
	@ManyToOne(() => Deal, { onDelete: 'CASCADE' }) deal: Deal

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}

@Entity('user_favorite_resources')
@Unique(['user', 'resource'])
export class UserFavoriteResource {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, { onDelete: 'CASCADE' }) user: User
	@ManyToOne(() => Resource, { onDelete: 'CASCADE' }) resource: Resource

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}

@Entity('user_favorite_listings')
@Unique(['user', 'listing'])
export class UserFavoriteListing {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, { onDelete: 'CASCADE' }) user: User
	@ManyToOne(() => Listing, { onDelete: 'CASCADE' }) listing: Listing

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}

@Entity('user_favorite_links')
@Unique(['user', 'link'])
export class UserFavoriteLink {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, { onDelete: 'CASCADE' }) user: User
	@ManyToOne(() => Link, { onDelete: 'CASCADE' }) link: Link

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
