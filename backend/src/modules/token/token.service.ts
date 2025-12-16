import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID as uuid } from 'node:crypto'
import { FindOneOptions, Repository } from 'typeorm'

import { ETokenType } from '../../interfaces/ETokenType'
import { ITokenUser } from '../../interfaces/ITokenUser'

import { Token } from './entities/Token.entity'

@Injectable()
export class TokenService {
	constructor(
		@InjectRepository(Token)
		private readonly tokenRepository: Repository<Token>,

		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	async findToken(options: FindOneOptions<Token>) {
		return await this.tokenRepository.findOne(options)
	}

	validateToken(token: Token) {
		return new Date(token.expiresIn).getTime() > new Date().getTime()
	}

	async deleteOneToken(tokenId: number) {
		await this.tokenRepository.delete({ id: tokenId })
	}

	async deleteAllUserTokens(userId: number, tokenType: ETokenType) {
		await this.tokenRepository.delete({ type: tokenType, user: { id: userId } })
	}

	async generateRefreshToken(payload: ITokenUser, deleteToken?: string, expiresIn?: string) {
		const token = await this.jwtService.signAsync(payload, {
			secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET_KEY'),
			expiresIn: expiresIn || '30d'
		})

		if (deleteToken) {
			await this.tokenRepository.delete({ tokenOrCode: deleteToken })
		}

		await this.tokenRepository
			.createQueryBuilder()
			.insert()
			.into(Token)
			.values({
				tokenOrCode: token,
				type: ETokenType.REFRESH_TOKEN,
				user: { id: payload.id },
				expiresIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
			})
			.onConflict(`("tokenOrCode","user_id") DO NOTHING`)
			.execute()

		return token
	}

	generateAccessToken(payload: ITokenUser) {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET_KEY'),
			expiresIn: '5m'
		})
	}

	async validateRefreshToken(refresh_token: string) {
		try {
			const payload = await this.jwtService.verifyAsync(refresh_token, {
				secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET_KEY')
			})

			return payload as ITokenUser
		} catch {
			throw new UnauthorizedException('The user is not authorized')
		}
	}

	async generateForgotPasswordToken(userId: number) {
		const token = uuid()
		const expiresIn = new Date(new Date().getTime() + 5 * 60 * 1000)

		await this.tokenRepository.delete({ type: ETokenType.RESET_PASSWORD, user: { id: userId } })

		await this.tokenRepository.save({
			tokenOrCode: token,
			type: ETokenType.RESET_PASSWORD,
			user: { id: userId },
			expiresIn
		})

		return { token, expiresIn: 5 }
	}

	async generateEmailConfirmedToken(userId: number) {
		const token = uuid()
		const expiresIn = new Date(new Date().getTime() + 5 * 60 * 1000)

		await this.tokenRepository.delete({ type: ETokenType.CONFIRM_EMAIL, user: { id: userId } })

		await this.tokenRepository.save({
			tokenOrCode: token,
			type: ETokenType.CONFIRM_EMAIL,
			user: { id: userId },
			expiresIn
		})

		return { token, expiresIn: '5 min.' }
	}

	async generateChangeEmailConfirmedToken(userId: number, newEmail: string) {
		const token = uuid()
		const expiresIn = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

		await this.tokenRepository.delete({ type: ETokenType.CONFIRM_EMAIL, user: { id: userId } })

		await this.tokenRepository.save({
			tokenOrCode: token,
			type: ETokenType.CONFIRM_EMAIL,
			user: { id: userId },
			expiresIn,
			payload: { newEmail }
		})

		return { token, expiresIn: '24 hours.' }
	}
}
