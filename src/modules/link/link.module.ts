import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { S3StorageModule } from '../s3-storage/s3-storage.module'

import { LinkController } from './controllers/link.controller'
import { Link } from './entities/Link.entity'
import { LinkImage } from './entities/LinkImage.entity'
import { LinkCommandService } from './services/link-command.service'

@Module({
	imports: [TypeOrmModule.forFeature([Link, LinkImage]), S3StorageModule],
	controllers: [LinkController],
	providers: [LinkCommandService]
})
export class LinkModule {}
