import { Module } from '@nestjs/common'

import { TokenModule } from '../token/token.module'
import { UserModule } from '../user/user.module'

import { AuthAdminController } from './controllers/auth-admin.controller'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'

@Module({
	imports: [UserModule, TokenModule],
	controllers: [AuthController, AuthAdminController],
	providers: [AuthService]
})
export class AuthModule {}
