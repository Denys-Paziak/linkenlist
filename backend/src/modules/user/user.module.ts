import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ImageQueueModule } from '../image-queue/image-queue.module'
import { S3StorageModule } from '../s3-storage/s3-storage.module'

import { AdminUserController } from './controllers/user-admin.controller'
import { UserController } from './controllers/user.controller'
import { User } from './entities/User.entity'
import { UserAvatar } from './entities/UserAvatar.entity'
import { UserCommandService } from './services/user-command.service'
import { UserQueryService } from './services/user-query.service'
import { UserSystemService } from './services/user-system.service'

@Module({
	imports: [TypeOrmModule.forFeature([User, UserAvatar]), S3StorageModule, ImageQueueModule],
	controllers: [UserController, AdminUserController],
	providers: [UserCommandService, UserQueryService, UserSystemService],
	exports: [UserCommandService, UserQueryService, UserSystemService]
})
export class UserModule {}
