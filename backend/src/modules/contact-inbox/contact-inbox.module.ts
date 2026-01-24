import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TurnstileModule } from '../turnstile/turnstile.module'

import { ContactInboxAdminController } from './controllers/contact-inbox-admin.controller'
import { ContactInboxController } from './controllers/contact-inbox.controller'
import { ContactInbox } from './entities/ContactInbox.entity'
import { ContactInboxMessage } from './entities/ContactInboxMessage.entity'
import { ContactInboxCommandService } from './service/contact-inbox-command.service'
import { ContactInboxQueryService } from './service/contact-inbox-query.service'
import { UserModule } from '../user/user.module'
import { NotificationModule } from '../notification/notification.module'

@Module({
	imports: [TypeOrmModule.forFeature([ContactInbox, ContactInboxMessage]), TurnstileModule, UserModule, NotificationModule],
	controllers: [ContactInboxController, ContactInboxAdminController],
	providers: [ContactInboxCommandService, ContactInboxQueryService]
})
export class ContactInboxModule {}
