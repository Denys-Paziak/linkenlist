import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, DataSource, Repository } from 'typeorm'

import { MailService } from '../../mail/mail.service'
import { ContactInbox } from '../entities/ContactInbox.entity'
import { ContactInboxMessage } from '../entities/ContactInboxMessage.entity'
import { GetAllContactInboxesAdminDto } from '../dtos/GetAllContactInboxesAdmin.dto'

@Injectable()
export class ContactInboxQueryService {
	constructor(
		@InjectRepository(ContactInbox)
		private readonly contactInboxRepository: Repository<ContactInbox>,
		@InjectRepository(ContactInboxMessage)
		private readonly contactInboxMessageRepository: Repository<ContactInboxMessage>,
		private readonly dataSource: DataSource,
		private readonly mailService: MailService
	) {}

	async getAllContactInboxesAdmin(query: GetAllContactInboxesAdminDto) {
		const page = Math.max(1, Number(query.page ?? 1))
		const limit = Math.max(1, Number(query.limit ?? 20))
		const offset = (page - 1) * limit

		const qb = this.contactInboxRepository
			.createQueryBuilder('inbox')
			.leftJoinAndSelect('inbox.messages', 'messages')
			.leftJoin('inbox.reportListing', 'rl')
			.addSelect(['rl.id', 'rl.slug', 'rl.street', 'rl.unit', 'rl.zip', 'rl.state', 'rl.city'])

		if (query.status) {
			qb.andWhere('inbox.status = :status', { status: query.status })
		}

		if (query.search?.trim()) {
			const search = `%${query.search.trim()}%`
			qb.andWhere(
				new Brackets(sqb => {
					sqb.where('inbox.email ILIKE :search', { search })
						.orWhere('inbox.name ILIKE :search', { search })
						.orWhere('inbox.subject ILIKE :search', { search })
				})
			)
		}

		qb.orderBy('inbox.createdAt', 'DESC').skip(offset).take(limit)

		const [items, total] = await qb.getManyAndCount()
		return [items, total]
	}
}
