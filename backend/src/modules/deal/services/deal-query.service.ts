import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, IsNull, Repository } from 'typeorm'

import { GetSimplifiedResourceDto } from '../../resource/dtos/GetSimplifiedResource.dto'
import { GetAllDealsAdminDto } from '../dtos/GetAllDealsAdmin.dto'
import { Deal } from '../entities/Deal.entity'
import { DealTag } from '../entities/DealTag.entity'

@Injectable()
export class DealQueryService {
	constructor(
		@InjectRepository(Deal)
		private readonly dealRepository: Repository<Deal>,
		@InjectRepository(DealTag)
		private readonly dealTagRepository: Repository<DealTag>
	) {}

	async getAllDealsAdmin(query: GetAllDealsAdminDto) {
		return await this.dealRepository.findAndCount({
			select: {
				id: true,
				title: true,
				image: {
					id: true,
					url: true,
					width: true,
					height: true
				},
				categories: true,
				status: true,
				updatedAt: true,
				createdAt: true
			},
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { createdAt: 'DESC' },
			relations: ['image']
		})
	}

	async getSimplifiedDeals(query: GetSimplifiedResourceDto) {
		const where: any = {
			featuredResource: IsNull() 
		}

		if (query?.search) {
			where.title = ILike(`%${query.search}%`)
		}

		return this.dealRepository.find({
			where,
			relations: ['featuredResource'],
			select: {
				id: true,
				title: true,
				slug: true,
				status: true,
				featuredResource: { id: true }
			},
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { id: 'ASC' }
		})
	}

	async getAllDealTags() {
		return await this.dealTagRepository
			.createQueryBuilder('tag')
			.leftJoin('deal_tags_join', 'ltj', 'ltj."dealTagsId" = tag.id')
			.leftJoin(Deal, 'deal', 'deal.id = ltj."dealsId"')
			.select(['tag.id AS id', 'tag.name AS name'])
			.addSelect('COUNT(DISTINCT deal.id)', 'count')
			.groupBy('tag.id')
			.addGroupBy('tag.name')
			.orderBy('count', 'DESC')
			.getRawMany<{ id: number; name: string; count: string }>()
	}

	async getOneDeal(dealId: number) {
		const deal = await this.dealRepository
			.createQueryBuilder('deal')
			.leftJoinAndSelect('deal.image', 'image')
			.leftJoinAndSelect('deal.ogImage', 'ogImage')
			.leftJoinAndSelect('deal.featuredResource', 'featuredResource')

			.leftJoinAndSelect('deal.tags', 'tag')

			.leftJoinAndSelect('deal.sections', 'section')
			.leftJoinAndSelect('section.attachments', 'sectionAttachment')

			.leftJoinAndSelect('deal.relatedManual', 'related')
			.leftJoinAndSelect('related.target', 'relatedTarget')

			.where('deal.id = :id', { id: dealId })
			.orderBy('section.position', 'ASC')
			.getOne()

		if (!deal) {
			throw new NotFoundException('Deal not found.')
		}

		return deal
	}
}
