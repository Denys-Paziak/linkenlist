import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuditController } from './controllers/audit.controller'
import { AuditLog } from './entities/AuditLog.entity'
import { AuditService } from './services/audit.service'

@Module({
	imports: [TypeOrmModule.forFeature([AuditLog])],
	controllers: [AuditController],
	providers: [AuditService]
})
export class AuditModule {}
