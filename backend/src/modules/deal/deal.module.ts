import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ImageQueueModule } from '../image-queue/image-queue.module'
import { S3StorageModule } from '../s3-storage/s3-storage.module'

import { DealAdminController } from './controllers/deal-admin.controller'
import { Deal } from './entities/Deal.entity'
import { DealImage } from './entities/DealImage.entity'
import { DealRelated } from './entities/DealRelated.entity'
import { DealSection } from './entities/DealSection.entity'
import { DealTag } from './entities/DealTag.entity'
import { DealCommandService } from './services/deal-command.service'

@Module({
	imports: [TypeOrmModule.forFeature([Deal, DealRelated, DealSection, DealTag, DealImage]), S3StorageModule, ImageQueueModule],
	controllers: [DealAdminController],
	providers: [DealCommandService]
})
export class DealModule {}
