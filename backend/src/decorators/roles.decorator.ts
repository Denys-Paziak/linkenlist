import { SetMetadata } from '@nestjs/common'

import { ERoleName } from '../interfaces/ERoleName'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: ERoleName[]) => SetMetadata(ROLES_KEY, roles)
