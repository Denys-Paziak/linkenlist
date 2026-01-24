import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { EContactInboxType } from '../../../interfaces/EContactInboxType'
import { MailService } from '../../mail/mail.service'
import { NotificationSystemService } from '../../notification/services/notification-system.service'
import { UserSystemService } from '../../user/services/user-system.service'
import { ChangeStatusDto } from '../dtos/ChangeStatus.dto'
import { ContactUsDto } from '../dtos/ContactUs.dto'
import { ListingReportDto } from '../dtos/ListingReport.dto'
import { PostReplyDto } from '../dtos/PostReply.dto'
import { ContactInbox } from '../entities/ContactInbox.entity'
import { ContactInboxMessage } from '../entities/ContactInboxMessage.entity'

@Injectable()
export class ContactInboxCommandService {
	constructor(
		@InjectRepository(ContactInbox)
		private readonly contactInboxRepository: Repository<ContactInbox>,
		@InjectRepository(ContactInboxMessage)
		private readonly contactInboxMessageRepository: Repository<ContactInboxMessage>,
		private readonly mailService: MailService,
		private readonly userSystemService: UserSystemService,
		@Inject(CACHE_MANAGER)
		private readonly cache: Cache,
		private readonly notificationSystemService: NotificationSystemService
	) {}

	async postContactUs(dto: ContactUsDto, userId?: number) {
		await this.contactInboxRepository.save({
			type: dto.type,
			name: dto.name,
			email: dto.email,
			subject: dto.subject,
			firstMessage: dto.message,
			user: userId ? { id: userId } : null,
			messages: [
				{
					message: dto.message,
					name: dto.name
				}
			]
		})
	}

	async postListingReport(dto: ListingReportDto, cacheKey: string, userId?: number) {
		const key = `listing:report:${dto.listingId}:${cacheKey}`

		const already = await this.cache.get<string>(key)
		if (already) {
			throw new HttpException('You can report an listing only once every 10 minutes.', HttpStatus.TOO_MANY_REQUESTS)
		}

		await this.cache.set(key, '1', 10 * 60 * 60 * 1000)

		const user = userId ? await this.userSystemService.findOne({ where: { id: userId } }) : null

		await this.contactInboxRepository.save({
			type: EContactInboxType.REPORT,
			name: user ? user?.firstName + ' ' + user?.lastName : 'Not registered',
			email: user ? user.privateEmail : 'Not registered',
			subject: 'Report: ' + dto.reason + ' - ' + dto.listingAddress,
			firstMessage: dto.message,
			user: userId ? { id: userId } : null,
			reportReason: dto.reason,
			reportListing: { id: dto.listingId },
			messages: [
				{
					message: dto.message,
					name: user ? user?.firstName + ' ' + user?.lastName : 'Not registered'
				}
			]
		})
	}

	async postReply(adminId: number, contactInboxId: number, dto: PostReplyDto) {
		const contactInbox = await this.contactInboxRepository.findOne({ where: { id: contactInboxId }, relations: ['user'] })
		if (!contactInbox) {
			throw new NotFoundException('Contact inbox not found')
		}

		await this.contactInboxMessageRepository.save({
			contactInbox: { id: contactInboxId },
			message: dto.message,
			name: 'LinkEnlist Admin'
		})

		if (contactInbox.user) {
			await this.notificationSystemService.createNotifications([
				{
					title: 'Admin reply: ' + contactInbox.subject,
					message: dto.message,
					senderId: adminId,
					recipientId: contactInbox.user.id
				}
			])
		}

		if ((dto.sendEmail || !contactInbox.user) && contactInbox.email && contactInbox.name) {
			try {
				this.mailService.sendReplyContactInboxEmail(
					contactInbox.email,
					contactInbox.name,
					contactInbox.subject,
					dto.message
				)
			} catch {}
		}
	}

	async changeStatus(contactInboxId: number, dto: ChangeStatusDto) {
		await this.contactInboxRepository.update(
			{ id: contactInboxId },
			{
				status: dto.status
			}
		)
	}
}
