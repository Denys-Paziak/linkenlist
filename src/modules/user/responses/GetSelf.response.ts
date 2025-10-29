import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class GetSelfResponse {
	@Expose({ name: 'id' })
	@ApiProperty({
		description: 'Unique user identifier',
		example: 1,
		type: Number
	})
	id: number

	@Expose({ name: 'fullName' })
	@ApiProperty({
		description: "User full name",
		example: 'Steve Johnson',
		type: String,
		nullable: true
	})
	fullName: string

	@Expose({ name: 'email' })
	@ApiProperty({
		description: "User email address",
		example: 'example@gmail.com',
		type: String,
		format: 'email'
	})
	email: string

	@Expose({ name: 'phone' })
	@ApiProperty({
		description: "User phone number",
		example: '+380501234567',
		type: String,
		nullable: true
	})
	phone: string | null

	@Expose({ name: 'lastActivity' })
	@ApiProperty({
		description: "Date of user last activity",
		example: '2023-10-01T12:00:00Z',
		type: Date
	})
	lastActivity: Date

	@Expose({ name: 'createdAt' })
	@ApiProperty({
		description: 'User creation date',
		example: '2023-01-01T12:00:00Z',
		type: Date
	})
	createdAt: Date

	@Expose({ name: 'updatedAt' })
	@ApiProperty({
		description: "User last update date",
		example: '2023-10-01T12:00:00Z',
		type: Date
	})
	updatedAt: Date
}
