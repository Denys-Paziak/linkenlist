import { Module } from '@nestjs/common'

import { TokenModule } from '../token/token.module'
import { UserModule } from '../user/user.module'

import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'

@Module({
	imports: [UserModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
