import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { days } from '@nestjs/throttler'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { DataSource, Or, Repository, UpdateResult } from 'typeorm'

import { ParamId } from '../../../dtos/ParamId.dto'
import { EListingStatus } from '../../../interfaces/EListingStatus'
import { ETokenType } from '../../../interfaces/ETokenType'
import { IMultipartFile } from '../../../interfaces/IMultipartFile'
import { IUploadedImage } from '../../../interfaces/IUploadedFile'
import { ImageQueueService } from '../../image-queue/image-queue.service'
import { Listing } from '../../listing/entities/Listing.entity'
import { MailService } from '../../mail/mail.service'
import { S3StorageService } from '../../s3-storage/s3-storage.service'
import { Token } from '../../token/entities/Token.entity'
import { TokenService } from '../../token/token.service'
import { BanUserDto } from '../dtos/BanUser.dto'
import { ChangeEmailDto } from '../dtos/ChangeEmail.dto'
import { ChangePasswordDto } from '../dtos/ChangePassword.dto'
import { DeleteAccountDto } from '../dtos/DeleteAccount.dto'
import { ResetPasswordForUserDto } from '../dtos/ResetPasswordForUser.dto'
import { SavePublicProfileDto } from '../dtos/SavePublicProfile.dto'
import { User } from '../entities/User.entity'
import { UserAvatar } from '../entities/UserAvatar.entity'

@Injectable()
export class UserCommandService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly dataSource: DataSource,
		private readonly imageQueueService: ImageQueueService,
		private readonly s3StorageService: S3StorageService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly configService: ConfigService
	) {}

	private async saveImage(file: IMultipartFile, userId: number): Promise<IUploadedImage> {
		const { url, key } = await this.s3StorageService.uploadPublic(file.buffer, file.mimetype, false, {
			filename: file.filename,
			path: 'user/avatars/' + userId
		})
		return { key, url, width: file.width, height: file.height }
	}

	async savePublicProfile(userId: number, dto: SavePublicProfileDto, file?: IMultipartFile) {
		const exists = await this.userRepository.findOne({
			where: { id: userId }
		})
		if (!exists) throw new NotFoundException('User not found.')

		let newImage: IUploadedImage | undefined = undefined
		const oldKeys: string[] = []

		if (file) {
			newImage = await this.saveImage(file, exists.id)
			if (exists.avatar?.originalKey) oldKeys.push(exists.avatar.originalKey)
		}
		if (dto.avatar === null) {
			if (exists.avatar?.originalKey) oldKeys.push(exists.avatar.originalKey)
		}

		const updated = await this.dataSource.transaction(async manager => {
			if (newImage !== undefined && exists.avatar) {
				await manager.getRepository(UserAvatar).delete(exists.avatar.id)
			}
			if (dto.avatar === null && exists.avatar) {
				await manager.getRepository(UserAvatar).delete(exists.avatar.id)
			}

			return manager.getRepository(User).save({
				id: userId,
				firstName: dto.firstName === '' ? null : dto.firstName,
				lastName: dto.lastName === '' ? null : dto.lastName,
				company: dto.company === '' ? null : dto.company,
				professionalTitle: dto.professionalTitle === '' ? null : dto.professionalTitle,
				phone: dto.phone === '' ? null : dto.phone,
				publicEmail: dto.publicEmail === '' ? null : dto.publicEmail,
				avatar:
					dto.avatar === null
						? null
						: newImage !== undefined
							? {
									originalKey: newImage.key,
									height: newImage.height,
									width: newImage.width,
									url: newImage.url
								}
							: undefined
			})
		})

		for (const key of oldKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}

		if (newImage && updated.avatar) {
			await this.imageQueueService.enqueueUserAvatarProcess({
				entityId: updated.id,
				entityFileId: updated.avatar.id,
				srcKey: newImage.key
			})
		}
	}

	async switchFooterDisclaimer(userId: number) {
		await this.userRepository.update(userId, {
			footerDisclaimer() {
				return 'NOT footerDisclaimer'
			}
		})
	}

	async resetPasswordForUser(userId: number, dto: ResetPasswordForUserDto) {
		await this.dataSource.transaction(async manager => {
			const salt = await bcrypt.genSalt(10)
			const hashPassword = await bcrypt.hash(dto.temporaryPassword, salt)

			const upd = await manager.update(User, userId, { password: hashPassword })

			if (!upd.affected) {
				throw new NotFoundException('User not found.')
			}

			await manager.delete(Token, {
				user: { id: userId },
				type: ETokenType.REFRESH_TOKEN
			})
		})
	}

	async forceLogoutUser(userId: number) {
		await this.tokenService.deleteAllUserTokens(userId, ETokenType.REFRESH_TOKEN)
	}

	async banUser(userId: number, dto: BanUserDto) {
		await this.dataSource.transaction(async manager => {
			let upd: UpdateResult | undefined

			if (dto.duration) {
				upd = await manager.update(User, userId, {
					banReason: dto.reason,
					banExpirationDate: new Date(Date.now() + days(dto.duration))
				})
			}
			if (dto.permanent) {
				upd = await manager.update(User, userId, {
					banReason: dto.reason,
					banExpirationDate: new Date('9999-12-31T23:59:59.999Z')
				})
			}

			if (upd && !upd.affected) {
				throw new NotFoundException('User not found.')
			}

			await manager.delete(Token, {
				user: { id: userId }
			})

			await manager
				.createQueryBuilder()
				.update(Listing)
				.set({ status: EListingStatus.REJECTED })
				.where('ownerId = :userId', { userId })
				.andWhere('status IN (:...statuses)', {
					statuses: [EListingStatus.ACTIVE, EListingStatus.PENDING]
				})
				.execute()
		})
	}

	async unbanUser(userId: number) {
		await this.userRepository.update(userId, {
			banReason: null,
			banExpirationDate: null
		})
	}

	async grantFreeListingCredit(userId: number) {
		await this.userRepository.increment({ id: userId }, 'freeListingCredit', 1)
	}

	async revokeFreeListingCredit(userId: number) {
		await this.userRepository.decrement({ id: userId }, 'freeListingCredit', 1)
	}

	async changePassword(userId: number, dto: ChangePasswordDto) {
		const userFromDB = await this.userRepository.findOne({
			where: { id: userId }
		})

		if (userFromDB && userFromDB?.password) {
			if (!(await bcrypt.compare(dto.currentPassword, userFromDB.password))) {
				throw new BadRequestException('Incorrect password')
			}
		}

		const salt = await bcrypt.genSalt(10)

		const hashPassword = await bcrypt.hash(dto.newPassword, salt)

		await this.userRepository.update(userId, {
			password: hashPassword
		})
	}

	async changeEmail(userId: number, dto: ChangeEmailDto) {
		const userFromDB = await this.userRepository.findOne({
			where: { id: userId }
		})

		if (!userFromDB || (userFromDB.password && !(await bcrypt.compare(dto.currentPassword, userFromDB.password)))) {
			throw new BadRequestException('Incorrect password')
		}

		const emailConfirmedToken = await this.tokenService.generateChangeEmailConfirmedToken(userId, dto.newEmail)

		try {
			this.mailService.sendEmailVerified(
				dto.newEmail,
				emailConfirmedToken.token,
				this.configService.getOrThrow('CONFIRM_NEW_EMAIL_URL'),
				emailConfirmedToken.expiresIn
			)
		} catch {}
	}

	async confirmNewEmail(token: string) {
		const tokenFromDB = await this.tokenService.findToken({
			where: { tokenOrCode: token, type: ETokenType.CONFIRM_EMAIL },
			relations: {
				user: true
			}
		})

		if (!tokenFromDB) return 'No such token or code was found or it is expired.'

		if (!this.tokenService.validateToken(tokenFromDB)) {
			return 'No such token or code was found or it is expired.'
		}

		if (!tokenFromDB.payload.newEmail) return 'No such token or code was found or it is expired.'

		const result = await this.userRepository.update(tokenFromDB.user.id, {
			privateEmail: tokenFromDB.payload.newEmail
		})

		if (result.affected === 0) {
			return 'No such user found'
		}

		await this.tokenService.deleteAllUserTokens(tokenFromDB.user.id, tokenFromDB.type)
	}

	async deleteAccount(userId: number, dto: DeleteAccountDto) {
		const userFromDB = await this.userRepository.findOne({
			where: { id: userId }
		})
		if (!userFromDB || (userFromDB.password && !(await bcrypt.compare(dto.password, userFromDB.password)))) {
			throw new BadRequestException('Incorrect password')
		}

		const avatarKeys: string[] = []

		if (userFromDB.avatar?.originalKey) avatarKeys.push(userFromDB.avatar.originalKey)
		if (userFromDB.avatar?.processedKey) avatarKeys.push(userFromDB.avatar.processedKey)

		await this.userRepository.delete(userId)

		for (const key of avatarKeys) {
			try {
				await this.s3StorageService.delete(key)
			} catch {}
		}
	}
}
