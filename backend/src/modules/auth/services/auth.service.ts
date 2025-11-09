import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { IsNull, Not } from 'typeorm'

import { ETokenTypes } from '../../../interfaces/ETokenTypes'
import { UserCommandService } from '../../../modules/user/services/user-command.service'
import { UserSystemService } from '../../../modules/user/services/user-system.service'
import { generateRandomSuffix } from '../../../utils/generate-random-suffix.util'
import { MailService } from '../../mail/mail.service'
import { TokenService } from '../../token/token.service'
import { ForgotPasswordDto } from '../dtos/ForgotPassword.dto'
import { LoginDto } from '../dtos/Login.dto'
import { RegistrationDto } from '../dtos/Registration.dto'
import { ResetPasswordDto } from '../dtos/ResetPassword.dto'
import { ERoleNames } from '../../../interfaces/ERoleNames'

@Injectable()
export class AuthService {
	constructor(
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly userSystemService: UserSystemService,
		private readonly userCommandService: UserCommandService,
		private readonly configService: ConfigService
	) {}

	async register(dto: RegistrationDto) {
		let userExist = await this.userSystemService.findOne({
			where: { privateEmail: dto.email }
		})

		if (userExist?.emailVerified) throw new ConflictException('This user already exists.')

		const salt = await bcrypt.genSalt(10)

		const hashPassword = await bcrypt.hash(dto.password, salt)

		const normalizeBaseusername = (dto.email as string | undefined)
			?.split('@')[0]
			.slice(0, 45)
			.replace(/[^a-zA-Z0-9]/g, '_')
			.toLowerCase()

		if (!normalizeBaseusername) {
			throw new InternalServerErrorException('Cannot generate a username from the provided Google account.')
		}

		let username: string = normalizeBaseusername

		const checkExists = async () => {
			if (await this.userSystemService.findOne({ where: { username } })) {
				username = normalizeBaseusername + '_' + generateRandomSuffix()
				checkExists()
			}
		}
		await checkExists()

		let user = userExist

		if (user) {
			user = await this.userSystemService.update(user.id, {
				firstName: dto.firstName,
				lastName: dto.lastName,
				username: username,
				password: hashPassword
			})
		} else {
			user = await this.userSystemService.save({
				firstName: dto.firstName,
				lastName: dto.lastName,
				privateEmail: dto.email,
				username: username,
				password: hashPassword
			})
		}

		const emailConfirmedToken = await this.tokenService.generateEmailConfirmedToken(user.id)

		this.mailService.sendEmailVerified(dto.email, emailConfirmedToken.token, emailConfirmedToken.expiresIn)
	}

	async resendConfirmationEmail(email: string) {
		const user = await this.userSystemService.findOne({
			where: { privateEmail: email }
		})

		if (!user) {
			throw new NotFoundException('This user does not exist.')
		}

		if (user.emailVerified) {
			throw new BadRequestException('This email is already verified.')
		}

		const emailConfirmedToken = await this.tokenService.generateEmailConfirmedToken(user.id)

		this.mailService.sendEmailVerified(email, emailConfirmedToken.token, emailConfirmedToken.expiresIn)
	}

	async confirmEmail(token: string) {
		const tokenFromDB = await this.tokenService.findToken({
			where: { tokenOrCode: token, type: ETokenTypes.CONFIRM_EMAIL },
			relations: {
				user: true
			}
		})

		if (!tokenFromDB) return 'No such token or code was found or it is expired.'

		if (!this.tokenService.validateToken(tokenFromDB)) {
			return 'No such token or code was found or it is expired.'
		}

		const result = await this.userCommandService.verifyEmail(tokenFromDB.user.id)

		if (result.affected === 0) {
			return 'No such user found'
		}

		await this.tokenService.deleteToken(tokenFromDB)
	}

	async googleLogin(googleToken: string) {
		const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
		const { payload } = await jwtVerify(googleToken, JWKS, {
			issuer: ['https://accounts.google.com', 'accounts.google.com'],
			audience: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID')
		})

		if (payload.exp && payload.exp * 1000 < Date.now()) throw new UnauthorizedException('ID token expired')
		if (payload.email_verified === false) throw new UnauthorizedException('Email not verified')

		let userExists = await this.userSystemService.findOne({
			where: { privateEmail: payload.email as string | undefined },
			select: { password: true, id: true, role: true }
		})

		if (userExists?.password) throw new BadRequestException('This user already exists.')

		let user = userExists

		if (!user) {
			const normalizeBaseusername = (payload.email as string | undefined)
				?.split('@')[0]
				.slice(0, 45)
				.replace(/[^a-zA-Z0-9]/g, '_')
				.toLowerCase()

			if (!normalizeBaseusername) {
				throw new InternalServerErrorException('Cannot generate a username from the provided Google account.')
			}

			let username: string = normalizeBaseusername

			const checkExists = async () => {
				if (await this.userSystemService.findOne({ where: { username } })) {
					username = normalizeBaseusername + '_' + generateRandomSuffix()
					checkExists()
				}
			}
			await checkExists()

			user = await this.userSystemService.save({
				privateEmail: payload.email as string | undefined,
				firstName: payload.given_name as string | undefined,
				lastName: payload.family_name as string | undefined,
				username: username,
				avatar: payload.picture as string | undefined,
				emailVerified: true
			})
		}

		const refreshToken = await this.tokenService.generateRefreshToken({
			id: user.id,
			role: user.role
		})
		const accessToken = await this.tokenService.generateAccessToken({
			id: user.id,
			role: user.role
		})

		return {
			accessToken,
			refreshToken
		}
	}

	async login(dto: LoginDto, role: ERoleNames) {
		const userFromDB = await this.userSystemService.findOne({
			where: {
				privateEmail: dto.email,
				emailVerified: true,
				role
			},
			select: {
				id: true,
				role: true,
				password: true
			}
		})

		if (!userFromDB || (userFromDB.password && !(await bcrypt.compare(dto.password, userFromDB.password)))) {
			throw new UnauthorizedException('Incorrect login or password')
		}

		const refreshToken = await this.tokenService.generateRefreshToken({
			id: userFromDB.id,
			role: userFromDB.role
		})
		const accessToken = await this.tokenService.generateAccessToken({
			id: userFromDB.id,
			role: userFromDB.role
		})

		return {
			accessToken,
			refreshToken
		}
	}

	async refreshToken(refresh_token: string | undefined) {
		if (!refresh_token) {
			throw new UnauthorizedException('The user is not authorized')
		}

		const userFromToken = await this.tokenService.validateRefreshToken(refresh_token)
		const userFromDB = await this.userSystemService.findOne({
			where: {
				id: userFromToken.id
			}
		})
		if (!userFromDB) throw new NotFoundException('This user does not exist.')

		const refreshToken = await this.tokenService.generateRefreshToken(
			{
				id: userFromDB.id,
				role: userFromDB.role
			},
			refresh_token
		)
		const accessToken = await this.tokenService.generateAccessToken({
			id: userFromDB.id,
			role: userFromDB.role
		})

		return {
			accessToken,
			refreshToken
		}
	}

	async forgotPassword(dto: ForgotPasswordDto) {
		const userFromDB = await this.userSystemService.findOne({
			where: { privateEmail: dto.email, password: Not(IsNull()) }
		})

		if (userFromDB) {
			const { token, expiresIn } = await this.tokenService.generateForgotPasswordToken(userFromDB.id)

			this.mailService.sendEmailForgotPassword(dto.email, token, expiresIn)
		}
	}

	async resetPassword(dto: ResetPasswordDto) {
		const tokenFromDB = await this.tokenService.findToken({
			where: { tokenOrCode: dto.token, type: ETokenTypes.RESET_PASSWORD },
			relations: {
				user: true
			}
		})

		if (!tokenFromDB) throw new BadRequestException('No such token or code was found or it is expired.')

		if (!this.tokenService.validateToken(tokenFromDB)) {
			throw new BadRequestException('No such token or code was found or it is expired.')
		}

		const { user } = tokenFromDB

		const salt = await bcrypt.genSalt(10)

		const hashPassword = await bcrypt.hash(dto.password, salt)

		await this.tokenService.deleteToken(tokenFromDB)

		const resultUpdatePassword = await this.userCommandService.updatePassword(
			{ id: user.id, password: Not(IsNull()) },
			hashPassword
		)

		if (!tokenFromDB.user.emailVerified) {
			const resultVerifyEmail = await this.userCommandService.verifyEmail(tokenFromDB.user.id)

			if (resultVerifyEmail.affected === 0) {
				throw new InternalServerErrorException('No such user found')
			}
		}

		if (resultUpdatePassword.affected === 0) {
			throw new InternalServerErrorException('No such user found')
		}
	}
}
