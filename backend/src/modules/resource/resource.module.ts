import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ResourceController } from './controllers/resource.controller'
import { Resource } from './entities/Resource.entity'
import { ResourceSection } from './entities/ResourceSection.entity'
import { ResourceTag } from './entities/ResourceTag.entity'
import { ResourceService } from './services/resource.service'

@Module({
	imports: [TypeOrmModule.forFeature([Resource, ResourceSection, ResourceTag])],
	controllers: [ResourceController],
	providers: [ResourceService]
})
export class ResourceModule {}
