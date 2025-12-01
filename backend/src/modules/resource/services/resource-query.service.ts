import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, IsNull, Repository } from 'typeorm'

import { GetAllResourcesAdminDto } from '../dtos/GetAllResourcesAdmin.dto'
import { GetSimplifiedResourceDto } from '../dtos/GetSimplifiedResource.dto'
import { Resource } from '../entities/Resource.entity'
import { ResourceTag } from '../entities/ResourceTag.entity'

@Injectable()
export class ResourceQueryService {
	constructor(
		@InjectRepository(Resource)
		private readonly resourceRepository: Repository<Resource>,
		@InjectRepository(ResourceTag)
		private readonly resourceTagRepository: Repository<ResourceTag>
	) {}

	async getAllResourcesAdmin(query: GetAllResourcesAdminDto) {
		return await this.resourceRepository.findAndCount({
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

	async getSimplifiedResources(query: GetSimplifiedResourceDto) {
		const where: any = {
			featuredDeal: IsNull()
		}

		if (query?.search) {
			where.title = ILike(`%${query.search}%`)
		}

		return this.resourceRepository.find({
			where,
			relations: ['featuredDeal'],
			select: {
				id: true,
				title: true,
				slug: true,
				status: true,
				featuredDeal: { id: true }
			},
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { id: 'ASC' }
		})
	}

	async getAllResourceTags() {
		return await this.resourceTagRepository
			.createQueryBuilder('tag')
			.leftJoin('resource_tags_join', 'ltj', 'ltj."resourceTagsId" = tag.id')
			.leftJoin(Resource, 'resource', 'resource.id = ltj."resourcesId"')
			.select(['tag.id AS id', 'tag.name AS name'])
			.addSelect('COUNT(DISTINCT resource.id)', 'count')
			.groupBy('tag.id')
			.addGroupBy('tag.name')
			.orderBy('count', 'DESC')
			.getRawMany<{ id: number; name: string; count: string }>()
	}

	async getOneResource(resourceId: number) {
		const resource = await this.resourceRepository
			.createQueryBuilder('resource')
			.leftJoinAndSelect('resource.image', 'image')
			.leftJoinAndSelect('resource.ogImage', 'ogImage')
			.leftJoinAndSelect('resource.featuredDeal', 'featuredDeal')

			.leftJoinAndSelect('resource.tags', 'tag')

			.leftJoinAndSelect('resource.sections', 'section')
			.leftJoinAndSelect('section.attachments', 'sectionAttachment')

			.leftJoinAndSelect('resource.relatedManual', 'related')
			.leftJoinAndSelect('related.target', 'relatedTarget')

			.where('resource.id = :id', { id: resourceId })
			.orderBy('section.position', 'ASC')
			.getOne()

		if (!resource) {
			throw new NotFoundException('Resource not found.')
		}

		return resource
	}
}
