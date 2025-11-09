import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ImageQueueModule } from '../image-queue/image-queue.module'
import { S3StorageModule } from '../s3-storage/s3-storage.module'

import { LinkAdminController } from './controllers/link-admin.controller'
import { Link } from './entities/Link.entity'
import { LinkImage } from './entities/LinkImage.entity'
import { LinkTag } from './entities/LinkTag.entity'
import { LinkCommandService } from './services/link-command.service'
import { LinkCronService } from './services/link-cron.service'
import { LinkQueryService } from './services/link-query.service'
import { LinkSystemService } from './services/link-system.service'

@Module({
	imports: [TypeOrmModule.forFeature([Link, LinkImage, LinkTag]), S3StorageModule, ImageQueueModule],
	controllers: [LinkAdminController],
	providers: [LinkCommandService, LinkQueryService, LinkCronService, LinkSystemService],
	exports: [LinkSystemService]
})
export class LinkModule {}
