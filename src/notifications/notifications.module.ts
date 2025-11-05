import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports:[
    BullModule.forRoot({
      connection:{port:6379,host:'localhost'}
    }),
    BullModule.registerQueue(
      {name:"notificationQueue"},{
        name:"deadNotiQueue"
      }
    )
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(NotificationsController)
  }
}
