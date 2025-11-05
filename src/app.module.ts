import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { EngineModule } from './engine/engine.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [AuthModule, JobsModule, EngineModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
