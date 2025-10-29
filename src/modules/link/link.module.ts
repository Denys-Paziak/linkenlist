import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LinkController } from './controllers/link.controller'
import { Link } from './entities/Link.entity'
import { LinkService } from './services/link.service'

@Module({
	imports: [TypeOrmModule.forFeature([Link])],
	controllers: [LinkController],
	providers: [LinkService]
})
export class LinkModule {}
