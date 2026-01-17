import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { EListingStatus } from '../../../interfaces/EListingStatus'
import { MailService } from '../../mail/mail.service'
import { Listing } from '../entities/Listing.entity'

@Injectable()
export class ListingCronService {
	private readonly logger = new Logger(ListingCronService.name)

	constructor(
		@InjectRepository(Listing)
		private readonly listingRepository: Repository<Listing>,
		private readonly mailService: MailService
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_6AM)
	async listingExpirationReminder() {
		this.logger.log('Listing expiration cron started')

		const expireResult = await this.listingRepository
			.createQueryBuilder()
			.update(Listing)
			.set({ isExpired: true, status: EListingStatus.INACTIVE })
			.where('status = :active', { active: EListingStatus.ACTIVE })
			.andWhere('"expires_at" IS NOT NULL')
			.andWhere('"expires_at" < now()')
			.execute()

		if (expireResult.affected) {
			this.logger.log(`Expired listings updated: ${expireResult.affected}`)
		}

		await this.sendReminderWindow(14)
		await this.sendReminderWindow(3)
		await this.sendReminderWindow(1)

		this.logger.log('Listing expiration cron finished')
	}

	private async sendReminderWindow(daysLeft: 14 | 3 | 1) {
		const listings = await this.listingRepository
			.createQueryBuilder('l')
			.leftJoin('l.owner', 'owner')
			.select(['l.id', 'l.title', 'l.expiresAt', 'owner.id', 'owner.privateEmail'])
			.where('l.status = :active', { active: EListingStatus.ACTIVE })
			.andWhere('l."expires_at" IS NOT NULL')
			.andWhere(
				`
					l."expires_at" >= (CURRENT_DATE + (:daysLeft * interval '1 day'))
					AND
					l."expires_at" <  (CURRENT_DATE + ((:daysLeft + 1) * interval '1 day'))
				`,
				{ daysLeft }
			)
			.getMany()

		if (!listings.length) return

		this.logger.log(`Sending ${daysLeft}-day reminders for ${listings.length} listing(s)`)

		await Promise.all(
			listings.map(async listing => {
				const email = listing.owner?.privateEmail
				if (!email) return

				try {
					await this.mailService.sendListingExpirationReminder(email, listing.title ?? '', daysLeft)
				} catch (e) {
					this.logger.error(
						`Failed to send ${daysLeft}-day reminder for listing ${listing.id}`,
						e instanceof Error ? e.stack : String(e)
					)
				}
			})
		)
	}
}
