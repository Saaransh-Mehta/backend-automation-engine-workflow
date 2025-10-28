import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { EngineModule } from './engine/engine.module';

@Module({
  imports: [AuthModule, JobsModule, EngineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
