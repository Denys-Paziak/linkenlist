import { applyDecorators, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { ERoleName } from '../interfaces/ERoleName'

import { Roles } from './roles.decorator'

export function Authorization(role: ERoleName, ...roles: ERoleName[]) {
	return applyDecorators(Roles(role, ...roles), UseGuards(JwtAuthGuard, RolesGuard))
}
