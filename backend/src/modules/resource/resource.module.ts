import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ImageQueueModule } from '../image-queue/image-queue.module'
import { S3StorageModule } from '../s3-storage/s3-storage.module'
import { ScheduleQueueModule } from '../schedule-queue/schedule-queue.module'

import { ResourceAdminController } from './controllers/resource-admin.controller'
import { Resource } from './entities/Resource.entity'
import { ResourceImage } from './entities/ResourceImage.entity'
import { ResourceRelated } from './entities/ResourceRelated.entity'
import { ResourceSection } from './entities/ResourceSection.entity'
import { ResourceSectionAttachment } from './entities/ResourceSectionAttachment.entity'
import { ResourceTag } from './entities/ResourceTag.entity'
import { ResourceCommandService } from './services/resource-command.service'
import { ResourceQueryService } from './services/resource-query.service'
import { ResourceSystemService } from './services/resource-system.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Resource,
			ResourceSection,
			ResourceTag,
			ResourceImage,
			ResourceSectionAttachment,
			ResourceRelated
		]),
		S3StorageModule,
		ImageQueueModule,
		ScheduleQueueModule
	],
	controllers: [ResourceAdminController],
	providers: [ResourceCommandService, ResourceSystemService, ResourceQueryService],
	exports: [ResourceSystemService]
})
export class ResourceModule {}
