import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { EFileStatus } from '../../../interfaces/EFileStatus'
import { Link } from '../entities/Link.entity'
import { LinkImage } from '../entities/LinkImage.entity'

@Injectable()
export class LinkSystemService {
	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkImage)
		private readonly linkImageRepository: Repository<LinkImage>,
		@Inject(CACHE_MANAGER)
		private readonly cache: Cache
	) {}

	async markViewedOnce(params: { dealId: number; viewerKey: string; ttlMs: number }): Promise<boolean> {
		const { dealId, viewerKey, ttlMs } = params
		const key = `link:view:${dealId}:${viewerKey}`

		const already = await this.cache.get<string>(key)
		if (already) return false

		await this.cache.set(key, '1', ttlMs)

		return true
	}

	async updateLink(id: number, data: DeepPartial<Link>) {
		return await this.linkRepository.save({ id, ...data })
	}

	async isImageStatus(id: number, status: EFileStatus) {
		return await this.linkImageRepository.exists({ where: { id, status } })
	}

	async updateImageStatus(id: number, status: EFileStatus) {
		await this.linkImageRepository.update(id, { status })
	}
}
