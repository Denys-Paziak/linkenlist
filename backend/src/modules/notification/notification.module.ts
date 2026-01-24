import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { NotificationController } from './controllers/notification.controller'
import { Notification } from './entities/Notification.entity'
import { NotificationCommandService } from './services/notification-command.service'
import { NotificationQueryService } from './services/notification-query.service'
import { NotificationSystemService } from './services/notification-system.service'

@Module({
	imports: [TypeOrmModule.forFeature([Notification])],
	controllers: [NotificationController],
	providers: [NotificationQueryService, NotificationCommandService, NotificationSystemService],
	exports: [NotificationSystemService]
})
export class NotificationModule {}
