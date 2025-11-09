import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminUserController } from './controllers/user-admin.controller'
import { UserController } from './controllers/user.controller'
import { User } from './entities/User.entity'
import { UserCommandService } from './services/user-command.service'
import { UserQueryService } from './services/user-query.service'
import { UserSystemService } from './services/user-system.service'

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserController, AdminUserController],
	providers: [UserCommandService, UserQueryService, UserSystemService],
	exports: [UserCommandService, UserQueryService, UserSystemService]
})
export class UserModule {}
