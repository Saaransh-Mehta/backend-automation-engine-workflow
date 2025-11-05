import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EngineController } from './engine.controller';
import { EngineService } from './engine.service';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports:[
    BullModule.forRoot({
      connection:{port:6379,host:'localhost'}
    }),
    BullModule.registerQueue(
      {name:"jobQueue"},
      {name:"deadLetterQueue"}
    )
  ],
  controllers: [EngineController],
  providers: [EngineService]
})
export class EngineModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(EngineController)
  }
}
