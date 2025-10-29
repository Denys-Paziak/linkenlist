import { Controller} from '@nestjs/common'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { UserQueryService } from '../services/user-query.service'

@ApiCookieAuth()
@ApiTags('Users Admin')
@Controller('admin/users')
export class AdminUserController {
	constructor(private readonly userQueryService: UserQueryService) {}

    async getAllUsers() {
    
    }

    async getOneUser() {
        
    }

    async resetPasswordForUser() {

    }

    async forceLogoutUser() {

    }

    async banUser() {
    
    }

    async grantFreeListingCredit() {
    
    }
    
    async revokeFreeListingCredit() {

    }
}
