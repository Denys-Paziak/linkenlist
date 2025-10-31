import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'


import { Link } from '../entities/Link.entity'
import { ELinkStatus } from '../../../interfaces/ELinkStatus'

const CONCURRENCY = 10
const MAX_RETRIES = 3
const TIMEOUT_MS = 10_000

@Injectable()
export class LinkCronService {
	private readonly logger = new Logger(LinkCronService.name)

	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>
	) {}

	@Cron(CronExpression.EVERY_WEEK)
	async verificationLinks() {
		this.logger.log('Starting weekly links verification (only PUBLISHED)...')

		// Беремо лише опубліковані лінки і мінімум полів
		const links = await this.linkRepository.find({
			select: { id: true, url: true },
			where: { status: ELinkStatus.PUBLISHED }
		})
		if (!links.length) {
			this.logger.log('No published links to verify.')
			return
		}

		const okIds: number[] = []
		const badIds: number[] = []

		for (let i = 0; i < links.length; i += CONCURRENCY) {
			const batch = links.slice(i, i + CONCURRENCY)
			await Promise.all(
				batch.map(async l => {
					try {
						const ok = await this.checkUrlWithRetries(l.url)
						if (ok) okIds.push(l.id)
						else badIds.push(l.id)
					} catch (e) {
						this.logger.warn(`Verify error for ${l.url}: ${String(e)}`)
						badIds.push(l.id)
					}
				})
			)
			this.logger.log(`Progress: ${Math.min(i + CONCURRENCY, links.length)}/${links.length}`)
		}

		const allIds = [...okIds, ...badIds]
		if (!allIds.length) {
			this.logger.log('Nothing to update.')
			return
		}

		const okList = okIds.length ? okIds.join(',') : 'NULL'
		const badList = badIds.length ? badIds.join(',') : 'NULL'

		await this.linkRepository
			.createQueryBuilder()
			.update(Link)
			.set({
				verified: () =>
					`CASE 
             WHEN id IN (${okList}) THEN TRUE
             WHEN id IN (${badList}) THEN FALSE
             ELSE verified
           END`,
				verifiedAt: () => 'NOW()',
				verifiedBy: () => `'system'`
			})
			.whereInIds(allIds)
			.execute()

		this.logger.log(
			`Weekly verification finished. OK: ${okIds.length}, BAD: ${badIds.length}, Total updated: ${allIds.length}`
		)
	}

	private async checkUrlWithRetries(url: string): Promise<boolean> {
		for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
			const ok = await this.tryProbe(url)
			if (ok) return true
			await new Promise(r => setTimeout(r, attempt * 300))
		}
		return false
	}

	private async tryProbe(url: string): Promise<boolean> {
		let res = await this.fetchWithTimeout(url, 'HEAD')
		if (res === 'fallback') {
			res = await this.fetchWithTimeout(url, 'GET')
		}
		return res === true
	}

	private async fetchWithTimeout(url: string, method: 'HEAD' | 'GET'): Promise<boolean | 'fallback'> {
		const controller = new AbortController()
		const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
		try {
			const resp = await fetch(url, { method, redirect: 'follow', signal: controller.signal })
			if (method === 'HEAD' && (resp.status === 405 || resp.status === 501)) {
				return 'fallback'
			}
			return resp.status >= 200 && resp.status < 400
		} catch {
			return false
		} finally {
			clearTimeout(timer)
		}
	}
}
