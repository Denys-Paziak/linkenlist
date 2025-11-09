import { ApiProperty } from '@nestjs/swagger'

export class GetSelfResponse {
	@ApiProperty({
		description: 'Unique user identifier',
		example: 1,
		type: Number
	})
	id: number

	  @ApiProperty({
        description: "User full name",
        example: 'Steve Johnson',
        type: String,
        nullable: true
    })
    firstName: string

    @ApiProperty({
        description: "User full name",
        example: 'Steve Johnson',
        type: String,
        nullable: true
    })
    lastName: string

	@ApiProperty({
		description: "User email address",
		example: 'example@gmail.com',
		type: String,
		format: 'email'
	})
	email: string

	@ApiProperty({
		description: "User phone number",
		example: '+380501234567',
		type: String,
		nullable: true
	})
	phone?: string | null

	@ApiProperty({
		description: "Date of user last activity",
		example: '2023-10-01T12:00:00Z',
		type: Date
	})
	lastActivity: Date

	@ApiProperty({
		description: 'User creation date',
		example: '2023-01-01T12:00:00Z',
		type: Date
	})
	createdAt: Date

	@ApiProperty({
		description: "User last update date",
		example: '2023-10-01T12:00:00Z',
		type: Date
	})
	updatedAt: Date
}
